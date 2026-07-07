'use client';

import { Box, Button, Stack, TextField, Autocomplete, Grid, CircularProgress, Typography } from '@mui/material';
import { MuiTelInput } from 'mui-tel-input';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { FC, useCallback, useMemo, useState, useEffect } from 'react';
import { useForm, FormContainer, TextFieldElement, Controller } from 'react-hook-form-mui';

import { CountryCodeAutocomplete, LanguageSwitcher } from 'src/components/fields';
import { TimeRangeModal } from 'src/components/modals/TimeRangeModal';
import { useModal } from 'src/hooks/components/useModal';
import { Shop, Vat } from 'src/models';
import { useGetVatsQuery } from 'src/api/vatApi';
import { formatPhoneNumber } from 'src/utils/formatPhoneNumber';
import { useLogoManager } from 'src/hooks/components/useLogoManager';

interface SettingsFormProps<T extends FormData = FormData> {
  shop?: Shop;
  isSaving?: boolean;
  onSave: (data: T) => void;
}

export type FormData = Omit<Shop, 'vatId'> & {
  selectedVat?: Vat | null;
  _logoFile?: File | null;
};

export const SettingsForm: FC<SettingsFormProps> = ({ shop, isSaving = false, onSave }) => {
  const t = useTranslations();
  const modal = useModal();

  // Use the new logo manager hook
  const {
    displayUrl,
    isLoading: logoLoading,
    error: logoError,
    selectedFile,
    handleFileSelect,
    handleImageLoad,
    handleImageError,
    getButtonText,
  } = useLogoManager(shop?.logo);

  const [isUploading, setIsUploading] = useState(false);

  const formContext = useForm<FormData>();
  const { reset, setValue, watch, formState } = formContext;
  const { data: vats = [], isLoading: isLoadingVats } = useGetVatsQuery();
  const initialVat = useMemo<Vat | null>(() => vats.find((vat) => vat.id === shop?.vatId) || null, [shop?.vatId, vats]);
  const selectedVatValue = watch('selectedVat');

  useEffect(() => {
    if (vats.length > 0 && initialVat && !selectedVatValue) {
      setValue('selectedVat', initialVat, { shouldDirty: false });
    }
  }, [vats, initialVat, selectedVatValue, setValue]);

  useEffect(() => {
    if (shop) {
      reset({
        ...shop,
        selectedVat: initialVat,
      });
    }
  }, [shop, reset, initialVat]);

  useEffect(() => {
    if (shop?.contact?.phone) {
      const formattedPhone = formatPhoneNumber(shop.contact.phone) as string;
      setValue('contact.phone', formattedPhone);
    }
  }, [shop?.contact?.phone, setValue]);

  const openTimeRangeModal = useCallback(() => {
    if (!shop) return;

    // @ts-expect-error modal type error
    modal.openModal(TimeRangeModal, {
      payload: {
        shopId: shop.id,
      },
      fullHeight: true,
    });
  }, [modal, shop]);

  const handleFormSubmit = (data: FormData) => {
    onSave({ ...data, _logoFile: selectedFile });
  };

  const getCountryName = useCallback((countryCode: string): string => {
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
    try {
      return regionNames.of(countryCode.toUpperCase()) || countryCode.toUpperCase();
    } catch {
      return countryCode.toUpperCase();
    }
  }, []);

  const getVatLabel = useCallback(
    (vat: Vat): string => {
      return `${vat.vat}% (${getCountryName(vat.countryCode)})`;
    },
    [getCountryName],
  );

  const hasChanges = formState.isDirty || selectedFile !== null;

  return (
    <FormContainer formContext={formContext} onSuccess={handleFormSubmit}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={3}>
            <TextFieldElement name="name" label={t('Settings.shopName')} fullWidth required />

            <TextFieldElement type="email" name="contact.email" label={t('Settings.shopEmail')} fullWidth />

            <Controller
              name="contact.phone"
              render={({ field }) => (
                <MuiTelInput
                  {...field}
                  label={t('Settings.shopPhone')}
                  fullWidth
                  defaultCountry="US"
                  value={field.value || ''}
                />
              )}
            />

            <Controller
              name="selectedVat"
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  value={field.value || null}
                  options={vats}
                  loading={isLoadingVats}
                  getOptionLabel={(option) => (option ? getVatLabel(option) : '')}
                  isOptionEqualToValue={(option, value) => option?.id === value?.id}
                  onChange={(e, value) => field.onChange(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('page.vat_rate')}
                      fullWidth
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {isLoadingVats ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              )}
            />

            <TextFieldElement name="vatNumber" label={t('page.vat')} fullWidth />

            <Controller
              name="address.country"
              render={({ field, fieldState: { error } }) => (
                <CountryCodeAutocomplete
                  label={t('Settings.country')}
                  value={field.value}
                  onChange={field.onChange}
                  error={error?.message}
                />
              )}
            />

            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '150px',
                border: (theme) => `1px dashed ${theme.palette.grey[300]}`,
                borderRadius: 1,
                overflow: 'hidden',
                backgroundColor: (theme) => theme.palette.grey[50],
              }}
            >
              {logoLoading && (
                <CircularProgress
                  size={40}
                  sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }}
                />
              )}

              {displayUrl ? (
                <Image
                  key={displayUrl}
                  src={displayUrl}
                  alt="Shop Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              ) : logoError ? (
                <Box
                  sx={{
                    textAlign: 'center',
                    color: 'error.main',
                    p: 2,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <Typography variant="body2">Error loading logo</Typography>
                  {logoError instanceof Error && (
                    <Typography variant="caption" sx={{ mt: 1 }}>
                      {logoError.message}
                    </Typography>
                  )}
                </Box>
              ) : (
                <Box
                  sx={{
                    textAlign: 'center',
                    color: 'text.secondary',
                    p: 2,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {t('Settings.noLogo')}
                </Box>
              )}
            </Box>

            <Box>
              <input
                type="file"
                accept="image/*"
                id="logo-upload"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
                disabled={isUploading}
              />
              <label htmlFor="logo-upload">
                <Button component="span" variant="outlined" disabled={isUploading} fullWidth>
                  {getButtonText(t, isUploading)}
                </Button>
              </label>
            </Box>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={3}>
            <TextFieldElement name="address.addressLine1" label={`${t('Settings.address')} 1`} fullWidth />
            <TextFieldElement name="address.addressLine2" label={`${t('Settings.address')} 2`} fullWidth />
            <TextFieldElement name="address.zipcode" label={t('Settings.zipCode')} fullWidth />
            <TextFieldElement name="address.city" label={t('Settings.city')} fullWidth />

            <Controller
              name="language"
              render={({ field }) => (
                <Box>
                  <LanguageSwitcher label={t('LocaleSwitcher.language')} size="medium" />
                </Box>
              )}
            />

            {shop?.id && (
              <Box py={1} width="100%">
                <Button fullWidth variant="outlined" color="primary" onClick={openTimeRangeModal}>
                  {t('shopFormTimeRangeModal.buttonTitle')}
                </Button>
              </Box>
            )}
          </Stack>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isSaving || isUploading || !hasChanges}
        >
          {isSaving || isUploading ? t('common.saving') : t('common.saveChanges')}
        </Button>
      </Box>
    </FormContainer>
  );
};
