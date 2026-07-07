import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';

import { workScheduleApi } from 'src/api/workScheduleApi';
import { WorkScheduleRequest } from 'src/models/work/schedule';
import { RootState } from 'src/store';
import { WorkSchedule, WorkScheduleActions } from 'src/store/slices/workScheduleSlice';

const workScheduleListenerMiddleware = createListenerMiddleware();

const invalidateWorkScheduleTags = (listenerApi: any, ids: string[] = []) => {
  const state = listenerApi.getState() as RootState;
  const shopId = state.shop.data?.id;

  if (shopId) {
    const tags = [{ type: 'WorkSchedule' as const, id: 'LIST' }];

    ids.forEach((id) => tags.push({ type: 'WorkSchedule' as const, id }));

    listenerApi.dispatch(workScheduleApi.util.invalidateTags(tags));
  }
};

const fetchWorkSchedules = async (
  listenerApi: any,
  filters: { employeeId?: string; startDate?: string; endDate?: string; status?: string },
) => {
  const state = listenerApi.getState() as RootState;
  const shopId = state.shop.data?.id;

  if (!shopId) return;

  const result = await listenerApi.dispatch(workScheduleApi.endpoints.getSchedulesByShopId.initiate(shopId));

  if ('data' in result) {
    let filteredData = result.data;

    if (filters.employeeId) {
      filteredData = filteredData.filter((schedule: any) => {
        const employeeId = 'employeeId' in schedule ? schedule.employeeId : undefined;
        return employeeId === filters.employeeId;
      });
    }

    if (filters.startDate || filters.endDate) {
      filteredData = filteredData.filter((schedule: any) => {
        if (!('date' in schedule) || typeof schedule.date !== 'string') {
          return true;
        }

        const scheduleDate = new Date(schedule.date);
        const start = filters.startDate ? new Date(filters.startDate) : new Date(0);
        const end = filters.endDate ? new Date(filters.endDate) : new Date(8640000000000000);

        return scheduleDate >= start && scheduleDate <= end;
      });
    }

    if (filters.status) {
      filteredData = filteredData.filter((schedule: any) => {
        const status = 'status' in schedule ? schedule.status : undefined;
        return status === filters.status;
      });
    }

    return filteredData;
  }

  throw result.error;
};

const fetchWorkScheduleById = async (listenerApi: any, id: string) => {
  const result = await listenerApi.dispatch(workScheduleApi.endpoints.getScheduleById.initiate(id));

  if ('data' in result) return result.data;
  throw result.error;
};

const createWorkSchedule = async (listenerApi: any, data: any) => {
  const scheduleData = data as Partial<WorkScheduleRequest>;
  const result = await listenerApi.dispatch(workScheduleApi.endpoints.createSchedule.initiate(scheduleData));

  if ('data' in result) return result.data;
  throw result.error;
};

const updateWorkSchedule = async (listenerApi: any, id: string, data: any) => {
  const scheduleData = data as Partial<WorkScheduleRequest>;
  const result = await listenerApi.dispatch(
    workScheduleApi.endpoints.updateSchedule.initiate(
      { id, data: scheduleData },
      {
        // Track this mutation result in the cache
        track: true,
      },
    ),
  );

  if ('data' in result) return result.data;
  throw result.error;
};

const updateScheduleBulk = async (listenerApi: any, data: any) => {
  const result = await listenerApi.dispatch(
    workScheduleApi.endpoints.updateScheduleBulk.initiate(data, {
      track: true,
    }),
  );

  if ('data' in result) return result.data;
  throw result.error;
};

const deleteWorkSchedule = async (listenerApi: any, id: string) => {
  const result = await listenerApi.dispatch(workScheduleApi.endpoints.deleteSchedule.initiate(id));

  if ('data' in result) return id;
  throw result.error;
};

workScheduleListenerMiddleware.startListening({
  matcher: isAnyOf(
    WorkScheduleActions.fetchListStart,
    WorkScheduleActions.updateFilters,
    WorkScheduleActions.resetFilters,
  ),
  effect: async (_action, listenerApi) => {
    try {
      const state = listenerApi.getState() as RootState;
      const filters = state.workSchedule.filters;
      const workSchedules = await fetchWorkSchedules(listenerApi, filters);
      listenerApi.dispatch(WorkScheduleActions.fetchListSuccess(workSchedules));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch work schedules';

      listenerApi.dispatch(WorkScheduleActions.fetchListFailure(errorMessage));
      console.error('[WorkSchedule Middleware]', error);
    }
  },
});

workScheduleListenerMiddleware.startListening({
  actionCreator: WorkScheduleActions.fetchWorkScheduleByIdStart,
  effect: async (action, listenerApi) => {
    try {
      const schedule = await fetchWorkScheduleById(listenerApi, action.payload);
      listenerApi.dispatch(WorkScheduleActions.fetchWorkScheduleByIdSuccess(schedule));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch work schedule';

      listenerApi.dispatch(WorkScheduleActions.fetchWorkScheduleByIdFailure(errorMessage));
      console.error('[WorkSchedule Middleware]', error);
    }
  },
});

workScheduleListenerMiddleware.startListening({
  actionCreator: WorkScheduleActions.createWorkSchedule,
  effect: async (action, listenerApi) => {
    try {
      const created = await createWorkSchedule(listenerApi, action.payload);
      listenerApi.dispatch(WorkScheduleActions.createWorkScheduleSuccess(created));

      if (created && created.id) {
        invalidateWorkScheduleTags(listenerApi);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create work schedule';

      listenerApi.dispatch(WorkScheduleActions.createWorkScheduleFailure(errorMessage));
      console.error('[WorkSchedule Middleware]', error);
    }
  },
});

workScheduleListenerMiddleware.startListening({
  actionCreator: WorkScheduleActions.updateWorkSchedule,
  effect: async (action, listenerApi) => {
    try {
      const { id, data } = action.payload;
      const updated = await updateWorkSchedule(listenerApi, id, data);
      listenerApi.dispatch(WorkScheduleActions.updateWorkScheduleSuccess(updated));

      if (updated && updated.id) {
        invalidateWorkScheduleTags(listenerApi, [updated.id]);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update work schedule';

      listenerApi.dispatch(WorkScheduleActions.updateWorkScheduleFailure(errorMessage));
      console.error('[WorkSchedule Middleware]', error);
    }
  },
});

workScheduleListenerMiddleware.startListening({
  actionCreator: WorkScheduleActions.updateScheduleBulk,
  effect: async (action, listenerApi) => {
    try {
      const state = listenerApi.getState() as RootState;
      const shopId = state.shop.data?.id;
      if (!shopId) {
        throw new Error('Shop ID not found');
      }

      const mappedItems = action.payload.weeklySchedule.map((schedule: any) => {
        if (schedule.id && 'day' in schedule && 'dayOff' in schedule && 'start' in schedule && 'finish' in schedule) {
          return {
            ...schedule,
            shopId: schedule.shopId || shopId,
          };
        }

        const item: any = {
          id: schedule.id,
          shopId: shopId,
          day: schedule.day !== undefined ? schedule.day : 0,
          start: schedule.start || schedule.startTime || '',
          finish: schedule.finish || schedule.endTime || '',
          dayOff: schedule.dayOff !== undefined ? schedule.dayOff : false,
          breakFrom: schedule.breakFrom || '',
          breakTo: schedule.breakTo || '',
        };
        return item;
      });

      const requestData: any = {
        weeklySchedule: mappedItems,
      };

      const updatedSchedules = await updateScheduleBulk(listenerApi, requestData);
      listenerApi.dispatch(WorkScheduleActions.updateScheduleBulkSuccess(updatedSchedules));

      if (updatedSchedules && updatedSchedules.length > 0) {
        invalidateWorkScheduleTags(listenerApi);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update work schedules';

      listenerApi.dispatch(WorkScheduleActions.updateScheduleBulkFailure(errorMessage));
      console.error('[WorkSchedule Middleware]', error);
    }
  },
});

workScheduleListenerMiddleware.startListening({
  actionCreator: WorkScheduleActions.deleteWorkSchedule,
  effect: async (action, listenerApi) => {
    try {
      const response = await deleteWorkSchedule(listenerApi, action.payload);
      listenerApi.dispatch(WorkScheduleActions.deleteWorkScheduleSuccess(action.payload));

      invalidateWorkScheduleTags(listenerApi, [action.payload]);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete work schedule';

      listenerApi.dispatch(WorkScheduleActions.deleteWorkScheduleFailure(errorMessage));
      console.error('[WorkSchedule Middleware]', error);
    }
  },
});

export const { middleware: workScheduleMiddleware } = workScheduleListenerMiddleware;
