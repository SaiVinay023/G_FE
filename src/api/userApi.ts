import { User } from 'src/models';
import { baseApi } from './baseApi';

interface GetUserByClerkUserIdParams {
  clerkUserId: string;
  query?: {
    shop?: boolean;
    address?: boolean;
    contact?: boolean;
  };
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllUsers: build.query<User[], void>({
      query: () => '/api/user/all',
    }),
    getUserById: build.query<User, string>({
      query: (id) => `/api/user/${id}`,
    }),
    createUser: build.mutation<User, Partial<User>>({
      query: (data) => ({
        url: '/api/user/create',
        method: 'POST',
        body: data,
      }),
    }),
    updateUser: build.mutation<User, { id: string; data: Partial<User> }>({
      query: ({ id, data }) => ({
        url: `/api/user/update/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteUser: build.mutation<void, string>({
      query: (id) => ({
        url: `/api/user/delete/${id}`,
        method: 'DELETE',
      }),
    }),
    getUserByClerkUserId: build.query<User, GetUserByClerkUserIdParams>({
      query: ({ clerkUserId, query = {} }) => {
        const params = new URLSearchParams();

        if (query.shop) params.append('shop', 'true');
        if (query.address) params.append('address', 'true');
        if (query.contact) params.append('contact', 'true');

        const queryString = params.toString();
        return `/api/user/auth/${clerkUserId}${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: (result, error, { clerkUserId }) => [
        { type: 'User', id: clerkUserId },
        { type: 'User', id: 'CLERK_USER' },
      ],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserByClerkUserIdQuery,
} = userApi;
