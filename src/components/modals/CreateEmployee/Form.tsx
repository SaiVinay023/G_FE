import { Stack, Grid, TextField } from '@mui/material';
import { MuiTelInput } from 'mui-tel-input';
import { useTranslations } from 'next-intl';
import { FC } from 'react';
import { Controller, Control, FieldErrors } from 'react-hook-form';

import { CountryCodeAutocomplete } from 'src/components/fields';
import { EmployeeCreateFormData } from 'src/schemas/employeeSchema';

type FormProps = {
  control: Control<EmployeeCreateFormData>;
  errors: FieldErrors<EmployeeCreateFormData>;
  watch: (name: keyof EmployeeCreateFormData) => any;
};

export const Form: FC<FormProps> = ({ control, errors, watch }) => {
  const t = useTranslations();
  const password = watch('password');

  return (
    <Stack gap={3} height="100%" py={4}>
      {/* Personal Information */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('EmployeeCreateForm.firstNameLabel')}
                fullWidth
                required
                error={!!errors.firstName}
                helperText={errors.firstName?.message && t(errors.firstName.message)}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('EmployeeCreateForm.lastNameLabel')}
                fullWidth
                required
                error={!!errors.lastName}
                helperText={errors.lastName?.message && t(errors.lastName.message)}
              />
            )}
          />
        </Grid>
      </Grid>

      {/* Contact Information */}
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            type="email"
            label={t('EmployeeCreateForm.emailLabel')}
            fullWidth
            required
            autoComplete="off"
            error={!!errors.email}
            helperText={errors.email?.message && t(errors.email.message)}
          />
        )}
      />

      <Controller
        name="phoneNumber"
        control={control}
        render={({ field, fieldState }) => (
          <MuiTelInput
            {...field}
            required
            label={t('EmployeeCreateForm.phoneLabel')}
            fullWidth
            defaultCountry="US"
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber?.message && t(errors.phoneNumber.message)}
          />
        )}
      />

      {/* Address Information */}
      <Controller
        name="addressLine1"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={t('EmployeeCreateForm.addressLine1Label')}
            fullWidth
            required
            error={!!errors.addressLine1}
            helperText={errors.addressLine1?.message && t(errors.addressLine1.message)}
          />
        )}
      />

      <Controller
        name="addressLine2"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={t('EmployeeCreateForm.addressLine2Label')}
            fullWidth
            error={!!errors.addressLine2}
            helperText={errors.addressLine2?.message && t(errors.addressLine2.message)}
          />
        )}
      />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            name="zipcode"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('EmployeeCreateForm.zipcodeLabel')}
                fullWidth
                required
                error={!!errors.zipcode}
                helperText={errors.zipcode?.message && t(errors.zipcode.message)}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('EmployeeCreateForm.cityLabel')}
                fullWidth
                required
                error={!!errors.city}
                helperText={errors.city?.message && t(errors.city.message)}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            name="country"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <CountryCodeAutocomplete
                label={t('EmployeeCreateForm.countryLabel')}
                value={field.value}
                onChange={field.onChange}
                error={error?.message && t(error.message)}
              />
            )}
          />
        </Grid>
      </Grid>

      {/* Password Fields */}
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            type="password"
            label={t('EmployeeCreateForm.passwordLabel')}
            fullWidth
            required
            autoComplete="new-password"
            error={!!errors.password}
            helperText={errors.password?.message && t(errors.password.message)}
          />
        )}
      />

      <Controller
        name="repeatPassword"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            type="password"
            label={t('EmployeeCreateForm.passwordRepeatLabel')}
            fullWidth
            required
            autoComplete="new-password"
            error={!!errors.repeatPassword}
            helperText={errors.repeatPassword?.message && t(errors.repeatPassword.message)}
          />
        )}
      />
    </Stack>
  );
};
