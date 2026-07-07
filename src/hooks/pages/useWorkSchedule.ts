'use client';

import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import { workScheduleApi } from 'src/api/workScheduleApi';
import { WorkSchedule, WorkScheduleRequest, BulkWorkScheduleRequest } from 'src/models/work/schedule';
import { AppDispatch } from 'src/store';
import { Filters, WorkScheduleActions } from 'src/store/slices/workScheduleSlice';
import {
  selectWorkSchedules,
  selectWorkScheduleLoading,
  selectWorkScheduleError,
  selectWorkScheduleFilters,
  selectCurrentWorkSchedule,
  selectCurrentWorkScheduleLoading,
} from 'src/store/selectors/workScheduleSelectors';

type UseWorkScheduleContext = {
  workSchedules: WorkSchedule[];
  currentWorkSchedule: WorkSchedule | null;
  loading: boolean;
  currentWorkScheduleLoading: boolean;
  error: string | null;
  filters: Filters;
  fetchWorkSchedules: () => void;
  fetchWorkSchedulesByShopId: (shopId: string) => Promise<WorkSchedule[]>;
  getWorkScheduleById: (id: string) => void;
  createWorkSchedule: (data: WorkScheduleRequest) => Promise<WorkSchedule>;
  createWorkScheduleBulk: (data: BulkWorkScheduleRequest) => Promise<WorkSchedule[]>;
  updateWorkSchedule: (id: string, data: Partial<WorkScheduleRequest>) => Promise<WorkSchedule>;
  updateWorkScheduleBulk: (data: { weeklySchedule: Array<WorkSchedule> }) => Promise<WorkSchedule[]>;
  deleteWorkSchedule: (id: string) => Promise<string>;
  updateFilters: (newFilters: Partial<Filters>) => void;
  resetFilters: () => void;
};

export const useWorkSchedule = (): UseWorkScheduleContext => {
  const dispatch = useDispatch<AppDispatch>();
  const storeWorkSchedules = useSelector(selectWorkSchedules);
  const loading = useSelector(selectWorkScheduleLoading);
  const error = useSelector(selectWorkScheduleError);
  const filters = useSelector(selectWorkScheduleFilters);
  const storeCurrentWorkSchedule = useSelector(selectCurrentWorkSchedule);
  const currentWorkScheduleLoading = useSelector(selectCurrentWorkScheduleLoading);

  const workSchedules = storeWorkSchedules as unknown as WorkSchedule[];
  const currentWorkSchedule = storeCurrentWorkSchedule as unknown as WorkSchedule | null;

  const fetchWorkSchedules = useCallback(() => {
    dispatch(WorkScheduleActions.fetchListStart());
  }, [dispatch]);

  const fetchWorkSchedulesByShopId = useCallback(
    async (shopId: string): Promise<WorkSchedule[]> => {
      try {
        dispatch(WorkScheduleActions.fetchListStart());

        const result = await dispatch(workScheduleApi.endpoints.getSchedulesByShopId.initiate(shopId));

        if ('data' in result) {
          dispatch(WorkScheduleActions.fetchListSuccess(result.data as any));
          return result.data;
        } else if ('error' in result) {
          dispatch(WorkScheduleActions.fetchListFailure(result.error.toString()));
          throw result.error;
        }

        throw new Error('Failed to fetch work schedules');
      } catch (error: any) {
        dispatch(WorkScheduleActions.fetchListFailure(error.message || 'Failed to fetch work schedules'));
        throw error;
      }
    },
    [dispatch],
  );

  const getWorkScheduleById = useCallback(
    (id: string) => {
      dispatch(WorkScheduleActions.fetchWorkScheduleByIdStart(id));
    },
    [dispatch],
  );

  const createWorkSchedule = useCallback(
    async (data: WorkScheduleRequest): Promise<WorkSchedule> => {
      try {
        dispatch(WorkScheduleActions.createWorkSchedule(data as any));

        const toastId = toast.loading('Creating work schedule...');

        const result = await dispatch(workScheduleApi.endpoints.createSchedule.initiate(data));

        if ('data' in result) {
          dispatch(WorkScheduleActions.createWorkScheduleSuccess(result.data as any));
          toast.success('Work schedule created successfully!', { id: toastId });
          return result.data;
        } else if ('error' in result) {
          toast.error(`Failed to create work schedule: ${result.error}`, { id: toastId });
          throw result.error;
        }

        throw new Error('Failed to create work schedule');
      } catch (error: any) {
        dispatch(WorkScheduleActions.createWorkScheduleFailure(error.message || 'Failed to create work schedule'));
        toast.error(`Failed to create work schedule: ${error.message || 'Unknown error'}`);
        throw error;
      }
    },
    [dispatch],
  );

  const createWorkScheduleBulk = useCallback(
    async (data: BulkWorkScheduleRequest): Promise<WorkSchedule[]> => {
      try {
        const toastId = toast.loading('Creating weekly work schedule...');

        const result = await dispatch(workScheduleApi.endpoints.createScheduleBulk.initiate(data));

        if ('data' in result) {
          toast.success('Weekly work schedule created successfully!', { id: toastId });
          return result.data;
        } else if ('error' in result) {
          toast.error(`Failed to create weekly work schedule: ${result.error}`, { id: toastId });
          throw result.error;
        }

        throw new Error('Failed to create weekly work schedule');
      } catch (error: any) {
        toast.error(`Failed to create weekly work schedule: ${error.message || 'Unknown error'}`);
        throw error;
      }
    },
    [dispatch],
  );

  const updateWorkSchedule = useCallback(
    async (id: string, data: Partial<WorkScheduleRequest>): Promise<WorkSchedule> => {
      try {
        dispatch(WorkScheduleActions.updateWorkSchedule({ id, data: data as any }));

        const toastId = toast.loading('Updating work schedule...');

        const result = await dispatch(workScheduleApi.endpoints.updateSchedule.initiate({ id, data }));

        if ('data' in result) {
          dispatch(WorkScheduleActions.updateWorkScheduleSuccess(result.data as any));
          toast.success('Work schedule updated successfully!', { id: toastId });
          return result.data;
        } else if ('error' in result) {
          toast.error(`Failed to update work schedule: ${result.error}`, { id: toastId });
          throw result.error;
        }

        throw new Error('Failed to update work schedule');
      } catch (error: any) {
        dispatch(WorkScheduleActions.updateWorkScheduleFailure(error.message || 'Failed to update work schedule'));
        toast.error(`Failed to update work schedule: ${error.message || 'Unknown error'}`);
        throw error;
      }
    },
    [dispatch],
  );

  const updateWorkScheduleBulk = useCallback(
    async (data: { weeklySchedule: Array<WorkScheduleRequest & { id: string }> }): Promise<WorkSchedule[]> => {
      try {
        dispatch(WorkScheduleActions.updateScheduleBulk(data as any));

        const toastId = toast.loading('Updating weekly work schedule...');

        // Call the API endpoint
        const result = await dispatch(workScheduleApi.endpoints.updateScheduleBulk.initiate(data, { track: true }));

        if ('data' in result) {
          dispatch(WorkScheduleActions.updateScheduleBulkSuccess(result.data as any));
          toast.success('Weekly work schedule updated successfully!', { id: toastId });
          return result.data;
        } else if ('error' in result) {
          toast.error(`Failed to update weekly work schedule: ${result.error}`, { id: toastId });
          throw result.error;
        }

        throw new Error('Failed to update weekly work schedule');
      } catch (error: any) {
        dispatch(
          WorkScheduleActions.updateScheduleBulkFailure(error.message || 'Failed to update weekly work schedule'),
        );
        toast.error(`Failed to update weekly work schedule: ${error.message || 'Unknown error'}`);
        throw error;
      }
    },
    [dispatch],
  );

  const deleteWorkSchedule = useCallback(
    async (id: string): Promise<string> => {
      try {
        dispatch(WorkScheduleActions.deleteWorkSchedule(id));

        const toastId = toast.loading('Deleting work schedule...');

        const result = await dispatch(workScheduleApi.endpoints.deleteSchedule.initiate(id));

        if ('data' in result) {
          dispatch(WorkScheduleActions.deleteWorkScheduleSuccess(id));
          toast.success('Work schedule deleted successfully!', { id: toastId });
          return id;
        } else if ('error' in result) {
          toast.error(`Failed to delete work schedule: ${result.error}`, { id: toastId });
          throw result.error;
        }

        throw new Error('Failed to delete work schedule');
      } catch (error: any) {
        dispatch(WorkScheduleActions.deleteWorkScheduleFailure(error.message || 'Failed to delete work schedule'));
        toast.error(`Failed to delete work schedule: ${error.message || 'Unknown error'}`);
        throw error;
      }
    },
    [dispatch],
  );

  const updateFilters = useCallback(
    (newFilters: Partial<Filters>) => {
      dispatch(WorkScheduleActions.updateFilters(newFilters));
    },
    [dispatch],
  );

  const resetFilters = useCallback(() => {
    dispatch(WorkScheduleActions.resetFilters());
  }, [dispatch]);

  useEffect(() => {
    fetchWorkSchedules();
  }, [fetchWorkSchedules]);

  return {
    workSchedules,
    currentWorkSchedule,
    loading,
    currentWorkScheduleLoading,
    error,
    filters,
    fetchWorkSchedules,
    fetchWorkSchedulesByShopId,
    getWorkScheduleById,
    createWorkSchedule,
    createWorkScheduleBulk,
    updateWorkSchedule,
    updateWorkScheduleBulk,
    deleteWorkSchedule,
    updateFilters,
    resetFilters,
  };
};
