'use client';

import { Box, Paper, Typography, useMediaQuery, useTheme } from '@mui/material';

import { Loader } from 'src/components/Loader';
import { Table } from 'src/components/Table';
import { useEmployees } from 'src/hooks/pages';
import { Employee } from 'src/models';

import { EmployeesGrid } from './EmployeesGrid';
import { FilterBar } from './FilterBar';
import { useColumns } from './useColumns';

export const Employees = () => {
  const { employees, loading, resetFilters, updateFilters, filters, deleteEmployee } = useEmployees();
  const columns = useColumns(deleteEmployee);
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <FilterBar filters={filters} updateFilters={updateFilters} resetFilters={resetFilters} />

      <Box
        component={Paper}
        variant="outlined"
        flexGrow={1}
        position="relative"
        sx={{
          borderRadius: '15px',
          overflowX: 'auto',
        }}
      >
        <Loader
          sx={{ mb: 3, minHeight: 150, position: 'absolute' }}
          loading={loading}
          render={() =>
            employees?.length > 0 ? (
              isTablet ? (
                <EmployeesGrid employees={employees} />
              ) : (
                <Table<Employee>
                  headerBackground="white"
                  sx={{ maxHeight: '100%' }}
                  columns={columns}
                  data={employees}
                />
              )
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography variant="h5" color="textSecondary">
                  No data found
                </Typography>
              </Box>
            )
          }
        />
      </Box>
    </>
  );
};
