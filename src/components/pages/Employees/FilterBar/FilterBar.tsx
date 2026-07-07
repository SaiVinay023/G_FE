'use client';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import {
  Box,
  TextField,
  Grid,
  Button,
  Collapse,
  Paper,
  IconButton,
  useMediaQuery,
  useTheme,
  InputAdornment,
} from '@mui/material';
import _ from 'lodash';
import { useTranslations } from 'next-intl';
import React, { useCallback, useMemo, useState } from 'react';

import { CreateEmployee } from 'src/components/modals/CreateEmployee';
import { useModal } from 'src/hooks/components/useModal';
import { Filters, initialState } from 'src/store/slices/customersSlice';

interface FilterBarProps {
  filters: Filters;
  updateFilters: (filters: Filters) => void;
  resetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters: initialFilters, updateFilters, resetFilters }) => {
  const t = useTranslations();
  const theme = useTheme();
  const modal = useModal();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isExpanded, setIsExpanded] = useState(!isMobile);
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const isFiltersChanged = useMemo(() => JSON.stringify(filters) !== JSON.stringify(initialState.filters), [filters]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateFilters = useCallback(
    _.debounce((newFilters: Filters) => updateFilters(newFilters), 300),
    [],
  );

  const handleInputChange = useCallback(
    (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const newFilters = {
        ...filters,
        [name]: value,
      };
      debouncedUpdateFilters(newFilters);
      setFilters(newFilters);
    },
    [debouncedUpdateFilters, filters],
  );

  const addEmployee = useCallback(() => {
    modal.openModal(CreateEmployee, {
      onModalResolved: () => {
        // Optionally refresh the employee list after successful creation
        console.log('Employee creation modal resolved');
      },
      onModalRejected: () => {
        console.log('Employee creation modal rejected');
      },
    });
  }, [modal]);

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
                name="name"
                label="Employees Name"
                size="small"
                value={filters.name || ''}
                onChange={handleInputChange('name')}
                fullWidth
                slotProps={{
                  input: !isFiltersChanged
                    ? {}
                    : {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton aria-label="Reset Search" onClick={clearFilters} edge="end">
                              <CloseIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4, lg: 3 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button size="small" color="primary" startIcon={<AddIcon />} title="Add Employee" onClick={addEmployee}>
                {t('Users.addEmployee')}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Box>
  );
};
