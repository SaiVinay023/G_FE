'use client';

import { Box, Paper, Typography, useMediaQuery, useTheme } from '@mui/material';

import { Loader } from 'src/components/Loader';
import { EstimateModal } from 'src/components/modals/EstimateModal';
import { EstimateGrid } from 'src/components/pages/Estimates/EstimateGrid';
import { FilterBar } from 'src/components/pages/Estimates/FilterBar';
import { Table } from 'src/components/Table';
import { useModal } from 'src/hooks/components/useModal';
import { useEstimates } from 'src/hooks/pages';
import { EstimateRes } from 'src/models';

import { useColumns } from './useColumns';

export const Estimates = () => {
  const modal = useModal();
  const { estimates, loading, resetFilters, updateFilters, filters } = useEstimates();
  const columns = useColumns();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const openEstimateModal = (item: EstimateRes) => {
    // @ts-expect-error modal type error
    modal.openModal(EstimateModal, {
      payload: {
        card: item,
      },
      fullHeight: true,
    });
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
            estimates?.length > 0 ? (
              isTablet ? (
                <EstimateGrid estimates={estimates} />
              ) : (
                <Table<EstimateRes>
                  headerBackground="white"
                  sx={{ maxHeight: '100%' }}
                  columns={columns}
                  data={estimates}
                  onClick={(item) => openEstimateModal(item)}
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
