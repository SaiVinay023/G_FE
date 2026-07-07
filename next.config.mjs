import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,

  // Environment variables configuration
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_API: process.env.NEXT_PUBLIC_API,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_JWT_TEMPLATE: process.env.NEXT_PUBLIC_CLERK_JWT_TEMPLATE,
  },
  
  // Make Next.js aware of env variables we want to use
  publicRuntimeConfig: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_API: process.env.NEXT_PUBLIC_API,
  },

  // Compiler optimizations
  compiler: {
    // Emotion optimization for styled components
    emotion: true,
    // removeConsole: {
    //   exclude: ['error'],
    // },
  },

  output: 'standalone', // Optimized for containerized deployments like Azure
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  transpilePackages: ['mui-tel-input'],

  // Performance optimizations
  experimental: {
    // Enable optimized package imports to reduce bundle size
    optimizePackageImports: [
      // MUI packages (automatically tree-shakes imports)
      '@mui/material',
      '@mui/icons-material',
      '@mui/x-date-pickers',
      '@mui/system',

      // Calendar packages
      '@fullcalendar/core',
      '@fullcalendar/daygrid',
      '@fullcalendar/interaction',
      '@fullcalendar/react',
      '@fullcalendar/timegrid',

      // Utility libraries
      'lodash',
      'moment',

      // Form libraries
      'react-hook-form-mui',

      // State management
      '@reduxjs/toolkit',
      'react-redux',

      // Drag and drop
      '@hello-pangea/dnd',
    ],

    // Enable CSS optimizations for better performance
    cssChunking: true,

    // Use LightningCSS for faster CSS processing (new in Next.js 15)
    useLightningcss: true,

    // Server components optimization
    serverComponentsHmrCache: true,
  },

  // Improve production performance
  productionBrowserSourceMaps: false, // Disabled for faster builds and smaller bundles

  // Disable the X-Powered-By header for better security
  poweredByHeader: false, // Optimize webpack configuration for faster builds

  headers() {
    const locales = ['en', 'de', 'es', 'it', 'nl'];
    return locales.map((locale) => ({
      source: `/${locale}/estimates/public/:path*`,
      headers: [
        {
          key: 'X-Robots-Tag',
          value: 'noindex, nofollow',
        },
      ],
    }));
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tkvwatvbapsmkhyyzbto.supabase.co', // Local development
      },
      {
        protocol: 'https', 
        hostname: 'ylwdmayzofqplbvkxrvr.supabase.co', // Production
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1', // Local development
      },
      {
        protocol: 'https',
        hostname: 'cdn.wheel-size.com',
      },
    ],
  },
};

export default withNextIntl(config);
