import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Typography, InputAdornment, TextField, List, Card, CardContent, IconButton } from '@mui/material';
import _ from 'lodash';
import { useTranslations } from 'next-intl';
import React, { FC, useState, useCallback, useMemo, useEffect } from 'react';

import { CarWidget } from 'src/components/CarWidget';
import { Loader } from 'src/components/Loader';
import { ResultsContainer, VehicleItem } from 'src/components/modals/CreateEstimate/styles';
import { Customer, GetAllCustomerQueryParams, Vehicle } from 'src/models';
import { initialState } from 'src/store/slices/customersSlice';

export interface SearchResult extends Vehicle {
  name?: string;
  phoneNumber?: string;
  contactPerson?: string; // Add this for routing purposes
}

interface SearchCustomerFormProps {
  customers: Customer[];
  isLoading: boolean;
  isError: boolean;
  filters: GetAllCustomerQueryParams;
  onSelectVehicle: (vehicle: SearchResult) => void;
  selectedVehicle: SearchResult | null;
  updateFilters: (filters: GetAllCustomerQueryParams) => void;
  resetFilters: () => void;
}

export const SearchCustomerForm: FC<SearchCustomerFormProps> = ({
  customers,
  isLoading,
  isError,
  filters: initialFilters,
  onSelectVehicle,
  selectedVehicle,
  updateFilters,
  resetFilters,
}) => {
  const t = useTranslations();
  const [filters, setFilters] = useState<GetAllCustomerQueryParams>(initialFilters);
  const isFiltersChanged = useMemo(() => JSON.stringify(filters) !== JSON.stringify(initialState.filters), [filters]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const debouncedUpdateFilters = useCallback(
    _.debounce((newFilters: GetAllCustomerQueryParams) => updateFilters(newFilters), 300),
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

  const clearFilters = useCallback(() => {
    resetFilters();
    setFilters(initialState.filters);
  }, [resetFilters]);

  useEffect(() => {
    if (customers) {
      const allVehicles = customers
        .filter((customer) => customer.vehicles && customer.vehicles.length > 0)
        .map((customer) =>
          customer.vehicles.map((customerVehicle) => ({
            name: `${customer.user.firstName} ${customer.user.lastName}`,
            phoneNumber: customer.user.contact?.phone ?? '',
            contactPerson: customer.id,
            ...customerVehicle.vehicle,
          })),
        )
        .flat();
      setSearchResults(allVehicles);
    }
  }, [customers]);

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
      <Typography component="label" sx={{ mb: 1 }}>
        Select a customer&#39;s vehicle to get started
      </Typography>

      <TextField
        placeholder={t('SelectCustomerVehicleModal.search')}
        name="customer.name"
        variant="outlined"
        autoComplete="off"
        sx={{ mb: 2 }}
        value={filters.name || ''}
        onChange={handleInputChange('name')}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: !isFiltersChanged ? undefined : (
              <InputAdornment position="end">
                <IconButton aria-label="Reset Search" onClick={clearFilters} edge="end">
                  <CloseIcon />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <ResultsContainer>
        <Loader
          loading={isLoading}
          sx={{ minHeight: 150 }}
          render={() => (
            <>
              {searchResults.length > 0 ? (
                <List disablePadding>
                  {searchResults.map((v) => (
                    <VehicleItem key={v.id} selected={selectedVehicle?.id === v.id} onClick={() => onSelectVehicle(v)}>
                      {v.name} {' | '}
                      {v.licensePlateNumber} {v.make} {v.model}
                    </VehicleItem>
                  ))}
                </List>
              ) : (
                <Box width="100%">
                  {isError && (
                    <Typography color="error">{t('SelectCustomerVehicleModal.error_loading_customers')}</Typography>
                  )}
                  {!isError && <Typography>No vehicles found</Typography>}
                </Box>
              )}
            </>
          )}
        />
      </ResultsContainer>

      {selectedVehicle && <CarWidget showCustomer disableMenu vehicle={selectedVehicle} />}
    </Box>
  );
};
