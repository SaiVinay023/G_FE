import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WorkSchedule {
  id: string;
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  notes?: string;
}

export interface Filters {
  employeeId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export interface WorkScheduleState {
  workSchedules: WorkSchedule[];
  loading: boolean;
  currentWorkScheduleLoading: boolean;
  currentWorkSchedule: WorkSchedule | null;
  error: string | null;
  filters: Filters;
}

export const initialState: WorkScheduleState = {
  workSchedules: [],
  loading: false,
  currentWorkScheduleLoading: false,
  currentWorkSchedule: null,
  error: null,
  filters: {
    employeeId: '',
    startDate: '',
    endDate: '',
    status: '',
  },
};

export const workScheduleSlice = createSlice({
  name: 'workSchedule',
  initialState,
  reducers: {
    fetchListStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchListSuccess(state, action: PayloadAction<WorkSchedule[]>) {
      state.loading = false;
      state.workSchedules = action.payload;
    },
    fetchListFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchWorkScheduleByIdStart(state, action: PayloadAction<string>) {
      state.currentWorkScheduleLoading = true;
      state.error = null;
    },
    fetchWorkScheduleByIdSuccess(state, action: PayloadAction<WorkSchedule>) {
      state.currentWorkScheduleLoading = false;
      state.currentWorkSchedule = action.payload;
    },
    fetchWorkScheduleByIdFailure(state, action: PayloadAction<string>) {
      state.currentWorkScheduleLoading = false;
      state.error = action.payload;
    },
    createWorkSchedule(state, action: PayloadAction<WorkSchedule>) {
      state.loading = true;
      state.error = null;
    },
    createWorkScheduleSuccess(state, action: PayloadAction<WorkSchedule>) {
      state.loading = false;
      state.workSchedules = [...state.workSchedules, action.payload];
    },
    createWorkScheduleFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    updateWorkSchedule(state, action: PayloadAction<{ id: string; data: WorkSchedule }>) {
      state.loading = true;
      state.error = null;
    },
    updateWorkScheduleSuccess(state, action: PayloadAction<WorkSchedule>) {
      state.loading = false;
      state.workSchedules = state.workSchedules.map((schedule) =>
        schedule.id === action.payload.id ? action.payload : schedule,
      );
      state.currentWorkSchedule = action.payload;
    },
    updateWorkScheduleFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    updateScheduleBulk(state, action: PayloadAction<{ weeklySchedule: WorkSchedule[] }>) {
      state.loading = true;
      state.error = null;
    },
    updateScheduleBulkSuccess(state, action: PayloadAction<WorkSchedule[]>) {
      state.loading = false;
      const updatedIds = action.payload.map((schedule) => schedule.id);
      const unchangedSchedules = state.workSchedules.filter((schedule) => !updatedIds.includes(schedule.id));
      state.workSchedules = [...unchangedSchedules, ...action.payload];
    },
    updateScheduleBulkFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteWorkSchedule(state, action: PayloadAction<string>) {
      state.loading = true;
      state.error = null;
    },
    deleteWorkScheduleSuccess(state, action: PayloadAction<string>) {
      state.loading = false;
      state.workSchedules = state.workSchedules.filter((schedule) => schedule.id !== action.payload);
      if (state.currentWorkSchedule?.id === action.payload) {
        state.currentWorkSchedule = null;
      }
    },
    deleteWorkScheduleFailure(state, action: PayloadAction<string>) {
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
        employeeId: '',
        startDate: '',
        endDate: '',
        status: '',
      };
      state.loading = true;
    },
  },
});

export const WorkScheduleActions = workScheduleSlice.actions;
export const WorkScheduleReducer = workScheduleSlice.reducer;
