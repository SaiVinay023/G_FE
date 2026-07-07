import { RootState } from 'src/store';

export const selectCustomersState = (state: RootState) => state.customers;
export const selectCustomers = (state: RootState) => selectCustomersState(state).customers;
export const selectCustomersFilters = (state: RootState) => selectCustomersState(state).filters;
export const selectCustomersLoading = (state: RootState) => selectCustomersState(state).loading;
export const selectCustomersError = (state: RootState) => selectCustomersState(state).error;
export const selectCustomersCreating = (state: RootState) => selectCustomersState(state).creating;
export const selectCustomersCreateError = (state: RootState) => selectCustomersState(state).createError;
export const selectCreatedCustomer = (state: RootState) => selectCustomersState(state).createdCustomer;
export const selectCustomersErrorCleared = (state: RootState) => selectCustomersState(state).errorCleared;
