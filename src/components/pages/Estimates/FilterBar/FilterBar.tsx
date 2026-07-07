'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import {
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Button,
  Collapse,
  Paper,
  useMediaQuery,
  IconButton,
  useTheme,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import _ from 'lodash';
import moment, { Moment } from 'moment';
import React, { useCallback, useMemo, useState } from 'react';

import { BuiltInEstimateStatus, BuiltInEstimateStatusValues } from 'src/models';
import { Filters, initialState } from 'src/store/slices/estimatesSlice';
import { getStatusChip } from 'src/utils/getStatusColor';

interface FilterBarProps {
  filters: Filters;
  updateFilters: (filters: Filters) => void;
  resetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters: initialFilters, updateFilters, resetFilters }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const [isExpanded, setIsExpanded] = useState(!isMobile);
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const isFiltersChanged = useMemo(() => JSON.stringify(filters) !== JSON.stringify(initialState.filters), [filters]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateFilters = useCallback(
    _.debounce((newFilters: Filters) => updateFilters(newFilters), 300),
    [],
  );

  const handleInputChange = useCallback(
    (firstFieldName: string, secondFieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const newFilters = {
        ...filters,
        [firstFieldName]: {
          [secondFieldName]: value,
        },
      };
      debouncedUpdateFilters(newFilters);
      setFilters(newFilters);
    },
    [debouncedUpdateFilters, filters],
  );

  const handleStatusChange = useCallback(
    (e: any) => {
      const newFilters = {
        ...filters,
        status: e.target.value,
      };
      updateFilters(newFilters);
      setFilters(newFilters);
    },
    [updateFilters, filters],
  );

  const handleDateChange = useCallback(
    (date: Moment | null) => {
      const newFilters = {
        ...filters,
        creationDate: date ? date.toISOString() : null,
      };
      updateFilters(newFilters);
      setFilters(newFilters);
    },
    [updateFilters, filters],
  );

  const clearFilters = useCallback(() => {
    resetFilters();
    setFilters(initialState.filters);
  }, [resetFilters]);

  return (
    <Box
      sx={{
        pb: 2,
        backgroundColor: '#f5f5f5',
        borderRadius: 1,
      }}
    >
      <Button
        fullWidth={isMobile}
        size="small"
        startIcon={<FilterListIcon />}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? 'Hide Filters' : 'Show Filters'}
      </Button>

      <Collapse in={isExpanded}>
        <Box mt={1.5} pt={1} pb={2} px={2} component={Paper} variant="outlined" sx={{ borderRadius: '15px' }}>
          <Grid
            container
            spacing={3}
            sx={{
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
            }}
          >
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                variant="standard"
                name="customer.name"
                label="Client Name"
                size="small"
                value={filters.customer.name || ''}
                onChange={handleInputChange('customer', 'name')}
                fullWidth
              />
            </Grid>

            <Grid size={{ xs: 12, md: 2, lg: 3 }}>
              <TextField
                name="vehicle.licensePlateNumber"
                label="License Plate"
                variant="standard"
                size="small"
                value={filters.vehicle.licensePlateNumber || ''}
                onChange={handleInputChange('vehicle', 'licensePlateNumber')}
                fullWidth
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <DatePicker
                label="Creation Date"
                value={filters.creationDate ? moment(filters.creationDate) : null}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    variant: 'standard',
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl variant="standard" size="small" fullWidth>
                <InputLabel>Status</InputLabel>
                <Select name="status" value={filters.status || ''} onChange={handleStatusChange}>
                  {BuiltInEstimateStatusValues.map((status) => {
                    const { statusLabel } = getStatusChip(status as BuiltInEstimateStatus);
                    return (
                      <MenuItem key={status} value={status}>
                        {statusLabel}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 'auto', md: 1, xl: 2 }} textAlign="right">
              {isTablet ? (
                <IconButton
                  aria-label="Reset Filters"
                  size="small"
                  disabled={!isFiltersChanged}
                  color="error"
                  onClick={clearFilters}
                  title="Reset Filters"
                >
                  <DeleteIcon />
                </IconButton>
              ) : (
                <Button
                  size="small"
                  disabled={!isFiltersChanged}
                  color="error"
                  onClick={clearFilters}
                  title="Reset Filters"
                >
                  Reset
                </Button>
              )}
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Box>
  );
};
