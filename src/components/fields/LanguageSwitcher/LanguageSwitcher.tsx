'use client';

import { Autocomplete, TextField, Box } from '@mui/material';
import { useLocale } from 'next-intl';
import React, { useMemo } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { langaugeSwitcherOptions, useRouter } from 'src/i18n/routing';

interface LanguageSwitcherProps {
  size?: 'small' | 'medium';
  label?: string;
}

export const LanguageSwitcher = ({ size = 'small', label }: LanguageSwitcherProps) => {
  const router = useRouter();
  const currentLocale = useLocale();
  const [locale, setLocale] = useLocalStorage('language', currentLocale);

  const handleLanguageChange = (event: any, newValue: any) => {
    if (!newValue) return;

    const newLocale = newValue.locale;
    const currentPath = window.location.pathname;

    const pathWithoutLocale = currentPath.replace(new RegExp(`^/${currentLocale}(/|$)`), '/');

    document.documentElement.lang = newLocale;
    setLocale(newLocale);

    void router.replace(pathWithoutLocale || '/', { locale: newLocale });
  };

  const languageOptions = useMemo(
    () =>
      langaugeSwitcherOptions.map((lang) => ({
        label: `${lang.flag} ${lang.langauge}`,
        ...lang,
      })),
    [],
  );

  const selectedOption = useMemo(
    () => languageOptions.find((option) => option.locale === locale),
    [languageOptions, locale],
  );

  return (
    <Box width="auto">
      <Autocomplete
        options={languageOptions}
        value={selectedOption || null}
        onChange={handleLanguageChange}
        getOptionLabel={(option) => option.label}
        renderInput={(params) => <TextField {...params} label={label} size={size} variant="outlined" />}
        renderOption={(props, option) => (
          <li {...props} key={option.langauge}>
            {option.flag} {option.langauge}
          </li>
        )}
        fullWidth
      />
    </Box>
  );
};
