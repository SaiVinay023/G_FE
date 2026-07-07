import { baseApi } from './baseApi';
import { CannedJob, CreateCannedJobRequest, UpdateCannedJobRequest } from '../store/slices/cannedJobsSlice';
import { CreateBulkServiceRequest, CreatedService } from './workManagementApi';

export interface GetAllCannedJobsParams {
  includeServices?: boolean;
  shopId?: string;
}

export const cannedJobApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllCannedJobs: build.query<CannedJob[], GetAllCannedJobsParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();

        if (params.includeServices !== undefined) {
          searchParams.append('includeServices', String(params.includeServices));
        }
        if (params.shopId) {
          searchParams.append('shopId', params.shopId);
        }

        const queryString = searchParams.toString();
        return `/api/canned-job/all${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['CannedJob'],
    }),
    getCannedJobById: build.query<CannedJob, string>({
      query: (id) => `/api/canned-job/${id}`,
      providesTags: (result, error, id) => [{ type: 'CannedJob', id }],
    }),
    createPredefinedCannedJob: build.mutation<CannedJob, void>({
      query: () => ({
        url: '/api/canned-job/create/predefined',
        method: 'POST',
      }),
      invalidatesTags: ['CannedJob'],
    }),
    createCannedJob: build.mutation<CannedJob, CreateCannedJobRequest>({
      query: (data) => ({
        url: '/api/canned-job/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['CannedJob'],
    }),
    updateCannedJob: build.mutation<CannedJob, { id: string; data: UpdateCannedJobRequest }>({
      query: ({ id, data }) => ({
        url: `/api/canned-job/update/${id}`,
        method: 'PUT',
        body: data,
      }),
      async onQueryStarted({ id, data }, { dispatch, queryFulfilled, getState }) {
        const patchResult = dispatch(
          cannedJobApi.util.updateQueryData('getAllCannedJobs', { includeServices: true }, (draft) => {
            const index = draft.findIndex((job) => job.id === id);
            if (index !== -1) {
              draft[index] = {
                ...draft[index],
                description: data.description || draft[index].description,
                updatedAt: new Date().toISOString(),
                estimateServiceGroups: data.services
                  ? [
                      {
                        id: draft[index].estimateServiceGroups?.[0]?.id || 'temp-group-id',
                        description: data.description || '',
                        category: data.category || '',
                        macroCategory: data.macroCategory || null,
                        position: data.position || 1,
                        estimateId: draft[index].estimateServiceGroups?.[0]?.estimateId || null,
                        cannedJobId: id,
                        createdAt: draft[index].estimateServiceGroups?.[0]?.createdAt || new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        estimateServices: data.services.map((service, index) => ({
                          id: service.id || `temp-service-${index}`,
                          description: service.description,
                          internalId: service.internalId,
                          manHours: service.manHours.toString(),
                          price: service.price.toString(),
                          total: service.total.toString(),
                          position: service.position,
                          category: service.category || '',
                          estimateServiceGroupId: draft[index].estimateServiceGroups?.[0]?.id || 'temp-group-id',
                          checked: false,
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                        })),
                      },
                    ]
                  : draft[index].estimateServiceGroups,
              };
            }
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'CannedJob', id },
        { type: 'CannedJob', id: 'LIST' },
      ],
    }),
    updateCannedJobWithServices: build.mutation<CannedJob, { id: string; data: UpdateCannedJobRequest }>({
      async queryFn({ id, data }, { dispatch, getState }) {
        try {
          const state = getState() as any;

          let currentJob: CannedJob | undefined;

          const cacheKeys = [
            `getAllCannedJobs({"includeServices":true})`,
            `getAllCannedJobs({})`,
            `getAllCannedJobs(undefined)`,
          ];

          for (const key of cacheKeys) {
            const cachedData = state.api.queries[key]?.data as CannedJob[];
            if (cachedData) {
              currentJob = cachedData.find((job) => job.id === id);
              if (currentJob) break;
            }
          }

          if (!currentJob) {
            const fetchResult = await fetch(`/api/proxy/api/canned-job/${id}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            });

            if (fetchResult.ok) {
              currentJob = await fetchResult.json();
            }
          }

          if (!currentJob) {
            return { error: { status: 404, data: 'Canned job not found' } };
          }

          const estimateServiceGroupId =
            currentJob.estimateServiceGroups?.[0]?.id ||
            currentJob.serviceGroups?.[0]?.id ||
            currentJob.services?.[0]?.id;

          if (!estimateServiceGroupId) {
            return { error: { status: 400, data: 'No service group found for this canned job' } };
          }

          const newServices: CreateBulkServiceRequest[] = [];
          const existingServicesToUpdate = data.services.filter((service) => {
            const hasId = service.id && !service.id.startsWith('temp-');
            if (!hasId) {
              newServices.push({
                internalId: service.internalId,
                description: service.description,
                manHours: Number(service.manHours),
                price: Number(service.price),
                total: Number(service.total),
                position: service.position,
                category: service.category || 'Services',
                estimateServiceGroupId,
                checked: false,
              });
              return false;
            }
            return true;
          });

          let createdServices: CreatedService[] = [];
          if (newServices.length > 0) {
            const createResult = await fetch('/api/proxy/api/work-management/create/balk/service', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify(newServices),
            });

            if (!createResult.ok) {
              const errorText = await createResult.text();
              throw new Error(`Failed to create new services: ${errorText}`);
            }

            createdServices = await createResult.json();
          }

          const allServicesToInclude = [
            ...existingServicesToUpdate,
            ...createdServices.map((service) => ({
              id: service.id,
              internalId: service.internalId,
              description: service.description,
              manHours: Number(service.manHours),
              price: Number(service.price),
              total: Number(service.total),
              position: service.position,
              category: service.category,
            })),
          ];

          const updateData = {
            description: data.description,
            category: data.category,
            macroCategory: data.macroCategory,
            position: data.position,
            shopId: data.shopId,
            serviceGroupId: estimateServiceGroupId,
            services: allServicesToInclude,
          };

          const updateResult = await fetch(`/api/proxy/api/canned-job/update/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(updateData),
          });

          if (!updateResult.ok) {
            const errorText = await updateResult.text();
            throw new Error(`Failed to update canned job: ${errorText}`);
          }

          const updatedJob = await updateResult.json();
          return { data: updatedJob };
        } catch (error) {
          return { error: { status: 500, data: error instanceof Error ? error.message : 'Unknown error' } };
        }
      },
      async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
        const patchResults: any[] = [];

        const cacheKeys = [{ includeServices: true }, {}, undefined];

        cacheKeys.forEach((params) => {
          try {
            const patchResult = dispatch(
              cannedJobApi.util.updateQueryData('getAllCannedJobs', params as any, (draft) => {
                const index = draft.findIndex((job) => job.id === id);
                if (index !== -1) {
                  draft[index] = {
                    ...draft[index],
                    description: data.description || draft[index].description,
                    updatedAt: new Date().toISOString(),
                    estimateServiceGroups: data.services
                      ? [
                          {
                            id:
                              draft[index].estimateServiceGroups?.[0]?.id ||
                              draft[index].serviceGroups?.[0]?.id ||
                              draft[index].services?.[0]?.id ||
                              'temp-group-id',
                            description: data.description || '',
                            category: data.category || '',
                            macroCategory: data.macroCategory || null,
                            position: data.position || 1,
                            estimateId: draft[index].estimateServiceGroups?.[0]?.estimateId || null,
                            cannedJobId: id,
                            createdAt: draft[index].estimateServiceGroups?.[0]?.createdAt || new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            estimateServices: data.services.map((service, serviceIndex) => ({
                              id: service.id || `temp-service-${serviceIndex}`,
                              description: service.description,
                              internalId: service.internalId,
                              manHours: service.manHours.toString(),
                              price: service.price.toString(),
                              total: service.total.toString(),
                              position: service.position,
                              category: service.category || '',
                              estimateServiceGroupId:
                                draft[index].estimateServiceGroups?.[0]?.id ||
                                draft[index].serviceGroups?.[0]?.id ||
                                draft[index].services?.[0]?.id ||
                                'temp-group-id',
                              checked: false,
                              createdAt: new Date().toISOString(),
                              updatedAt: new Date().toISOString(),
                            })),
                          },
                        ]
                      : draft[index].estimateServiceGroups,
                  };
                }
              }),
            );
            patchResults.push(patchResult);
          } catch (error) {}
        });

        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((patchResult) => {
            if (patchResult?.undo) {
              patchResult.undo();
            }
          });
        }
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'CannedJob', id },
        { type: 'CannedJob', id: 'LIST' },
      ],
    }),
    deleteCannedJob: build.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/api/canned-job/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'CannedJob', id },
        { type: 'CannedJob', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetAllCannedJobsQuery,
  useGetCannedJobByIdQuery,
  useCreateCannedJobMutation,
  useUpdateCannedJobMutation,
  useUpdateCannedJobWithServicesMutation,
  useDeleteCannedJobMutation,
} = cannedJobApi;
