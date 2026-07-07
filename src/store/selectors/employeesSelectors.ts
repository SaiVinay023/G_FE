import { RootState } from 'src/store';

export const selectEmployeesState = (state: RootState) => state.employees;
export const selectEmployees = (state: RootState) => selectEmployeesState(state).employees;
export const selectEmployeesFilters = (state: RootState) => selectEmployeesState(state).filters;
export const selectEmployeesLoading = (state: RootState) => selectEmployeesState(state).loading;
export const selectEmployeesError = (state: RootState) => selectEmployeesState(state).error;
export const selectEmployeesCreating = (state: RootState) => selectEmployeesState(state).creating;
export const selectEmployeesCreateError = (state: RootState) => selectEmployeesState(state).createError;
export const selectEmployeesDeleting = (state: RootState) => selectEmployeesState(state).deleting;
export const selectEmployeesDeleteError = (state: RootState) => selectEmployeesState(state).deleteError;
