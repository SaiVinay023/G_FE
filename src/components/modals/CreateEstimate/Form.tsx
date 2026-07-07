import { Stack } from '@mui/material';
import { MuiTelInput } from 'mui-tel-input';
import { useTranslations } from 'next-intl';
import { FC } from 'react';
import { Controller, TextFieldElement, UseFormReturn } from 'react-hook-form-mui';

import { EmployeeCreateFormData } from 'src/models';

type FormProps = {
  formContext: UseFormReturn<EmployeeCreateFormData>;
};

export const Form: FC<FormProps> = ({ formContext }) => {
  const t = useTranslations();
  const { control, watch } = formContext;
  const password = watch('password');

  return (
    <Stack gap={3} height="100%" py={4}>
      <TextFieldElement name="name" control={control} label={t('EmployeeCreateForm.nameLabel')} fullWidth required />

      <TextFieldElement
        name="email"
        type="email"
        required
        autoComplete="off"
        label={t('EmployeeCreateForm.emailLabel')}
        fullWidth
        control={control}
        rules={{
          required: t('EmployeeCreateForm.validation.required'),
          pattern: {
            value: /^[a-z\d+_.-]+@[a-z\d.-]+\.[a-z]+$/,
            message: t('EmployeeCreateForm.validation.emailInvalid'),
          },
        }}
      />

      <Controller
        name="phoneNumber"
        control={control}
        rules={{
          required: t('EmployeeCreateForm.validation.required'),
          minLength: {
            value: 10,
            message: t('EmployeeCreateForm.validation.phoneInvalid'),
          },
        }}
        render={({ field, fieldState }) => (
          <MuiTelInput
            {...field}
            required
            label={t('EmployeeCreateForm.phoneLabel')}
            fullWidth
            defaultCountry="US"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />

      <TextFieldElement
        id="password"
        type="password"
        label={t('EmployeeCreateForm.passwordLabel')}
        fullWidth
        required
        control={control}
        autoComplete="new-password"
        name="password"
        rules={{
          required: t('EmployeeCreateForm.validation.required'),
          minLength: {
            value: 6,
            message: t('EmployeeCreateForm.validation.passwordTooShort'),
          },
        }}
      />

      <TextFieldElement
        type="password"
        label={t('EmployeeCreateForm.passwordRepeatLabel')}
        fullWidth
        required
        control={control}
        name="repeatPassword"
        autoComplete="new-password"
        rules={{
          required: t('EmployeeCreateForm.validation.required'),
          validate: (value) => value === password || t('EmployeeCreateForm.validation.passwordsDontMatch'),
        }}
      />
    </Stack>
  );
};
