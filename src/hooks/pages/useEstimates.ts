'use client';

import { useCallback, useMemo, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from 'src/hooks/store';
import type {
  EstimateRes,
  EstimateCreatePayload,
  EstimateWithServiceGroupsPayload,
  GetAllEstimateQueryParams,
} from 'src/models/estimate';
import {
  selectCurrentEstimate,
  selectCurrentEstimateLoading,
  selectEstimates,
  selectEstimatesError,
  selectEstimatesFilters,
  selectEstimatesLoading,
  selectFilteredEstimates,
} from 'src/store/selectors/estimatesSelectors';
import { EstimatesActions, type Filters } from 'src/store/slices/estimatesSlice';

export const useEstimates = () => {
  const dispatch = useAppDispatch();
  const estimates = useAppSelector(selectEstimates);
  const filteredEstimates = useAppSelector(selectFilteredEstimates);
  const loading = useAppSelector(selectEstimatesLoading);
  const error = useAppSelector(selectEstimatesError);
  const filters = useAppSelector(selectEstimatesFilters);
  const currentEstimate = useAppSelector(selectCurrentEstimate);
  const currentEstimateLoading = useAppSelector(selectCurrentEstimateLoading);

  useEffect(() => {
    dispatch(EstimatesActions.fetchListStart({ user: true, vehicle: true, shop: true }));
  }, [dispatch]);

  const updateFilters = useCallback(
    (newFilters: Partial<Filters>) => {
      dispatch(EstimatesActions.updateFilters(newFilters));
    },
    [dispatch],
  );

  const resetFilters = useCallback(() => {
    dispatch(EstimatesActions.resetFilters());
  }, [dispatch]);

  const fetchEstimates = useCallback(
    (params: GetAllEstimateQueryParams = { user: true, vehicle: true, shop: true }) => {
      dispatch(EstimatesActions.fetchListStart(params));
    },
    [dispatch],
  );

  const getEstimateById = useCallback(
    (id: string) => {
      dispatch(EstimatesActions.fetchEstimateByIdStart(id));
    },
    [dispatch],
  );

  const createEstimate = useCallback(
    (data: EstimateCreatePayload): Promise<EstimateRes> => {
      return dispatch(EstimatesActions.createEstimate(data)).unwrap();
    },
    [dispatch],
  );

  const createEstimateWithServiceGroups = useCallback(
    (data: EstimateWithServiceGroupsPayload): Promise<EstimateRes> => {
      return dispatch(EstimatesActions.createEstimateWithServiceGroups(data)).unwrap();
    },
    [dispatch],
  );

  const updateEstimate = useCallback(
    (id: string, data: Partial<EstimateRes>): Promise<EstimateRes> => {
      return dispatch(EstimatesActions.updateEstimate({ id, data })).unwrap();
    },
    [dispatch],
  );

  const deleteEstimate = useCallback(
    async (id: string): Promise<void> => {
      await dispatch(EstimatesActions.deleteEstimate(id)).unwrap();
    },
    [dispatch],
  );

  const resetCurrentEstimate = useCallback(() => {
    dispatch(EstimatesActions.resetCurrentEstimate());
  }, [dispatch]);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.creationDate !== null ||
      filters.customer.name !== null ||
      filters.vehicle.licensePlateNumber !== null ||
      filters.status !== null
    );
  }, [filters]);

  const displayEstimates = useMemo(() => {
    return hasActiveFilters ? filteredEstimates : estimates;
  }, [hasActiveFilters, filteredEstimates, estimates]);

  return {
    estimates: displayEstimates,
    allEstimates: estimates,
    loading,
    error,
    filters,
    currentEstimate,
    currentEstimateLoading,
    hasActiveFilters,

    updateFilters,
    resetFilters,
    fetchEstimates,
    getEstimateById,
    createEstimate,
    createEstimateWithServiceGroups,
    updateEstimate,
    deleteEstimate,
    resetCurrentEstimate,
  };
};
