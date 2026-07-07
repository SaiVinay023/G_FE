import { WorkCard } from 'src/models';

import { baseApi } from './baseApi';

export const cardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllCards: build.query<WorkCard[], void>({
      query: () => '/api/card/all',
    }),
    getCardById: build.query<WorkCard, string>({
      query: (id) => `/api/card/${id}`,
    }),
    getUnassignedCards: build.query<WorkCard[], string>({
      query: (shopId) => `/api/card/unassigned/${shopId}`,
    }),
    getCardStatuses: build.query<string[], void>({
      query: () => '/api/card/statuses',
    }),
    createCard: build.mutation<WorkCard, Partial<any>>({
      query: (data) => ({
        url: '/api/card/create',
        method: 'POST',
        body: data,
      }),
    }),
    updateCard: build.mutation<WorkCard, { id: string; data: Partial<WorkCard> }>({
      query: ({ id, data }) => ({
        url: `/api/card/update/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteCard: build.mutation<void, string>({
      query: (id) => ({
        url: `/api/card/delete/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetAllCardsQuery,
  useGetCardByIdQuery,
  useGetUnassignedCardsQuery,
  useGetCardStatusesQuery,
  useCreateCardMutation,
  useUpdateCardMutation,
  useDeleteCardMutation,
} = cardApi;
