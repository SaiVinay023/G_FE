import { baseApi } from './baseApi';

export const roleApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllRoles: build.query<any[], void>({
      query: () => '/api/role',
    }),
    getRoleByName: build.query<any, string>({
      query: (name) => `/api/role/${name}`,
    }),
    createRole: build.mutation<any, Partial<any>>({
      query: (data) => ({
        url: '/api/role',
        method: 'POST',
        body: data,
      }),
    }),
    updateRole: build.mutation<any, { name: string; data: Partial<any> }>({
      query: ({ name, data }) => ({
        url: `/api/role/${name}`,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const { useGetAllRolesQuery, useGetRoleByNameQuery, useCreateRoleMutation, useUpdateRoleMutation } = roleApi;
