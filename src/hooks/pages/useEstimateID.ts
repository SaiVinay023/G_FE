'use client';

import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from 'src/hooks/store';
import { selectCurrentEstimate, selectCurrentEstimateLoading } from 'src/store/selectors/estimatesSelectors';
import { EstimatesActions } from 'src/store/slices/estimatesSlice';

export const useEstimateID = (estimateId: string) => {
  const dispatch = useAppDispatch();
  const estimate = useAppSelector(selectCurrentEstimate);
  const loading = useAppSelector(selectCurrentEstimateLoading);

  console.log('estimateId', estimateId);
  useEffect(() => {
    dispatch(EstimatesActions.fetchEstimateByIdStart(estimateId));
  }, [dispatch, estimateId]);

  return {
    estimate,
    loading,
  };
};
