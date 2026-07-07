'use client';

import { Box, Paper, Typography, useMediaQuery, useTheme } from '@mui/material';

import { Loader } from 'src/components/Loader';
import { Table } from 'src/components/Table';
import { useCustomers } from 'src/hooks/pages';
import { useRouter } from 'src/i18n/routing';
import { Customer } from 'src/models';

import { CustomersGrid } from './CustomersGrid';
import { FilterBar } from './FilterBar';
import { useColumns } from './useColumns';

export const Customers = () => {
  const router = useRouter();
  const { customers, loading, resetFilters, updateFilters, filters } = useCustomers();
  const columns = useColumns();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const openCustomerPage = (item: Customer) => {
    router.push(`/customers/${item.id}`);
  };

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
        }}
      >
        <Loader
          sx={{ mb: 3, minHeight: 150, position: 'absolute' }}
          loading={loading}
          render={() =>
            customers?.length > 0 ? (
              isTablet ? (
                <CustomersGrid customers={customers} />
              ) : (
                <Table<Customer>
                  headerBackground="white"
                  sx={{ maxHeight: '100%' }}
                  columns={columns}
                  data={customers}
                  onClick={openCustomerPage}
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
