import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { customerApi } from 'src/api/customerApi';
import {
  Customer,
  CreateCustomerRequest,
  CreateCustomerResponse,
  GetAllCustomerQueryParams,
} from 'src/models';

export interface CustomerState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  filters: GetAllCustomerQueryParams;
  creating: boolean;
  createError: string | null;
  createdCustomer: CreateCustomerResponse | null;
  errorCleared: boolean;
  optimisticCustomers: string[];
}

export const initialState: CustomerState = {
  customers: [],
  loading: false,
  error: null,
  filters: {
    user: true,
    vehicle: true,
    name: '',
    email: '',
  },
  creating: false,
  createError: null,
  createdCustomer: null,
  errorCleared: false,
  optimisticCustomers: [],
};

export const fetchCustomersAsync = createAsyncThunk(
  'customers/fetchCustomers',
  async (filters: GetAllCustomerQueryParams, { dispatch, rejectWithValue }) => {
    try {
      const result = await dispatch(
        customerApi.endpoints.getAllCustomers.initiate(filters)
      );
      if ('data' in result) {
        return result.data;
      }
      throw result.error;
    } catch (error: any) {
      return rejectWithValue('Failed to fetch customers');
    }
  }
);

export const createCustomerAsync = createAsyncThunk(
  'customers/createCustomer',
  async (data: CreateCustomerRequest, { dispatch, rejectWithValue }) => {
    try {
      const result = await dispatch(
        customerApi.endpoints.createCustomer.initiate(data)
      );
      if ('data' in result) {
        return result.data;
      }
      if (result.error) throw result.error;
      throw new Error('Unknown error occurred');
    } catch (error: any) {
      console.error('Create customer error:', error);

      let errorMessage = 'Failed to create customer. Please try again later.';
      if (error?.data) {
        if (error.data.message) {
          errorMessage = Array.isArray(error.data.message)
            ? error.data.message.join(', ')
            : error.data.message;
        } else if (error.data.error) {
          errorMessage = error.data.error;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

export const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    addCustomer(
      state,
      action: PayloadAction<{ customer: Customer; tempId?: string }>
    ) {
      const { customer, tempId } = action.payload;

      if (tempId) {
        const tempIndex = state.customers.findIndex((c) => c.id === tempId);
        if (tempIndex !== -1) {
          state.customers[tempIndex] = customer;
          state.optimisticCustomers = state.optimisticCustomers.filter(
            (id) => id !== tempId
          );
        } else {
          state.customers.unshift(customer);
        }
      } else {
        const existingIndex = state.customers.findIndex(
          (c) => c.id === customer.id
        );
        if (existingIndex === -1) {
          if (customer.id.startsWith('temp-')) {
            state.optimisticCustomers.push(customer.id);
          }
          state.customers.unshift(customer);
        } else {
          state.customers[existingIndex] = customer;
        }
      }
    },

    updateCustomerUser(
      state,
      action: PayloadAction<{ customerId: string; user: any }>
    ) {
      const { customerId, user } = action.payload;
      const idx = state.customers.findIndex((c) => c.id === customerId);
      if (idx !== -1) {
        state.customers[idx] = {
          ...state.customers[idx],
          user: { ...state.customers[idx].user, ...user },
        };
      }
    },

    addVehicleToCustomer(
      state,
      action: PayloadAction<{ customerId: string; vehicle: any }>
    ) {
      const customerIndex = state.customers.findIndex(
        (c) => c.id === action.payload.customerId
      );
      if (customerIndex !== -1) {
        if (!state.customers[customerIndex].vehicles) {
          state.customers[customerIndex].vehicles = [];
        }
        const existingVehicleIndex = state.customers[
          customerIndex
        ].vehicles.findIndex((v) => v.vehicle.id === action.payload.vehicle.id);

        if (existingVehicleIndex === -1) {
          state.customers[customerIndex].vehicles.push({
            vehicle: action.payload.vehicle,
          });
        } else {
          state.customers[customerIndex].vehicles[existingVehicleIndex] = {
            vehicle: action.payload.vehicle,
          };
        }
      }
    },

    replaceVehicleForCustomer(
      state,
      action: PayloadAction<{ customerId: string; tempId: string; vehicle: any }>
    ) {
      const { customerId, tempId, vehicle } = action.payload;
      const customerIndex = state.customers.findIndex((c) => c.id === customerId);
      if (customerIndex === -1) return;

      const list = state.customers[customerIndex].vehicles || [];
      const idx = list.findIndex((v) => v?.vehicle?.id === tempId);

      if (idx !== -1) {
        list[idx] = { vehicle };
      } else {
        list.push({ vehicle });
      }
      state.customers[customerIndex].vehicles = list;
    },

    removeVehicleForCustomer(
      state,
      action: PayloadAction<{ customerId: string; vehicleId: string }>
    ) {
      const { customerId, vehicleId } = action.payload;
      const customerIndex = state.customers.findIndex((c) => c.id === customerId);
      if (customerIndex === -1) return;

      const list = state.customers[customerIndex].vehicles || [];
      state.customers[customerIndex].vehicles = list.filter(
        (v) => v?.vehicle?.id !== vehicleId
      );
    },

    removeOptimisticCustomer(state, action: PayloadAction<string>) {
      const customerId = action.payload;
      state.customers = state.customers.filter((c) => c.id !== customerId);
      state.optimisticCustomers = state.optimisticCustomers.filter(
        (id) => id !== customerId
      );
    },

    rollbackCustomer(state, action: PayloadAction<string>) {
      state.customers = state.customers.filter(
        (c) => c.id !== action.payload
      ) as any;
    },

    rollbackVehicles(state, action: PayloadAction<string>) {
      const customerId = action.payload;
      const idx = state.customers.findIndex((c) => c.id === customerId);
      if (idx !== -1) {
        state.customers[idx].vehicles = [];
      }
    },

    updateFilters(
      state,
      action: PayloadAction<Partial<GetAllCustomerQueryParams>>
    ) {
      state.filters = { ...state.filters, ...action.payload };
    },

    resetFilters(state) {
      state.filters = {
        user: true,
        vehicle: true,
        name: '',
        email: '',
      };
    },

    clearCreateError(state) {
      state.createError = null;
      state.errorCleared = true;
    },

    clearCreatedCustomer(state) {
      state.createdCustomer = null;
    },

    resetCreateState(state) {
      state.createError = null;
      state.createdCustomer = null;
      state.creating = false;
      state.errorCleared = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomersAsync.fulfilled, (state, action) => {
        state.loading = false;
        const fetchedCustomers = action.payload || [];
        const optimisticCustomers = state.customers.filter((c) =>
          state.optimisticCustomers.includes(c.id)
        );
        const mergedCustomers = [...optimisticCustomers, ...fetchedCustomers];
        const uniqueCustomers = mergedCustomers.filter(
          (customer, index, self) =>
            index === self.findIndex((c) => c.id === customer.id)
        );
        state.customers = uniqueCustomers;
        state.error = null;
      })
      .addCase(fetchCustomersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createCustomerAsync.pending, (state) => {
        state.creating = true;
        state.createError = null;
        state.createdCustomer = null;
        state.errorCleared = false;
      })
      .addCase(createCustomerAsync.fulfilled, (state, action) => {
        state.creating = false;
        state.createError = null;
        state.createdCustomer = action.payload;
        state.errorCleared = false;
      })
      .addCase(createCustomerAsync.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload as string;
        state.createdCustomer = null;
        state.errorCleared = false;
      });
  },
});

(customersSlice.caseReducers as any).rollbackCustomer = (state: any, action: any) => {
  state.customers = state.customers.filter((c: any) => c.id !== action.payload);
};

export const CustomersActions = {
  ...customersSlice.actions,
  fetchCustomersAsync,
  createCustomerAsync,
};

export const CustomersReducer = customersSlice.reducer;
