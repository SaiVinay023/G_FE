import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'src/store';
import { BuiltInEstimateStatus } from 'src/models';

export const selectEstimatesState = (state: RootState) => state.estimates;

export const selectEstimates = createSelector(selectEstimatesState, (estimatesState) => estimatesState.estimates);

export const selectEstimatesFilters = createSelector(selectEstimatesState, (estimatesState) => estimatesState.filters);

export const selectEstimatesLoading = createSelector(selectEstimatesState, (estimatesState) => estimatesState.loading);

export const selectEstimatesError = createSelector(selectEstimatesState, (estimatesState) => estimatesState.error);

export const selectCurrentEstimate = createSelector(
  selectEstimatesState,
  (estimatesState) => estimatesState.currentEstimate,
);

export const selectCurrentEstimateLoading = createSelector(
  selectEstimatesState,
  (estimatesState) => estimatesState.currentEstimateLoading,
);

export const selectLastFetch = createSelector(selectEstimatesState, (estimatesState) => estimatesState.lastFetch);

export const selectEstimateById = (id: string) =>
  createSelector(selectEstimates, (estimates) => estimates.find((estimate) => estimate.id === id));

export const selectFilteredEstimates = createSelector(
  [selectEstimates, selectEstimatesFilters],
  (estimates, filters) => {
    return estimates.filter((estimate) => {
      if (filters.creationDate && estimate.creationDate !== filters.creationDate) {
        return false;
      }

      if (
        filters.customer.name &&
        !estimate.customer?.user?.firstName?.toLowerCase().includes(filters.customer.name.toLowerCase()) &&
        !estimate.customer?.user?.lastName?.toLowerCase().includes(filters.customer.name.toLowerCase())
      ) {
        return false;
      }

      if (
        filters.vehicle.licensePlateNumber &&
        !estimate.vehicle?.licensePlateNumber?.toLowerCase().includes(filters.vehicle.licensePlateNumber.toLowerCase())
      ) {
        return false;
      }

      if (filters.status !== null && estimate.status !== filters.status) {
        return false;
      }

      return true;
    });
  },
);

export const selectEstimatesByStatus = (status: BuiltInEstimateStatus) =>
  createSelector(selectEstimates, (estimates) => estimates.filter((estimate) => estimate.status === status));

export const selectEstimatesCount = createSelector(selectEstimates, (estimates) => estimates.length);

export const selectFilteredEstimatesCount = createSelector(selectFilteredEstimates, (estimates) => estimates.length);
