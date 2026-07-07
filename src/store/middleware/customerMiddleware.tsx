import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { RootState } from 'src/store';
import { CustomersActions, fetchCustomersAsync } from 'src/store/slices/customersSlice';

const customersListenerMiddleware = createListenerMiddleware();

customersListenerMiddleware.startListening({
  matcher: isAnyOf(CustomersActions.updateFilters, CustomersActions.resetFilters),
  effect: async (_action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const filters = state.customers.filters;
    listenerApi.dispatch(fetchCustomersAsync(filters));
  },
});

// Background reconciliation after optimistic updates
customersListenerMiddleware.startListening({
  matcher: isAnyOf(
    CustomersActions.createCustomerAsync.fulfilled,
    CustomersActions.updateCustomerUser,        // ✅ replaced updateCustomer
    CustomersActions.addVehicleToCustomer,
    CustomersActions.removeOptimisticCustomer
  ),
  effect: async (_action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const filters = state.customers.filters;
    await listenerApi.delay(300);
    listenerApi.dispatch(fetchCustomersAsync(filters));
  },
});

// Rollback on API failure (just notify for now)
customersListenerMiddleware.startListening({
  matcher: isAnyOf(CustomersActions.createCustomerAsync.rejected),
  effect: async (_action, _listenerApi) => {
    // no rollback needed here yet
  },
});

// Explicit user update listener (no rollback defined yet)
customersListenerMiddleware.startListening({
  actionCreator: CustomersActions.updateCustomerUser,
  effect: async (_action, _listenerApi) => {
    try {
      // Could integrate RTK Query confirm logic here if needed
    } catch {
      // rollback not implemented in slice, so leave empty
    }
  },
});

// Vehicle update listener (no rollback defined yet)
customersListenerMiddleware.startListening({
  actionCreator: CustomersActions.addVehicleToCustomer,
  effect: async (_action, _listenerApi) => {
    try {
      // API confirm handled via RTK Query
    } catch {
      // rollback not implemented in slice, so leave empty
    }
  },
});

export const { middleware: customersMiddleware } = customersListenerMiddleware;
