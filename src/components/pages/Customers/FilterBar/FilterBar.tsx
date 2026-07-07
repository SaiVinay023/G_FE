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
import React, { useCallback, useMemo, useState } from 'react';
import { CreateCustomer } from 'src/components/modals/CreateCustomer';
import { useModal } from 'src/hooks/components/useModal';

import { Filters, initialState } from 'src/store/slices/customersSlice';

interface FilterBarProps {
  filters: Filters;
  updateFilters: (filters: Filters) => void;
  resetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters: initialFilters, updateFilters, resetFilters }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isExpanded, setIsExpanded] = useState(!isMobile);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  // Add local state for the unified search input
  const [searchTerm, setSearchTerm] = useState(initialFilters.name || initialFilters.email || '');

  const isFiltersChanged = useMemo(() => JSON.stringify(filters) !== JSON.stringify(initialState.filters), [filters]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateFilters = useCallback(
    _.debounce((newFilters: Filters) => updateFilters(newFilters), 300),
    [],
  );

  // Smart detection that searches both until clearly an email
  const getSearchFilters = (value: string) => {
    if (!value) {
      return { name: '', email: '' };
    }

    // If contains @ and appears to be a complete email, search only email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(value)) {
      return { name: '', email: value };
    }

    // If contains @ but incomplete, search only email
    if (value.includes('@')) {
      return { name: '', email: value };
    }

    // Otherwise, search only name
    return { name: value, email: '' };
  };

  // Updated handler for unified search
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setSearchTerm(value);

      const searchFilters = getSearchFilters(value);

      // Create new filters object
      const newFilters = {
        ...filters,
        ...searchFilters,
      };

      debouncedUpdateFilters(newFilters);
      setFilters(newFilters);
    },
    [debouncedUpdateFilters, filters],
  );

  const clearFilters = useCallback(() => {
    resetFilters();
    setFilters(initialState.filters);
    setSearchTerm('');
  }, [resetFilters]);

  const modal = useModal();

  const addCustomer = () => {
    modal.openModal(CreateCustomer);
  };

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
                name="search"
                label="Search by Name or Email"
                size="small"
                value={searchTerm}
                onChange={handleSearchChange}
                fullWidth
                placeholder="Enter name or email..."
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

            <Grid>
              <Button size="small" color="primary" startIcon={<AddIcon />} title="Add Customer" onClick={addCustomer}>
                Add Customer
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Box>
  );
};
