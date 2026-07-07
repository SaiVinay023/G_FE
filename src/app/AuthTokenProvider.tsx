'use client';

import { useSession } from '@clerk/nextjs';
import { useEffect, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from 'src/hooks/store';
import {
  setToken,
  clearToken,
  setLoading,
  setRefreshing,
  setError,
  selectAuthToken,
  selectIsAuthenticated,
  selectAuthRefreshing,
  selectIsTokenExpiringSoon,
} from 'src/store/slices/authSlice';

export function AuthTokenProvider({ children }: { children: React.ReactNode }) {
  const { session, isLoaded } = useSession();
  const dispatch = useAppDispatch();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Redux state selectors
  const reduxToken = useAppSelector(selectAuthToken);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isRefreshing = useAppSelector(selectAuthRefreshing);
  const isTokenExpiringSoon = useAppSelector(selectIsTokenExpiringSoon);

  // Optimized token fetching function
  const fetchToken = useCallback(
    async (isRefresh = false): Promise<string | null> => {
      if (!session) return null;

      try {
        if (isRefresh) {
          dispatch(setRefreshing(true));
        }

        // Remove the template parameter
        const token = await session.getToken();

        if (token) {
          // Calculate token expiry (Clerk tokens typically expire in 60 minutes)
          const expiry = Date.now() + 60 * 60 * 1000; // 60 minutes from now
          dispatch(setToken({ token, expiry }));

          console.log(`AuthTokenProvider: ${isRefresh ? 'Refreshed' : 'Retrieved'} Clerk token`, {
            tokenLength: token.length,
            expiresIn: '60 minutes',
          });

          return token;
        } else {
          console.warn('AuthTokenProvider: No token received from Clerk');
          dispatch(setError('Failed to get token from Clerk'));
          return null;
        }
      } catch (error) {
        console.error(`AuthTokenProvider: Failed to ${isRefresh ? 'refresh' : 'get'} Clerk token:`, error);
        dispatch(setError(error instanceof Error ? error.message : 'Token fetch failed'));
        return null;
      }
    },
    [session, dispatch],
  );

  // Main token update function
  const updateToken = useCallback(
    async (isRefresh = false) => {
      if (!isLoaded) {
        dispatch(setLoading(true));
        return;
      }

      if (session) {
        await fetchToken(isRefresh);
      } else {
        console.log('AuthTokenProvider: No session, clearing token');
        dispatch(clearToken());
      }
    },
    [isLoaded, session, fetchToken, dispatch],
  );

  // Check for token expiry and refresh if needed
  const checkAndRefreshToken = useCallback(async () => {
    if (isTokenExpiringSoon && !isRefreshing && session) {
      console.log('AuthTokenProvider: Token expiring soon, refreshing...');
      await updateToken(true);
    }
  }, [isTokenExpiringSoon, isRefreshing, session, updateToken]);

  // Initial token setup
  useEffect(() => {
    updateToken(false);
  }, [updateToken]);

  // Set up token refresh interval
  useEffect(() => {
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (isAuthenticated && session) {
      // Check every 5 minutes for token expiry
      intervalRef.current = setInterval(checkAndRefreshToken, 5 * 60 * 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAuthenticated, session, checkAndRefreshToken]);

  // Debug logging (can be removed in production)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('AuthTokenProvider: State update', {
        sessionLoaded: isLoaded,
        hasSession: !!session,
        reduxToken: reduxToken ? 'Present' : 'None',
        isAuthenticated,
        tokenLength: reduxToken?.length || 0,
        isRefreshing,
        isTokenExpiringSoon,
      });
    }
  }, [isLoaded, session, reduxToken, isAuthenticated, isRefreshing, isTokenExpiringSoon]);

  return <>{children}</>;
}
