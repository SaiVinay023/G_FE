import { baseApi } from './baseApi';
import { WhatsAppCredentials, UpdateWhatsAppCredentialsRequest } from '../models/whatsapp';

export const whatsappApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    updateWhatsAppCredentials: build.mutation<WhatsAppCredentials, UpdateWhatsAppCredentialsRequest>({
      query: (data) => ({
        url: '/api/whatsapp/credentials',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['WhatsApp'],
    }),
    getWhatsAppCredentials: build.query<WhatsAppCredentials, void>({
      query: () => '/api/whatsapp/credentials',
      providesTags: ['WhatsApp'],
    }),
  }),
});

export const { useUpdateWhatsAppCredentialsMutation, useGetWhatsAppCredentialsQuery } = whatsappApi;
