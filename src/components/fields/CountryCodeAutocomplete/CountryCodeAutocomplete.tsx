import { Autocomplete, TextField } from '@mui/material';
import React, { useMemo } from 'react';

export const CountryCodesEn: Readonly<Record<string, string>> = {
  at: 'Austria',
  be: 'Belgium',
  bg: 'Bulgaria',
  cy: 'Cypress',
  cz: 'Czech Republic',
  de: 'Germany',
  dk: 'Denmark',
  ee: 'Estonia',
  es: 'Spain',
  fi: 'Finland',
  fr: 'France',
  gr: 'Greece',
  hr: 'Croatia',
  hu: 'Hungary',
  ie: 'Ireland',
  it: 'Italy',
  lt: 'Lithuania',
  lu: 'Luxembourg',
  lv: 'Latvia',
  mt: 'Malta',
  nl: 'Netherlands',
  pl: 'Poland',
  pt: 'Portugal',
  ro: 'Romania',
  se: 'Sweden',
  si: 'Slovenia',
  sk: 'Slovakia',
};

const countryOptions = Object.entries(CountryCodesEn).map(([code, name]) => ({
  code,
  name,
}));

interface CountryCodeAutocompleteProps {
  value?: string;
  onChange?: (value: string | null) => void;
  error?: string;
  label?: string;
  fullWidth?: boolean;
}

export const CountryCodeAutocomplete: React.FC<CountryCodeAutocompleteProps> = ({
  value = '',
  onChange,
  error,
  label = 'Country',
  fullWidth = true,
}) => {
  const selectedOption = useMemo(() => countryOptions.find((option) => option.code === value) || null, [value]);

  return (
    <Autocomplete
      options={countryOptions}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.code === value.code}
      value={selectedOption}
      onChange={(_, selectedOption) => onChange?.(selectedOption?.code || null)}
      renderInput={(params) => (
        <TextField {...params} label={label} error={!!error} helperText={error || null} fullWidth={fullWidth} />
      )}
    />
  );
};
