import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { vehicleApi } from 'src/api/vehicleApi';
import { Vehicle, CreateVehicleRequest } from 'src/models/vehicle';

export interface VehicleState {
  creating: boolean;
  createError: string | null;
  createdVehicle: Vehicle | null;
}

export const initialState: VehicleState = {
  creating: false,
  createError: null,
  createdVehicle: null,
};

export const createVehicleAsync = createAsyncThunk(
  'vehicles/createVehicle',
  async (data: CreateVehicleRequest, { dispatch, rejectWithValue }) => {
    try {
      const result = await dispatch(vehicleApi.endpoints.createVehicle.initiate(data));
      if ('data' in result) {
        return result.data;
      }

      if (result.error) {
        throw result.error;
      }

      throw new Error('Unknown error occurred');
    } catch (error: any) {
      console.error('Create vehicle error:', error);

      let errorMessage = 'Failed to create vehicle. Please try again later.';

      if (error?.data) {
        if (error.data.message) {
          if (Array.isArray(error.data.message)) {
            errorMessage = error.data.message.join(', ');
          } else if (typeof error.data.message === 'string') {
            errorMessage = error.data.message;
          }
        } else if (error.data.error) {
          errorMessage = error.data.error;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      return rejectWithValue(errorMessage);
    }
  },
);

export const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    clearCreateError(state) {
      state.createError = null;
    },
    clearCreatedVehicle(state) {
      state.createdVehicle = null;
    },
    resetCreateState(state) {
      state.createError = null;
      state.createdVehicle = null;
      state.creating = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createVehicleAsync.pending, (state) => {
        state.creating = true;
        state.createError = null;
        state.createdVehicle = null;
      })
      .addCase(createVehicleAsync.fulfilled, (state, action) => {
        state.creating = false;
        state.createError = null;
        state.createdVehicle = action.payload;
      })
      .addCase(createVehicleAsync.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload as string;
        state.createdVehicle = null;
      });
  },
});

export const VehicleActions = {
  ...vehicleSlice.actions,
  createVehicleAsync,
};

export const VehicleReducer = vehicleSlice.reducer;
