import { baseApi } from './baseApi';

export interface CreateBulkServiceRequest {
  internalId: string;
  description: string;
  manHours: number;
  price: number;
  category?: string;
  estimateServiceGroupId?: string;
  checked?: boolean;
  total: number;
  position: number;
}

export interface CreatedService {
  id: string;
  internalId: string;
  description: string;
  manHours: string;
  price: string;
  position: number;
  category: string;
  estimateServiceGroupId: string;
  checked: boolean;
  total: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateBulkServiceResponse extends Array<CreatedService> {}

export const workManagementApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createBulkServices: build.mutation<CreateBulkServiceResponse, CreateBulkServiceRequest[]>({
      query: (services) => ({
        url: '/api/work-management/create/balk/service',
        method: 'POST',
        body: services,
      }),
      invalidatesTags: ['CannedJob'],
    }),
  }),
});

export const { useCreateBulkServicesMutation } = workManagementApi;
