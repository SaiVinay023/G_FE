/**
 * This module provides runtime configuration for server and client
 * to ensure environment variables are properly accessed
 */

// For client-side access
export function getClientConfig() {
  return {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    apiUrl: process.env.NEXT_PUBLIC_API,
    clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    clerkJwtTemplate: process.env.NEXT_PUBLIC_CLERK_JWT_TEMPLATE,
    facebookAppId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
    facebookConfigId: process.env.NEXT_PUBLIC_FACEBOOK_CONFIG_ID,
  };
}

// For server-side access
export function getServerConfig() {
  return {
    ...getClientConfig(),
    clerkSecretKey: process.env.CLERK_SECRET_KEY,
    facebookAppSecret: process.env.FACEBOOK_APP_SECRET,
  };
}

// Validate required configuration
export function validateConfig() {
  const config = getClientConfig();
  
  if (!config.supabaseUrl) {
    console.error('Required environment variable NEXT_PUBLIC_SUPABASE_URL is missing');
  }
  
  if (!config.supabaseAnonKey) {
    console.error('Required environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY is missing');
  }
  
  if (!config.apiUrl) {
    console.error('Required environment variable NEXT_PUBLIC_API is missing');
  }
  
  if (!config.facebookAppId) {
    console.error('Required environment variable NEXT_PUBLIC_FACEBOOK_APP_ID is missing');
  }
  
  if (!config.facebookConfigId) {
    console.error('Required environment variable NEXT_PUBLIC_FACEBOOK_CONFIG_ID is missing');
  }
  
  return config;
}
