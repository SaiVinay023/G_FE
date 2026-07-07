'use client';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
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
  MenuItem,
} from '@mui/material';
import _ from 'lodash';
import React, { useCallback, useMemo, useState, startTransition } from 'react';

import { Filters, Category, initialState } from 'src/store/slices/cannedJobsSlice';

interface FilterBarProps {
  filters: Filters;
  updateFilters: (filters: Partial<Filters>) => void;
  resetFilters: () => void;
  onAddCannedJob: () => void;
}

export const FilterBar = React.memo<FilterBarProps>(({ filters, updateFilters, resetFilters, onAddCannedJob }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isExpanded, setIsExpanded] = useState(!isMobile);
  const [localSearchValue, setLocalSearchValue] = useState(filters.search || '');

  const isFiltersChanged = useMemo(() => JSON.stringify(filters) !== JSON.stringify(initialState.filters), [filters]);

  // Reduced debounce time from 300ms to 150ms for faster response
  const debouncedUpdateFilters = useCallback(
    _.debounce((newFilters: Partial<Filters>) => {
      startTransition(() => {
        updateFilters(newFilters);
      });
    }, 150),
    [updateFilters],
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      // Update local state immediately for instant visual feedback
      setLocalSearchValue(value);
      // Debounce the actual filter update with startTransition for non-urgent updates
      debouncedUpdateFilters({ search: value });
    },
    [debouncedUpdateFilters],
  );

  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      updateFilters({ category: value as Category });
    },
    [updateFilters],
  );

  const clearFilters = useCallback(() => {
    setLocalSearchValue('');
    resetFilters();
  }, [resetFilters]);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  // Sync local state when filters change externally
  React.useEffect(() => {
    setLocalSearchValue(filters.search || '');
  }, [filters.search]);

  return (
    <Box
      sx={{
        pb: 2,
        backgroundColor: '#f5f5f5',
        borderRadius: 1,
      }}
    >
      <Button fullWidth={isMobile} size="small" startIcon={<FilterListIcon />} onClick={toggleExpanded}>
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
                label="Search Canned Job"
                size="small"
                value={localSearchValue}
                onChange={handleSearchChange}
                fullWidth
                // placeholder="Search Canned Job"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: !isFiltersChanged ? undefined : (
                      <InputAdornment position="end">
                        <IconButton aria-label="Reset Search" onClick={clearFilters} edge="end" size="small">
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                select
                variant="standard"
                name="category"
                label="Category"
                size="small"
                value={filters.category}
                onChange={handleCategoryChange}
                fullWidth
              >
                {Object.values(Category).map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid>
              <Button
                size="small"
                color="primary"
                startIcon={<AddIcon />}
                onClick={onAddCannedJob}
                title="Add Canned Job"
              >
                Add Canned Job
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Box>
  );
});

FilterBar.displayName = 'FilterBar';
