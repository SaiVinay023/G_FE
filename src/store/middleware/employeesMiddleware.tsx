import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

import { employeeApi } from 'src/api/employeeApi';
import { CreateEmployeeRequest } from 'src/models/employees';
import { RootState } from 'src/store';
import { EmployeesActions } from 'src/store/slices/employeesSlice';

const employeesListenerMiddleware = createListenerMiddleware();

const fetchEmployees = async (listenerApi: any, filters: { name?: string; email?: string; role?: string }) => {
  const result = await listenerApi.dispatch(employeeApi.endpoints.getAllEmployees.initiate({ query: { user: true } }));

  if ('data' in result) {
    let filteredData = result.data;

    // Apply filters
    if (filters.name) {
      filteredData = filteredData.filter((emp) =>
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(filters.name!.toLowerCase()),
      );
    }

    if (filters.email) {
      filteredData = filteredData.filter((emp) => emp.email.toLowerCase().includes(filters.email!.toLowerCase()));
    }

    return filteredData;
  }

  throw result.error;
};

const createEmployee = async (listenerApi: any, data: CreateEmployeeRequest) => {
  const result = await listenerApi.dispatch(employeeApi.endpoints.createEmployee.initiate(data));

  if ('data' in result) {
    return result.data;
  }

  throw result.error;
};

const deleteEmployee = async (listenerApi: any, employeeId: string) => {
  const result = await listenerApi.dispatch(employeeApi.endpoints.deleteEmployee.initiate(employeeId));

  if ('data' in result) {
    return result.data;
  }

  throw result.error;
};

// Fetch employees listener
employeesListenerMiddleware.startListening({
  matcher: isAnyOf(EmployeesActions.fetchEmployeesStart, EmployeesActions.updateFilters, EmployeesActions.resetFilters),
  effect: async (_action, listenerApi) => {
    try {
      const state = listenerApi.getState() as RootState;
      const filters = state.employees.filters;
      const employees = await fetchEmployees(listenerApi, filters);
      listenerApi.dispatch(EmployeesActions.fetchEmployeesSuccess(employees));
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to fetch employees';
      listenerApi.dispatch(EmployeesActions.fetchEmployeesFailure(errorMessage));
    }
  },
});

// Create employee listener
employeesListenerMiddleware.startListening({
  actionCreator: EmployeesActions.addEmployee,
  effect: async (action, listenerApi) => {
    try {
      listenerApi.dispatch(EmployeesActions.createEmployeeStart());

      const employee = await createEmployee(listenerApi, action.payload);

      listenerApi.dispatch(EmployeesActions.createEmployeeSuccess(employee));

      // Optionally refresh the list
      listenerApi.dispatch(EmployeesActions.fetchEmployeesStart());
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to create employee';
      listenerApi.dispatch(EmployeesActions.createEmployeeFailure(errorMessage));
      toast.error(`Failed to create employee: ${errorMessage}`);
    }
  },
});

// Delete employee listener
employeesListenerMiddleware.startListening({
  actionCreator: EmployeesActions.removeEmployee,
  effect: async (action, listenerApi) => {
    try {
      listenerApi.dispatch(EmployeesActions.deleteEmployeeStart());

      await deleteEmployee(listenerApi, action.payload);

      listenerApi.dispatch(EmployeesActions.deleteEmployeeSuccess(action.payload));

      toast.success('Employee deleted successfully');
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to delete employee';
      listenerApi.dispatch(EmployeesActions.deleteEmployeeFailure(errorMessage));
      toast.error(`Failed to delete employee: ${errorMessage}`);
    }
  },
});

export const { middleware: employeesMiddleware } = employeesListenerMiddleware;
