'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from 'src/hooks/store';
import { VehicleActions } from 'src/store/slices/vehicleSlice';
import { CreateVehicleRequest } from 'src/models/vehicle';

export const useVehicles = () => {
  const dispatch = useAppDispatch();

  const creating = useAppSelector((state) => state.vehicles.creating);
  const createError = useAppSelector((state) => state.vehicles.createError);
  const createdVehicle = useAppSelector((state) => state.vehicles.createdVehicle);

  const createVehicle = useCallback(
    async (vehicleData: CreateVehicleRequest) => {
      const result = await dispatch(VehicleActions.createVehicleAsync(vehicleData));
      if (VehicleActions.createVehicleAsync.rejected.match(result)) {
        throw new Error(result.payload as string);
      }
      return result.payload;
    },
    [dispatch],
  );

  const clearCreateError = useCallback(() => {
    dispatch(VehicleActions.clearCreateError());
  }, [dispatch]);

  const clearCreatedVehicle = useCallback(() => {
    dispatch(VehicleActions.clearCreatedVehicle());
  }, [dispatch]);

  const resetCreateState = useCallback(() => {
    dispatch(VehicleActions.resetCreateState());
  }, [dispatch]);

  return {
    creating,
    createError,
    createdVehicle,
    createVehicle,
    clearCreateError,
    clearCreatedVehicle,
    resetCreateState,
  };
};
