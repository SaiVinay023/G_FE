import { Vehicle } from 'src/models';
import { baseApi } from './baseApi';
import { CreateVehicleRequest } from 'src/models/vehicle';

export const vehicleApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createVehicle: build.mutation<Vehicle, CreateVehicleRequest>({
      query: (data) => ({
        url: '/api/vehicle/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Vehicle'],
    }),
  }),
});

export const { useCreateVehicleMutation } = vehicleApi;
