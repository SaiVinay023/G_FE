'use client';

import { useCallback, useEffect } from 'react';

import {
  selectCannedJobs,
  selectCannedJobsError,
  selectCannedJobsFilters,
  selectCannedJobsLoading,
  selectCurrentCannedJob,
  selectCurrentCannedJobLoading,
} from '../../store/selectors/cannedJobsSelectors';
import {
  CannedJobsActions,
  Filters,
  CreateCannedJobRequest,
  UpdateCannedJobRequest,
} from '../../store/slices/cannedJobsSlice';
import { useAppDispatch, useAppSelector } from '../store/index';
import { useUser } from './useUser';

export const useCannedJobs = () => {
  const dispatch = useAppDispatch();
  const cannedJobs = useAppSelector(selectCannedJobs);
  const loading = useAppSelector(selectCannedJobsLoading);
  const error = useAppSelector(selectCannedJobsError);
  const currentCannedJob = useAppSelector(selectCurrentCannedJob);
  const currentCannedJobLoading = useAppSelector(selectCurrentCannedJobLoading);
  const filters = useAppSelector(selectCannedJobsFilters);
  const { shopId } = useUser();

  const updateFilters = useCallback(
    (newFilters: Partial<Filters>) => {
      dispatch(CannedJobsActions.updateFilters(newFilters));
    },
    [dispatch],
  );

  const fetchCannedJobs = useCallback(() => {
    dispatch(CannedJobsActions.fetchListStart());
  }, [dispatch]);

  const resetFilters = useCallback(() => {
    dispatch(CannedJobsActions.resetFilters());
  }, [dispatch]);

  const getCannedJobById = useCallback(
    (id: string) => {
      dispatch(CannedJobsActions.fetchCannedJobByIdStart(id));
    },
    [dispatch],
  );

  const createCannedJob = useCallback(
    (data: Omit<CreateCannedJobRequest, 'shopId'>) => {
      if (!shopId) {
        throw new Error('Shop ID is required to create a canned job');
      }
      return dispatch(CannedJobsActions.createCannedJob({ ...data, shopId }));
    },
    [dispatch, shopId],
  );

  const updateCannedJob = useCallback(
    (id: string, data: Omit<UpdateCannedJobRequest, 'shopId'>) => {
      if (!shopId) {
        throw new Error('Shop ID is required to update a canned job');
      }
      return dispatch(
        CannedJobsActions.updateCannedJob({
          id,
          data: { ...data, shopId },
        }),
      );
    },
    [dispatch, shopId],
  );

  const deleteCannedJob = useCallback(
    (id: string) => {
      return dispatch(CannedJobsActions.deleteCannedJob(id));
    },
    [dispatch],
  );

  // Fetch canned jobs when component mounts or when shopId changes
  useEffect(() => {
    if (shopId) {
      fetchCannedJobs();
    }
  }, [fetchCannedJobs, shopId]);

  return {
    cannedJobs,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    currentCannedJob,
    currentCannedJobLoading,
    fetchCannedJobs,
    getCannedJobById,
    createCannedJob,
    updateCannedJob,
    deleteCannedJob,
  };
};
