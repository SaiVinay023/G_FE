import {
  EstimateRes,
  EstimateCreatePayload,
  EstimateWithServiceGroupsPayload,
  GetAllEstimateQueryParams,
} from 'src/models/estimate';

import { baseApi } from './baseApi';

const providesEstimateList = (result?: EstimateRes[]) =>
  result
    ? [...result.map(({ id }) => ({ type: 'Estimate' as const, id })), { type: 'Estimate' as const, id: 'LIST' }]
    : [{ type: 'Estimate' as const, id: 'LIST' }];

export const estimateApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getEstimates: build.query<EstimateRes[], GetAllEstimateQueryParams | void>({
      query: (params: GetAllEstimateQueryParams = {}) => {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            searchParams.append(key, String(value));
          }
        });

        const queryString = searchParams.toString();
        return `/api/estimate/all${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: providesEstimateList,
    }),
    getEstimateById: build.query<EstimateRes, string>({
      query: (id) => `/api/estimate/${id}`,
      providesTags: (result, error, id) => [{ type: 'Estimate', id }],
    }),
    createEstimate: build.mutation<EstimateRes, EstimateCreatePayload>({
      query: (data) => ({
        url: '/api/estimate/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Estimate', id: 'LIST' }],
    }),
    createEstimateWithServiceGroups: build.mutation<EstimateRes, EstimateWithServiceGroupsPayload>({
      query: (data) => ({
        url: '/api/estimate/create-with-service-groups',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Estimate', id: 'LIST' }],
    }),
    updateEstimate: build.mutation<EstimateRes, { id: string; data: Partial<EstimateRes> }>({
      query: ({ id, data }) => ({
        url: `/api/estimate/update/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Estimate', id },
        { type: 'Estimate', id: 'LIST' },
      ],
    }),
    deleteEstimate: build.mutation<void, string>({
      query: (id) => ({
        url: `/api/estimate/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Estimate', id },
        { type: 'Estimate', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetEstimatesQuery,
  useGetEstimateByIdQuery,
  useCreateEstimateMutation,
  useCreateEstimateWithServiceGroupsMutation,
  useUpdateEstimateMutation,
  useDeleteEstimateMutation,
} = estimateApi;
