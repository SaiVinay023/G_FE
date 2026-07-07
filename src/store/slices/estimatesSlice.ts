import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import {
  BuiltInEstimateStatus,
  EstimateRes,
  EstimateCreatePayload,
  EstimateWithServiceGroupsPayload,
  GetAllEstimateQueryParams,
} from 'src/models';

export interface Filters {
  creationDate: string | null;
  customer: {
    name: string | null;
  };
  vehicle: {
    licensePlateNumber: string | null;
  };
  status: BuiltInEstimateStatus | null;
}

interface EstimatesSliceState {
  estimates: EstimateRes[];
  loading: boolean;
  currentEstimateLoading: boolean;
  currentEstimate: EstimateRes | null;
  error: string | null;
  filters: Filters;
  lastFetch: number | null;
}

const initialFilters: Filters = {
  creationDate: null,
  customer: { name: null },
  vehicle: { licensePlateNumber: null },
  status: null,
};

export const initialState: EstimatesSliceState = {
  estimates: [],
  loading: false,
  currentEstimateLoading: false,
  error: null,
  currentEstimate: null,
  filters: initialFilters,
  lastFetch: null,
};

export const fetchListStart = createAsyncThunk(
  'estimates/fetchListStart',
  async (params: GetAllEstimateQueryParams = {}) => params,
);

export const createEstimate = createAsyncThunk<EstimateRes, EstimateCreatePayload>(
  'estimates/createEstimate',
  async (data) => data as any,
);

export const createEstimateWithServiceGroups = createAsyncThunk<EstimateRes, EstimateWithServiceGroupsPayload>(
  'estimates/createEstimateWithServiceGroups',
  async (data) => data as any,
);

export const updateEstimate = createAsyncThunk<EstimateRes, { id: string; data: Partial<EstimateRes> }>(
  'estimates/updateEstimate',
  async ({ id, data }) => ({ id, data }) as any,
);

export const deleteEstimate = createAsyncThunk<string, string>('estimates/deleteEstimate', async (id) => id);

export const fetchEstimateByIdStart = createAsyncThunk<EstimateRes, string>(
  'estimates/fetchEstimateByIdStart',
  async (id) => id as any,
);

export const estimatesSlice = createSlice({
  name: 'estimates',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    fetchListSuccess(state, action: PayloadAction<EstimateRes[]>) {
      state.loading = false;
      state.estimates = action.payload;
      state.error = null;
      state.lastFetch = Date.now();
    },
    fetchListFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchEstimateByIdSuccess(state, action: PayloadAction<EstimateRes>) {
      state.currentEstimateLoading = false;
      state.currentEstimate = action.payload;
      state.error = null;
    },
    fetchEstimateByIdFailure(state, action: PayloadAction<string>) {
      state.currentEstimateLoading = false;
      state.error = action.payload;
    },
    createEstimateSuccess(state, action: PayloadAction<EstimateRes>) {
      state.loading = false;
      state.estimates = [...state.estimates, action.payload];
      state.currentEstimate = action.payload;
      state.error = null;
    },
    createEstimateFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    createEstimateWithServiceGroupsSuccess(state, action: PayloadAction<EstimateRes>) {
      state.loading = false;
      state.estimates = [...state.estimates, action.payload];
      state.currentEstimate = action.payload;
      state.error = null;
    },
    createEstimateWithServiceGroupsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    updateEstimateSuccess(state, action: PayloadAction<EstimateRes>) {
      state.loading = false;
      state.estimates = state.estimates.map((estimate) =>
        estimate.id === action.payload.id ? action.payload : estimate,
      );
      if (state.currentEstimate?.id === action.payload.id) {
        state.currentEstimate = action.payload;
      }
      state.error = null;
    },
    updateEstimateFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteEstimateSuccess(state, action: PayloadAction<string>) {
      state.loading = false;
      state.estimates = state.estimates.filter((estimate) => estimate.id !== action.payload);
      if (state.currentEstimate?.id === action.payload) {
        state.currentEstimate = null;
      }
      state.error = null;
    },
    deleteEstimateFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    updateFilters(state, action: PayloadAction<Partial<Filters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters(state) {
      state.filters = initialFilters;
    },
    resetCurrentEstimate(state) {
      state.currentEstimate = null;
      state.currentEstimateLoading = false;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListStart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEstimate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEstimateWithServiceGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEstimate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEstimate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEstimateByIdStart.pending, (state) => {
        state.currentEstimateLoading = true;
        state.error = null;
      });
  },
});

export const EstimatesActions = {
  ...estimatesSlice.actions,
  fetchListStart,
  createEstimate,
  createEstimateWithServiceGroups,
  updateEstimate,
  deleteEstimate,
  fetchEstimateByIdStart,
};

export const EstimatesReducer = estimatesSlice.reducer;
