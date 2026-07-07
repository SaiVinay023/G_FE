import { RootState } from '../index';

export const selectVehicleState = (state: RootState) => state.vehicles;
export const selectVehicleCreating = (state: RootState) => selectVehicleState(state).creating;
export const selectVehicleCreateError = (state: RootState) => selectVehicleState(state).createError;
export const selectCreatedVehicle = (state: RootState) => selectVehicleState(state).createdVehicle;
