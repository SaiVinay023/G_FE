import { baseApi } from './baseApi';
import {
  BulkWorkScheduleRequest,
  DeleteWorkScheduleResponse,
  UpdateBulkScheduleRequest,
  WorkSchedule,
  WorkScheduleRequest,
} from 'src/models/work/schedule';

export const workScheduleApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSchedulesByShopId: build.query<WorkSchedule[], string>({
      query: (shopId) => `/api/schedule/shop/${shopId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'WorkSchedule' as const, id })),
              { type: 'WorkSchedule' as const, id: 'LIST' },
            ]
          : [{ type: 'WorkSchedule' as const, id: 'LIST' }],
    }),

    getScheduleById: build.query<WorkSchedule, string>({
      query: (id) => `/api/schedule/${id}`,
      providesTags: (result, error, id) => [{ type: 'WorkSchedule' as const, id }],
    }),

    createSchedule: build.mutation<WorkSchedule, Partial<WorkScheduleRequest>>({
      query: (data) => ({
        url: '/api/schedule/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'WorkSchedule', id: 'LIST' }],
    }),

    createScheduleBulk: build.mutation<WorkSchedule[], BulkWorkScheduleRequest>({
      query: (data) => ({
        url: '/api/schedule/create/bulk',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'WorkSchedule', id: 'LIST' }],
    }),

    updateSchedule: build.mutation<WorkSchedule, { id: string; data: Partial<WorkScheduleRequest> }>({
      query: ({ id, data }) => ({
        url: `/api/schedule/update/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'WorkSchedule', id },
        { type: 'WorkSchedule', id: 'LIST' },
      ],
    }),

    updateScheduleBulk: build.mutation<WorkSchedule[], UpdateBulkScheduleRequest>({
      query: (data) => ({
        url: '/api/schedule/update/bulk',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'WorkSchedule' as const, id })),
              { type: 'WorkSchedule' as const, id: 'LIST' },
            ]
          : [{ type: 'WorkSchedule', id: 'LIST' }],
    }),

    deleteSchedule: build.mutation<DeleteWorkScheduleResponse, string>({
      query: (id) => ({
        url: `/api/schedule/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result) =>
        result
          ? [
              { type: 'WorkSchedule', id: result.id },
              { type: 'WorkSchedule', id: 'LIST' },
            ]
          : [],
    }),
  }),
});

export const {
  useGetSchedulesByShopIdQuery,
  useGetScheduleByIdQuery,
  useCreateScheduleMutation,
  useCreateScheduleBulkMutation,
  useUpdateScheduleMutation,
  useUpdateScheduleBulkMutation,
  useDeleteScheduleMutation,
} = workScheduleApi;
