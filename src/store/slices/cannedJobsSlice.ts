import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum Category {
  All = 'All',
  Parts = 'Parts',
  Services = 'Services',
  Other = 'Other',
}

export interface Filters {
  search?: string;
  category: Category;
  shopId?: string;
}

export interface EstimateService {
  id: string;
  internalId: string;
  description: string;
  manHours: string;
  price: string;
  position: number;
  category: string;
  estimateServiceGroupId: string;
  checked: boolean;
  total: string;
  createdAt: string;
  updatedAt: string;
}

export interface EstimateServiceGroup {
  id: string;
  description: string;
  position: number;
  estimateId: string | null;
  cannedJobId: string;
  category: string | null;
  macroCategory: string | null;
  createdAt: string;
  updatedAt: string;
  estimateServices: EstimateService[];
}

export interface ServiceGroup {
  id: string;
  serviceGroupId: string;
  position: number;
  category: string | null;
  estimatedCost: number;
  createdAt: string;
  updatedAt: string;
  estimateServices: EstimateService[];
}

export interface CannedJob {
  id: string;
  title?: string;
  description?: string;
  serviceGroupId?: string;
  shopId: string;
  createdAt: string;
  updatedAt: string;
  totalServices?: number;
  totalEstimatedCost?: number;
  totalManHours?: number;
  total?: number;
  macroCategory?: string;
  services?: ServiceGroup[];
  serviceGroups?: ServiceGroup[];
  estimateServiceGroups?: EstimateServiceGroup[];
}

export interface CreateCannedJobRequest {
  shopId: string;
  description: string;
  macroCategory?: string | null;
  services: Array<{
    category: string;
    description: string;
    internalId: string;
    manHours: number;
    price: number;
    total: number;
  }>;
}

export interface UpdateCannedJobRequest {
  shopId: string;
  serviceGroupId?: string;
  description: string;
  category?: string;
  macroCategory?: string | null;
  position?: number;
  services: Array<{
    id?: string;
    description: string;
    internalId: string;
    manHours: number;
    price: number;
    total: number;
    position: number;
    category?: string;
  }>;
}

export interface CannedJobsState {
  cannedJobs: CannedJob[];
  loading: boolean;
  currentCannedJobLoading: boolean;
  currentCannedJob: CannedJob | null;
  error: string | null;
  filters: Filters;
}

export const initialState: CannedJobsState = {
  cannedJobs: [],
  loading: false,
  currentCannedJobLoading: false,
  currentCannedJob: null,
  error: null,
  filters: {
    search: '',
    category: Category.All,
  },
};

export const cannedJobsSlice = createSlice({
  name: 'cannedJobs',
  initialState,
  reducers: {
    fetchListStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchListSuccess(state, action: PayloadAction<CannedJob[]>) {
      state.loading = false;
      state.cannedJobs = action.payload;
    },
    fetchListFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchCannedJobByIdStart(state, action: PayloadAction<string>) {
      state.currentCannedJobLoading = true;
      state.error = null;
    },
    fetchCannedJobByIdSuccess(state, action: PayloadAction<CannedJob>) {
      state.currentCannedJobLoading = false;
      state.currentCannedJob = action.payload;
    },
    fetchCannedJobByIdFailure(state, action: PayloadAction<string>) {
      state.currentCannedJobLoading = false;
      state.error = action.payload;
    },
    createCannedJob(state, action: PayloadAction<CreateCannedJobRequest>) {
      state.loading = true;
      state.error = null;
    },
    createCannedJobSuccess(state, action: PayloadAction<CannedJob>) {
      state.loading = false;
      state.cannedJobs = [...state.cannedJobs, action.payload];
    },
    createCannedJobFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    updateCannedJob(state, action: PayloadAction<{ id: string; data: UpdateCannedJobRequest }>) {
      state.loading = true;
      state.error = null;
    },
    updateCannedJobSuccess(state, action: PayloadAction<CannedJob>) {
      state.loading = false;
      state.cannedJobs = state.cannedJobs.map((job) => (job.id === action.payload.id ? action.payload : job));
      if (state.currentCannedJob?.id === action.payload.id) {
        state.currentCannedJob = action.payload;
      }
    },
    updateCannedJobFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteCannedJob(state, action: PayloadAction<string>) {
      state.loading = true;
      state.error = null;
    },
    deleteCannedJobSuccess(state, action: PayloadAction<string>) {
      state.loading = false;
      state.cannedJobs = state.cannedJobs.filter((job) => job.id !== action.payload);
      if (state.currentCannedJob?.id === action.payload) {
        state.currentCannedJob = null;
      }
    },
    deleteCannedJobFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    updateFilters(state, action: PayloadAction<Partial<Filters>>) {
      state.filters = { ...state.filters, ...action.payload };
      state.loading = true;
    },
    resetFilters(state) {
      state.filters = {
        ...state.filters,
        search: '',
      };
      state.loading = true;
    },
  },
});

export const CannedJobsActions = cannedJobsSlice.actions;
export const CannedJobsReducer = cannedJobsSlice.reducer;
