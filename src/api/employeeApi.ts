import { Employee, CreateEmployeeRequest, CreateEmployeeResponse } from 'src/models';
import { baseApi } from './baseApi';

export const employeeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // arg is optional now; supports both getAllEmployees() and getAllEmployees({ query: { user: true } })
    getAllEmployees: build.query<Employee[], { query?: { user?: boolean } } | void>({
      query: (arg) => {
        const query = arg && 'query' in arg ? arg.query : undefined;
        const params =
          query ? Object.fromEntries(Object.entries(query).map(([k, v]) => [k, String(v)])) : undefined;
        const qs = params ? new URLSearchParams(params).toString() : '';
        return qs ? `/api/employee/all?${qs}` : '/api/employee/all';
      },
      transformResponse: (res: any) => {
        if (Array.isArray(res?.data)) return res.data as Employee[];
        if (Array.isArray(res)) return res as Employee[];
        return [];
      },
      providesTags: ['Employee'],
    }),
    getEmployeeById: build.query<Employee, string>({
      query: (id) => `/api/employee/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Employee', id }],
    }),
    createEmployee: build.mutation<CreateEmployeeResponse, CreateEmployeeRequest>({
      query: (data) => ({
        url: '/api/employee/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Employee'],
    }),
    updateEmployee: build.mutation<Employee, { id: string; data: Partial<Employee> }>({
      query: ({ id, data }) => ({
        url: `/api/employee/update/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Employee', id }],
    }),
    deleteEmployee: build.mutation<void, string>({
      query: (id) => ({
        url: `/api/employee/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Employee', id }],
    }),
  }),
});

export const {
  useGetAllEmployeesQuery,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeeApi;
