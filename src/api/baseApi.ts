import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getClientConfig } from '../utils/runtimeConfig';
import { logger } from '../utils/logger';

declare global {
  interface Window {
    Clerk?: {
      session?: {
        getToken: () => Promise<string | null>;
      };
    };
  }
}

const { apiUrl } = getClientConfig();

if (!apiUrl) {
  logger.error('API URL is not configured. Please set NEXT_PUBLIC_API environment variable.');
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/proxy',
    credentials: 'include',
  }),
  tagTypes: [
    'WorkSchedule',
    'User',
    'Shop',
    'Customer',
    'Employee',
    'Estimate',
    'CannedJob',
    'Contact',
    'Card',
    'Vat',
    'Role',
    'WheelSize',
    'Vehicle',
    'Appointment',
    'Calendar', 
    'WhatsApp',
  ],
  endpoints: () => ({}),
});