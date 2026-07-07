import { createListenerMiddleware } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { VehicleActions } from 'src/store/slices/vehicleSlice';

const vehicleListenerMiddleware = createListenerMiddleware();

vehicleListenerMiddleware.startListening({
  actionCreator: VehicleActions.createVehicleAsync.fulfilled,
  effect: (action, listenerApi) => {
    toast.success('Vehicle created successfully');
  },
});

vehicleListenerMiddleware.startListening({
  actionCreator: VehicleActions.createVehicleAsync.rejected,
  effect: (action, listenerApi) => {
    const errorMessage = action.payload as string;
    toast.error(`Failed to create vehicle: ${errorMessage}`);
  },
});

export const { middleware: vehicleMiddleware } = vehicleListenerMiddleware;
