import { createListenerMiddleware, isAnyOf, ListenerEffectAPI, TaskAbortError } from '@reduxjs/toolkit';

import { estimateApi } from 'src/api/estimateApi';
import type {
  EstimateRes,
  EstimateCreatePayload,
  EstimateWithServiceGroupsPayload,
  GetAllEstimateQueryParams,
} from 'src/models/estimate';
import type { RootState } from 'src/store';
import { EstimatesActions } from 'src/store/slices/estimatesSlice';

type AppListenerEffectAPI = ListenerEffectAPI<RootState, any>;

const estimatesListenerMiddleware = createListenerMiddleware();

const handleAsyncOperation = async <T>(
  operation: () => Promise<{ data?: T; error?: any }>,
  onSuccess: (data: T) => void,
  onError: (error: string) => void,
) => {
  try {
    const result = await operation();
    if ('data' in result && result.data) {
      onSuccess(result.data);
    } else if ('error' in result) {
      throw result.error;
    }
  } catch (error: any) {
    const errorMessage = error?.data?.message || error?.message || 'An unexpected error occurred';
    onError(errorMessage);
  }
};

const fetchAllEstimates = async (listenerApi: AppListenerEffectAPI, params: GetAllEstimateQueryParams = {}) => {
  return await listenerApi.dispatch(estimateApi.endpoints.getEstimates.initiate(params));
};

const fetchEstimateById = async (listenerApi: AppListenerEffectAPI, id: string) => {
  return await listenerApi.dispatch(estimateApi.endpoints.getEstimateById.initiate(id));
};

const createEstimate = async (listenerApi: AppListenerEffectAPI, data: EstimateCreatePayload) => {
  return await listenerApi.dispatch(estimateApi.endpoints.createEstimate.initiate(data));
};

const createEstimateWithServiceGroups = async (
  listenerApi: AppListenerEffectAPI,
  data: EstimateWithServiceGroupsPayload,
) => {
  return await listenerApi.dispatch(estimateApi.endpoints.createEstimateWithServiceGroups.initiate(data));
};

const updateEstimate = async (listenerApi: AppListenerEffectAPI, id: string, data: Partial<EstimateRes>) => {
  return await listenerApi.dispatch(estimateApi.endpoints.updateEstimate.initiate({ id, data }));
};

const deleteEstimate = async (listenerApi: AppListenerEffectAPI, id: string) => {
  return await listenerApi.dispatch(estimateApi.endpoints.deleteEstimate.initiate(id));
};

estimatesListenerMiddleware.startListening({
  predicate: (action) => action.type === EstimatesActions.fetchListStart.pending.type,
  effect: async (action, listenerApi) => {
    const params = (action as any).meta.arg as GetAllEstimateQueryParams;
    await handleAsyncOperation(
      () => fetchAllEstimates(listenerApi as AppListenerEffectAPI, params),
      (estimates: EstimateRes[]) => listenerApi.dispatch(EstimatesActions.fetchListSuccess(estimates)),
      (error) => listenerApi.dispatch(EstimatesActions.fetchListFailure(error)),
    );
  },
});

estimatesListenerMiddleware.startListening({
  predicate: (action) => action.type === EstimatesActions.createEstimate.pending.type,
  effect: async (action, listenerApi) => {
    const payload = (action as any).meta.arg as EstimateCreatePayload;
    await handleAsyncOperation(
      () => createEstimate(listenerApi as AppListenerEffectAPI, payload),
      (estimate: EstimateRes) => {
        listenerApi.dispatch(EstimatesActions.createEstimateSuccess(estimate));
        return estimate;
      },
      (error) => {
        listenerApi.dispatch(EstimatesActions.createEstimateFailure(error));
        throw new Error(error);
      },
    );
  },
});

estimatesListenerMiddleware.startListening({
  predicate: (action) => action.type === EstimatesActions.createEstimateWithServiceGroups.pending.type,
  effect: async (action, listenerApi) => {
    const payload = (action as any).meta.arg as EstimateWithServiceGroupsPayload;
    await handleAsyncOperation(
      () => createEstimateWithServiceGroups(listenerApi as AppListenerEffectAPI, payload),
      (estimate: EstimateRes) => {
        listenerApi.dispatch(EstimatesActions.createEstimateWithServiceGroupsSuccess(estimate));
        return estimate;
      },
      (error) => {
        listenerApi.dispatch(EstimatesActions.createEstimateWithServiceGroupsFailure(error));
        throw new Error(error);
      },
    );
  },
});

estimatesListenerMiddleware.startListening({
  predicate: (action) => action.type === EstimatesActions.updateEstimate.pending.type,
  effect: async (action, listenerApi) => {
    const payload = (action as any).meta.arg as { id: string; data: Partial<EstimateRes> };
    const { id, data } = payload;
    await handleAsyncOperation(
      () => updateEstimate(listenerApi as AppListenerEffectAPI, id, data),
      (estimate: EstimateRes) => {
        listenerApi.dispatch(EstimatesActions.updateEstimateSuccess(estimate));
        return estimate;
      },
      (error) => {
        listenerApi.dispatch(EstimatesActions.updateEstimateFailure(error));
        throw new Error(error);
      },
    );
  },
});

estimatesListenerMiddleware.startListening({
  predicate: (action) => action.type === EstimatesActions.deleteEstimate.pending.type,
  effect: async (action, listenerApi) => {
    const id = (action as any).meta.arg as string;
    await handleAsyncOperation(
      () => deleteEstimate(listenerApi as AppListenerEffectAPI, id),
      () => {
        listenerApi.dispatch(EstimatesActions.deleteEstimateSuccess(id));
        return undefined;
      },
      (error) => {
        listenerApi.dispatch(EstimatesActions.deleteEstimateFailure(error));
        throw new Error(error);
      },
    );
  },
});

estimatesListenerMiddleware.startListening({
  predicate: (action) => action.type === EstimatesActions.fetchEstimateByIdStart.pending.type,
  effect: async (action, listenerApi) => {
    const id = (action as any).meta.arg as string;
    await handleAsyncOperation(
      () => fetchEstimateById(listenerApi as AppListenerEffectAPI, id),
      (estimate: EstimateRes) => listenerApi.dispatch(EstimatesActions.fetchEstimateByIdSuccess(estimate)),
      (error) => listenerApi.dispatch(EstimatesActions.fetchEstimateByIdFailure(error)),
    );
  },
});

estimatesListenerMiddleware.startListening({
  matcher: isAnyOf(
    EstimatesActions.createEstimateSuccess,
    EstimatesActions.createEstimateWithServiceGroupsSuccess,
    EstimatesActions.updateEstimateSuccess,
    EstimatesActions.deleteEstimateSuccess,
  ),
  effect: async (_, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const lastFetch = state.estimates.lastFetch;
    const staleThreshold = 5 * 60 * 1000; // 5 minutes

    if (!lastFetch || Date.now() - lastFetch > staleThreshold) {
      listenerApi.dispatch(EstimatesActions.fetchListStart({ user: true, vehicle: true, shop: true }));
    }
  },
});

export const { middleware: estimatesActionsMiddleware } = estimatesListenerMiddleware;
