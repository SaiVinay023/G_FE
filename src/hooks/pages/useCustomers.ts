'use client';

import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'src/hooks/store';
import { CustomersActions, fetchCustomersAsync } from 'src/store/slices/customersSlice';
import {
  selectCustomers,
  selectCustomersFilters,
  selectCustomersLoading,
  selectCustomersError,
  selectCustomersCreating,
  selectCustomersCreateError,
  selectCreatedCustomer,
  selectCustomersErrorCleared,
} from 'src/store/selectors/customersSelectors';
import { CreateCustomerRequest, Customer } from 'src/models';

interface UseCustomersOptions {
  skipAutoFetch?: boolean;
}

export const useCustomers = ({ skipAutoFetch = false }: UseCustomersOptions = {}) => {
  const dispatch = useAppDispatch();

  const filters = useAppSelector(selectCustomersFilters);
  const customers = useAppSelector(selectCustomers);
  const loading = useAppSelector(selectCustomersLoading);
  const error = useAppSelector(selectCustomersError);
  const creating = useAppSelector(selectCustomersCreating);
  const createError = useAppSelector(selectCustomersCreateError);
  const createdCustomer = useAppSelector(selectCreatedCustomer);
  const errorCleared = useAppSelector(selectCustomersErrorCleared);

  const updateFilters = useCallback(
    (newFilters: Partial<typeof filters>) => {
      dispatch(CustomersActions.updateFilters(newFilters));
    },
    [dispatch],
  );

  const resetFilters = useCallback(() => {
    dispatch(CustomersActions.resetFilters());
  }, [dispatch]);

  const createCustomer = useCallback(
    async (customerData: CreateCustomerRequest) => {
      const result = await dispatch(CustomersActions.createCustomerAsync(customerData));
      if (CustomersActions.createCustomerAsync.rejected.match(result)) {
        throw new Error(result.payload as string);
      }
      return result.payload;
    },
    [dispatch],
  );

  const addCustomer = useCallback(
    (customer: Customer, tempId?: string) => {
      dispatch(CustomersActions.addCustomer({ customer, tempId }));
    },
    [dispatch],
  );

  const removeOptimisticCustomer = useCallback(
    (customerId: string) => {
      dispatch(CustomersActions.removeOptimisticCustomer(customerId));
    },
    [dispatch],
  );

  const addVehicleToCustomer = useCallback(
    (customerId: string, vehicle: any) => {
      dispatch(CustomersActions.addVehicleToCustomer({ customerId, vehicle }));
    },
    [dispatch],
  );

  const clearCreateError = useCallback(() => {
    dispatch(CustomersActions.clearCreateError());
  }, [dispatch]);

  const clearCreatedCustomer = useCallback(() => {
    dispatch(CustomersActions.clearCreatedCustomer());
  }, [dispatch]);

  const resetCreateState = useCallback(() => {
    dispatch(CustomersActions.resetCreateState());
  }, [dispatch]);

  useEffect(() => {
    if (!skipAutoFetch) {
      dispatch(fetchCustomersAsync({ user: true, vehicle: true }));
    }
  }, [dispatch, skipAutoFetch]);

  return {
    filters,
    customers,
    loading,
    error,
    creating,
    createError,
    createdCustomer,
    errorCleared,
    updateFilters,
    resetFilters,
    createCustomer,
    addCustomer,
    removeOptimisticCustomer,
    addVehicleToCustomer,
    clearCreateError,
    clearCreatedCustomer,
    resetCreateState,
  };
};
