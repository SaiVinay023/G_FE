import { baseApi } from './baseApi';
import { Vat } from 'src/models';

export const vatApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getVats: build.query<Vat[], void>({
      query: () => '/api/vat',
    }),
  }),
});

export const { useGetVatsQuery } = vatApi;
