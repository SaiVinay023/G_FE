import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../index';

export const selectCannedJobsState = (state: RootState) => state.cannedJobs;
export const selectCannedJobs = (state: RootState) => selectCannedJobsState(state).cannedJobs;
export const selectCannedJobsFilters = (state: RootState) => selectCannedJobsState(state).filters;
export const selectCannedJobsLoading = (state: RootState) => selectCannedJobsState(state).loading;
export const selectCannedJobsError = (state: RootState) => selectCannedJobsState(state).error;
export const selectCurrentCannedJob = (state: RootState) => state.cannedJobs.currentCannedJob;
export const selectCurrentCannedJobLoading = (state: RootState) => state.cannedJobs.currentCannedJobLoading;

export const selectCannedJobById = (id: string) =>
  createSelector(selectCannedJobs, (cannedJobs) => cannedJobs.find((job) => job.id === id));
