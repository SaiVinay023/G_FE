import { baseApi } from './baseApi';
import type {
  Customer,
  CreateCustomerRequest,
  CreateCustomerResponse,
  GetAllCustomerQueryParams,
} from 'src/models';

type UpdateUserArgs = {
  id: string; // <-- userId, not customerId
  firstName?: string;
  lastName?: string;
  contact?: {
    phone?: string;
    email?: string;
  };
  address?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    country?: string;
    zipcode?: string;
  };
};

export const customerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllCustomers: build.query<Customer[], GetAllCustomerQueryParams | void>({
      query: (params: GetAllCustomerQueryParams = {}) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            searchParams.append(key, String(value));
          }
        });
        const queryString = searchParams.toString();
        return `/api/customer/all${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Customer'],
    }),

    getCustomerById: build.query<Customer, string>({
      query: (id) => `/api/customer/${id}`,
      providesTags: (result, error, id) => [{ type: 'Customer', id }],
    }),

    createCustomer: build.mutation<CreateCustomerResponse, CreateCustomerRequest>({
      query: (data) => ({
        url: '/api/customer/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Customer'],
    }),

    updateCustomerUser: build.mutation<Customer, UpdateUserArgs>({
      query: ({ id, ...data }) => ({
        url: `/api/user/update/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Customer'],
    }),

    deleteCustomer: build.mutation<void, string>({
      query: (id) => ({
        url: `/api/customer/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Customer', id }],
    }),
  }),
});

export const {
  useGetAllCustomersQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerUserMutation,
  useDeleteCustomerMutation,
} = customerApi;
