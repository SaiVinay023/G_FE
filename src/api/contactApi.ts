import { baseApi } from './baseApi';

export const contactApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getContactById: build.query<any, string>({
      query: (id) => `/api/contact/${id}`,
    }),
    createContact: build.mutation<any, Partial<any>>({
      query: (data) => ({
        url: '/api/contact/create',
        method: 'POST',
        body: data,
      }),
    }),
    updateContact: build.mutation<any, { id: string; data: Partial<any> }>({
      query: ({ id, data }) => ({
        url: `/api/contact/update/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const { useGetContactByIdQuery, useCreateContactMutation, useUpdateContactMutation } = contactApi;
