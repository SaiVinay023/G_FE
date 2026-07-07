const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  info: (message, ...args) => {
    if (isDevelopment) {
      console.info(`[INFO] ${message}`, ...args);
    }
  },
  warn: (message, ...args) => {
    console.warn(`[WARN] ${message}`, ...args);
  },
  error: (message, ...args) => {
    console.error(`[ERROR] ${message}`, ...args);
  },
  debug: (message, ...args) => {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  },
  // Log environment variables (excluding sensitive information)
  logConfig: () => {
    if (isDevelopment) {
      console.log('[CONFIG] Environment variables:');
      console.log('  NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL || 'not set');
      console.log('  NEXT_PUBLIC_API:', process.env.NEXT_PUBLIC_API || 'not set');
      // Don't log keys and sensitive information
      console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '[set]' : 'not set');
      console.log('  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:', process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? '[set]' : 'not set');
    }
  }
};
