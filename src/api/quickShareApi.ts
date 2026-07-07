import { baseApi } from './baseApi';

interface QuickSharePayload {
  email: string;
  subject: string;
  message: string;
  channel: 'whatsapp' | 'sms' | 'email';
  phone?: string;
}

export const quickShareApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendQuickShare: builder.mutation({
      query: (data: QuickSharePayload) => {
        const payload = {
          //...basePayload,
          subject: data.subject,
          message: data.message,
          //channel: data.channel,
          ...(data.channel === 'email' 
            ? { email: data.email } 
            : { phone: data.phone })
        };

        const endpointMap = {
          email: '/api/quick-share/email',
          sms: '/api/quick-share/sms',
          whatsapp: '/api/quick-share/whatsapp',
        };

        return {
          url: endpointMap[data.channel],
          method: 'POST',
          body: payload, 
        };
      },
    }),
  }),
});

export const { useSendQuickShareMutation } = quickShareApi;