'use client';

import { useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';

import { ConfirmationModal } from 'src/components/modals/ConfirmationModal';
import { useModal } from 'src/hooks/components/useModal';
import { useAppDispatch, useAppSelector } from 'src/hooks/store';
import { Employee, CreateEmployeeRequest } from 'src/models';
import { EmployeeCreateFormData } from 'src/schemas/employeeSchema';
import {
  selectEmployees,
  selectEmployeesError,
  selectEmployeesFilters,
  selectEmployeesLoading,
  selectEmployeesCreating,
  selectEmployeesCreateError,
  selectEmployeesDeleting,
  selectEmployeesDeleteError,
} from 'src/store/selectors/employeesSelectors';
import { EmployeesActions, Filters } from 'src/store/slices/employeesSlice';

export const useEmployees = () => {
  const modal = useModal();
  const dispatch = useAppDispatch();
  const employees = useAppSelector(selectEmployees);
  const loading = useAppSelector(selectEmployeesLoading);
  const error = useAppSelector(selectEmployeesError);
  const filters = useAppSelector(selectEmployeesFilters);
  const creating = useAppSelector(selectEmployeesCreating);
  const createError = useAppSelector(selectEmployeesCreateError);
  const deleting = useAppSelector(selectEmployeesDeleting);
  const deleteError = useAppSelector(selectEmployeesDeleteError);

  // Fetch employees on mount
  useEffect(() => {
    dispatch(EmployeesActions.fetchEmployeesStart());
  }, [dispatch]);

  const updateFilters = useCallback(
    (newFilters: Filters) => {
      dispatch(EmployeesActions.updateFilters(newFilters));
    },
    [dispatch],
  );

  const resetFilters = useCallback(() => {
    dispatch(EmployeesActions.resetFilters());
  }, [dispatch]);

  const createEmployee = useCallback(
    async (formData: EmployeeCreateFormData): Promise<void> => {
      try {
        // Transform form data to API request format with default role and GDPR/TC
        const createRequest: CreateEmployeeRequest = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          contact: {
            email: formData.email,
            phone: formData.phoneNumber,
          },
          address: {
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            zipcode: formData.zipcode,
            city: formData.city,
            country: formData.country,
          },
          role: {
            name: 'Employee', // Default role since we removed roleName field
          },
          password: formData.password,
          // Default to current timestamp for GDPR and TC
          gdprConfirmedAt: new Date().toISOString(),
          tcConfirmedAt: new Date().toISOString(),
          ignoreExisting: true,
        };

        dispatch(EmployeesActions.addEmployee(createRequest));
      } catch (error: any) {
        toast.error(`Failed to create employee: ${error.message || 'Unknown error'}`);
        throw error;
      }
    },
    [dispatch],
  );

  const deleteEmployee = useCallback(
    (employee: Employee) => {
      const employeeName = employee.user ? `${employee.user.firstName} ${employee.user.lastName}` : 'this employee';

      // @ts-expect-error modal type error
      modal.openModal(ConfirmationModal, {
        payload: {
          title: 'Delete Employee',
          content: `Are you sure you want to delete ${employeeName}? This action cannot be undone.`,
          disableSubmit: false,
        },
        onModalResolved: () => {
          dispatch(EmployeesActions.removeEmployee(employee.id));
        },
      });
    },
    [modal, dispatch],
  );

  const clearCreateError = useCallback(() => {
    dispatch(EmployeesActions.clearCreateError());
  }, [dispatch]);

  const clearDeleteError = useCallback(() => {
    dispatch(EmployeesActions.clearDeleteError());
  }, [dispatch]);

  return {
    filters,
    employees,
    loading,
    error,
    creating,
    createError,
    deleting,
    deleteError,

    updateFilters,
    resetFilters,
    createEmployee,
    deleteEmployee,
    clearCreateError,
    clearDeleteError,
  };
};
