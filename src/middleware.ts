import { clerkClient, clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse, NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';

const LOCALES = routing.locales;
const DEFAULT_LOCALE = routing.defaultLocale;
const validPaths = [
  'canned',
  'customers',
  'estimates',
  'scheduling',
  'settings',
  'today',
  'users',
  'chat',
  'sign-in',
  'sign-up',
  'registration',
  'confirm',
];

// Simple function to get locale from Accept-Language header without using Negotiator
function getPreferredLocale(request: NextRequest): string {
  // Try to get locale from cookie first
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && LOCALES.includes(cookieLocale)) {
    return cookieLocale;
  }

  // Otherwise, parse the Accept-Language header manually
  const acceptLanguage = request.headers.get('accept-language') || '';
  const preferredLanguages = acceptLanguage
    .split(',')
    .map((lang) => {
      const [language, weight] = lang.split(';q=');
      return {
        language: language.trim(),
        weight: weight ? parseFloat(weight) : 1.0,
      };
    })
    .sort((a, b) => b.weight - a.weight)
    .map((item) => item.language);

  // Check for exact matches first
  for (const language of preferredLanguages) {
    if (LOCALES.includes(language)) {
      return language;
    }
  }

  // Check for language-only matches (e.g., match 'en' with 'en-US')
  for (const language of preferredLanguages) {
    const languageBase = language.split('-')[0];
    if (LOCALES.includes(languageBase)) {
      return languageBase;
    }
  }

  // Default fallback
  return DEFAULT_LOCALE;
}

// Environment-aware API URL helper
function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_API || 'http://localhost:8080';
}

// Optimized user data fetcher with timeout and error handling
async function fetchUserShopData(userId: string, token: string, clerkDbJwt?: string): Promise<string | null> {
  try {
    const apiUrl = getApiUrl();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5 second timeout

    const userResponse = await fetch(`${apiUrl}/api/user/auth/${userId}?shop=true`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...(clerkDbJwt && { Cookie: `__clerk_db_jwt=${clerkDbJwt}` }),
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (userResponse.ok) {
      const userData = await userResponse.json();
      return userData.shopId || null;
    } else if (userResponse.status === 401 || userResponse.status === 404) {
      // User not found in backend
      return null;
    }

    // For other errors, return null to continue without blocking
    console.warn(`User API returned ${userResponse.status} for user ${userId}`);
    return null;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn(`User API timeout for user ${userId}`);
    } else {
      console.error('Failed to fetch user data in middleware:', error);
    }
    return null;
  }
}

const intlMiddleware = createMiddleware({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
});

const isPublicRoute = createRouteMatcher([
  '/api(.*)',
  '/:locale/ssoCallback',
  '/:locale/registration-sso-callback',
  '/:locale/sign-in(.*)',
  '/:locale/sign-up(.*)',
  '/:locale/registration/confirm',
  '/:locale/estimates/public(.*)',
  '/:locale/confirm/appointment(.*)',
  '/confirm(.*)',
  '/estimates/public(.*)',
  '/:locale/not-found',
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const path = req.nextUrl.pathname;

  // Skip static files
  if (path === '/favicon.ico' || path === '/site.webmanifest') {
    return NextResponse.next();
  }

  // Skip processing for API routes
  if (path.startsWith('/api')) return NextResponse.next();

  let locale = req.cookies.get('NEXT_LOCALE')?.value || getPreferredLocale(req);
  const response = intlMiddleware(req);
  const responseUrl = new URL(response.headers.get('x-url') ?? req.url);
  const segments = responseUrl.pathname.split('/').filter(Boolean);

  // Handle root path special case - redirect to /locale/today
  if (!segments.length || !LOCALES.includes(segments[0])) {
    return NextResponse.redirect(new URL(`/${locale}/today`, req.url));
  }

  // If locale is missing, redirect to the correct locale path
  if (segments.length === 1 || !validPaths.includes(segments[1])) {
    return NextResponse.redirect(new URL(`/${segments[0]}/today`, req.url));
  }

  // Protect private routes with Clerk authentication
  if (!isPublicRoute(req)) {
    const { userId, getToken } = await auth.protect();

    // Check if we already have cached shopId to avoid API call
    const cachedShopId = req.cookies.get('shop-id')?.value;
    const shopIdTimestamp = req.cookies.get('shop-id-ts')?.value;
    const now = Date.now();
    const cacheExpiry = 30 * 60 * 1000; // 30 minutes cache

    let shopId: string | null = null;

    // Use cached shopId if it's still valid
    if (cachedShopId && shopIdTimestamp && now - parseInt(shopIdTimestamp) < cacheExpiry) {
      shopId = cachedShopId;
    } else {
      // Fetch fresh data from API
      const token = await getToken();
      const clerkDbJwt = req.cookies.get('__clerk_db_jwt')?.value;

      if (token) {
        shopId = await fetchUserShopData(userId, token, clerkDbJwt);

        // Cache the result (including null to avoid repeated failed calls)
        if (shopId) {
          response.cookies.set('shop-id', shopId, {
            maxAge: 30 * 60, // 30 minutes
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
          });
          response.cookies.set('shop-id-ts', now.toString(), {
            maxAge: 30 * 60,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
          });
        } else {
          // Cache the null result for 5 minutes to avoid repeated API calls for unregistered users
          response.cookies.set('shop-id', 'none', {
            maxAge: 5 * 60, // 5 minutes
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
          });
          response.cookies.set('shop-id-ts', now.toString(), {
            maxAge: 5 * 60,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
          });
        }
      }
    }

    // Handle shopId logic
    if (!shopId || shopId === 'none') {
      // Only redirect to registration if we're not already on registration pages
      if (!path.includes('/registration/confirm')) {
        return NextResponse.redirect(new URL(`/${locale}/registration/confirm`, req.url));
      }
    } else {
      // Set shopId header for downstream use
      response.headers.set('x-shop-id', shopId);
    }
  }

  response.headers.set('NEXT_LOCALE', locale);
  response.headers.set('x-url', req.url);

  return response;
});

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|apple-touch-icon.png).*)', '/', '/(api|trpc)(.*)'],
};
