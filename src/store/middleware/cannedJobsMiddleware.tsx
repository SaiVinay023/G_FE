import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';

import { cannedJobApi } from 'src/api/cannedJobApi';
import { RootState } from '../index';
import {
  CannedJob,
  CannedJobsActions,
  Category,
  CreateCannedJobRequest,
  UpdateCannedJobRequest,
} from '../slices/cannedJobsSlice';
import { UserActions } from '../slices/userSlice';

const cannedJobsListenerMiddleware = createListenerMiddleware();

const fetchCannedJobs = async (
  listenerApi: any,
  filters: { category?: Category; search?: string; shopId?: string },
) => {
  const result = await listenerApi.dispatch(
    cannedJobApi.endpoints.getAllCannedJobs.initiate({
      includeServices: true,
      shopId: filters.shopId,
    }),
  );

  if ('data' in result) {
    return (result.data as CannedJob[]).filter((job) => {
      const serviceGroups = job.estimateServiceGroups || job.services || job.serviceGroups || [];

      const matchesCategory =
        filters.category === Category.All ||
        serviceGroups.some((group) =>
          group.estimateServices?.some(
            (service) => service.category?.toLowerCase() === filters.category?.toLowerCase(),
          ),
        );

      const matchesSearch =
        !filters.search ||
        job.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
        serviceGroups.some((group) =>
          group.estimateServices?.some((service) =>
            service.description?.toLowerCase().includes(filters.search!.toLowerCase()),
          ),
        );

      return matchesCategory && matchesSearch;
    });
  }

  throw result.error;
};

const fetchCannedJobById = async (listenerApi: any, id: string) => {
  const result = await listenerApi.dispatch(cannedJobApi.endpoints.getCannedJobById.initiate(id));
  if ('data' in result) return result.data;
  throw result.error;
};

const createCannedJob = async (listenerApi: any, data: CreateCannedJobRequest) => {
  const result = await listenerApi.dispatch(cannedJobApi.endpoints.createCannedJob.initiate(data));
  if ('data' in result) return result.data;
  throw result.error;
};

const updateCannedJob = async (listenerApi: any, id: string, data: UpdateCannedJobRequest) => {
  const result = await listenerApi.dispatch(cannedJobApi.endpoints.updateCannedJobWithServices.initiate({ id, data }));
  if ('error' in result) {
    throw new Error(result.error.data || 'Failed to update canned job');
  }
  return result.data;
};

const deleteCannedJob = async (listenerApi: any, id: string) => {
  const result = await listenerApi.dispatch(cannedJobApi.endpoints.deleteCannedJob.initiate(id));
  if ('data' in result) return result.data;
  throw result.error;
};

cannedJobsListenerMiddleware.startListening({
  matcher: isAnyOf(CannedJobsActions.fetchListStart, CannedJobsActions.updateFilters, CannedJobsActions.resetFilters),
  effect: async (_, listenerApi) => {
    try {
      const state = listenerApi.getState() as RootState;
      const filters = state.cannedJobs.filters;
      const userShopId = state.user.shopId;

      const shopId = filters.shopId || userShopId;

      if (!shopId) {
        listenerApi.dispatch(CannedJobsActions.fetchListSuccess([]));
        return;
      }

      const jobs = await fetchCannedJobs(listenerApi, { ...filters, shopId });
      listenerApi.dispatch(CannedJobsActions.fetchListSuccess(jobs));
    } catch (error: any) {
      listenerApi.dispatch(CannedJobsActions.fetchListFailure(error.message || 'Failed to fetch list'));
    }
  },
});

cannedJobsListenerMiddleware.startListening({
  actionCreator: CannedJobsActions.createCannedJob,
  effect: async (action, listenerApi) => {
    try {
      const created = await createCannedJob(listenerApi, action.payload);
      listenerApi.dispatch(CannedJobsActions.createCannedJobSuccess(created));
    } catch (error: any) {
      listenerApi.dispatch(CannedJobsActions.createCannedJobFailure(error.message || 'Failed to create job'));
    }
  },
});

cannedJobsListenerMiddleware.startListening({
  actionCreator: CannedJobsActions.updateCannedJob,
  effect: async (action, listenerApi) => {
    try {
      const { id, data } = action.payload;
      const updated = await updateCannedJob(listenerApi, id, data);
      listenerApi.dispatch(CannedJobsActions.updateCannedJobSuccess(updated));
    } catch (error: any) {
      listenerApi.dispatch(CannedJobsActions.updateCannedJobFailure(error.message || 'Failed to update job'));
    }
  },
});

cannedJobsListenerMiddleware.startListening({
  matcher: cannedJobApi.endpoints.updateCannedJobWithServices.matchFulfilled,
  effect: async (action, listenerApi) => {
    const updatedCannedJob = action.payload as CannedJob;
    const state = listenerApi.getState() as RootState;

    const updatedCannedJobs = state.cannedJobs.cannedJobs.map((job) =>
      job.id === updatedCannedJob.id ? updatedCannedJob : job,
    );

    listenerApi.dispatch(CannedJobsActions.fetchListSuccess(updatedCannedJobs));

    if (state.cannedJobs.currentCannedJob?.id === updatedCannedJob.id) {
      listenerApi.dispatch(CannedJobsActions.fetchCannedJobByIdSuccess(updatedCannedJob));
    }
  },
});

cannedJobsListenerMiddleware.startListening({
  actionCreator: CannedJobsActions.deleteCannedJob,
  effect: async (action, listenerApi) => {
    try {
      await deleteCannedJob(listenerApi, action.payload);
      listenerApi.dispatch(CannedJobsActions.deleteCannedJobSuccess(action.payload));
    } catch (error: any) {
      listenerApi.dispatch(CannedJobsActions.deleteCannedJobFailure(error.message || 'Failed to delete job'));
    }
  },
});

cannedJobsListenerMiddleware.startListening({
  actionCreator: CannedJobsActions.fetchCannedJobByIdStart,
  effect: async (action, listenerApi) => {
    try {
      const job = await fetchCannedJobById(listenerApi, action.payload);
      listenerApi.dispatch(CannedJobsActions.fetchCannedJobByIdSuccess(job));
    } catch (error: any) {
      listenerApi.dispatch(CannedJobsActions.fetchCannedJobByIdFailure(error.message || 'Failed to fetch job'));
    }
  },
});

cannedJobsListenerMiddleware.startListening({
  matcher: isAnyOf(UserActions.fetchUserByClerkIdSuccess, UserActions.createUserSuccess, UserActions.updateUserSuccess),
  effect: async (action, listenerApi) => {
    const user = action.payload as any;
    const state = listenerApi.getState() as RootState;
    if (user?.shopId && state.cannedJobs.cannedJobs.length === 0) {
      listenerApi.dispatch(CannedJobsActions.fetchListStart());
    }
  },
});

export const { middleware: cannedJobsMiddleware } = cannedJobsListenerMiddleware;
