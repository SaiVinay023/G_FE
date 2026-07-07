import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Employee, CreateEmployeeRequest } from 'src/models/employees';

export interface Filters {
  name?: string;
  email?: string;
  role?: string;
}

export interface EmployeesState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  filters: Filters;
  creating: boolean;
  createError: string | null;
  deleting: boolean;
  deleteError: string | null;
}

export const initialState: EmployeesState = {
  employees: [],
  loading: false,
  error: null,
  filters: {
    name: undefined,
    email: undefined,
    role: undefined,
  },
  creating: false,
  createError: null,
  deleting: false,
  deleteError: null,
};

export const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    fetchEmployeesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchEmployeesSuccess(state, action: PayloadAction<Employee[]>) {
      state.loading = false;
      state.employees = action.payload;
      state.error = null;
    },
    fetchEmployeesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    createEmployeeStart(state) {
      state.creating = true;
      state.createError = null;
    },
    createEmployeeSuccess(state, action: PayloadAction<Employee>) {
      state.creating = false;
      state.employees.push(action.payload);
      state.createError = null;
    },
    createEmployeeFailure(state, action: PayloadAction<string>) {
      state.creating = false;
      state.createError = action.payload;
    },
    addEmployee(state, action: PayloadAction<CreateEmployeeRequest>) {
      // Set creating state when the action is dispatched
      state.creating = true;
      state.createError = null;
    },
    deleteEmployeeStart(state) {
      state.deleting = true;
      state.deleteError = null;
    },
    deleteEmployeeSuccess(state, action: PayloadAction<string>) {
      state.deleting = false;
      state.employees = state.employees.filter((employee) => employee.id !== action.payload);
      state.deleteError = null;
    },
    deleteEmployeeFailure(state, action: PayloadAction<string>) {
      state.deleting = false;
      state.deleteError = action.payload;
    },
    removeEmployee(state, action: PayloadAction<string>) {
      // Action to trigger delete process
      state.deleting = true;
      state.deleteError = null;
    },
    updateFilters(state, action: PayloadAction<Partial<Filters>>) {
      state.filters = { ...state.filters, ...action.payload };
      state.loading = true;
    },
    resetFilters(state) {
      state.filters = initialState.filters;
      state.loading = true;
    },
    clearCreateError(state) {
      state.createError = null;
    },
    clearDeleteError(state) {
      state.deleteError = null;
    },
  },
});

export const EmployeesActions = employeesSlice.actions;
export const EmployeesReducer = employeesSlice.reducer;
