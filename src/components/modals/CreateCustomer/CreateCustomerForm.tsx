import { Box, Typography, TextField } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { MuiTelInput } from 'mui-tel-input';
import { useTranslations } from 'next-intl';
import { FC, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { CountryCodeAutocomplete } from 'src/components/fields';
import { CreateCustomerRequest } from 'src/models';

const customerSchema = z.object({
  firstName: z.string().min(1, 'EmployeeCreateForm.validation.required'),
  lastName: z.string().min(1, 'EmployeeCreateForm.validation.required'),
  contact: z.object({
    email: z
      .string()
      .min(1, 'EmployeeCreateForm.validation.required')
      .email('EmployeeCreateForm.validation.emailInvalid'),
    phone: z
      .string()
      .min(1, 'EmployeeCreateForm.validation.required')
      .min(10, 'EmployeeCreateForm.validation.phoneInvalid'),
  }),
  address: z.object({
    addressLine1: z.string().min(1, 'EmployeeCreateForm.validation.required'),
    addressLine2: z.string().optional(),
    zipcode: z.string().min(1, 'EmployeeCreateForm.validation.required'),
    city: z.string().min(1, 'EmployeeCreateForm.validation.required'),
    country: z.string().min(1, 'EmployeeCreateForm.validation.required'),
  }),
  role: z.object({
    name: z.string().default('Customer'),
  }),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

interface CreateCustomerFormProps {
  onSubmit: (data: CreateCustomerRequest) => Promise<void>;
  onValidationChange?: (isValid: boolean) => void;
  isSubmitting?: boolean;
  error?: string | null;
  onErrorClear?: () => void; // Add this prop
}

const defaultValues: CustomerFormData = {
  firstName: '',
  lastName: '',
  contact: {
    email: '',
    phone: '',
  },
  address: {
    addressLine1: '',
    addressLine2: '',
    zipcode: '',
    city: '',
    country: '',
  },
  role: {
    name: 'Customer',
  },
};

export const CreateCustomerForm: FC<CreateCustomerFormProps> = ({
  onSubmit,
  onValidationChange,
  isSubmitting = false,
  error,
  onErrorClear, // Add this prop
}) => {
  const t = useTranslations();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    trigger,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues,
    mode: 'onTouched',
  });

  // Notify parent about validation state changes
  useEffect(() => {
    onValidationChange?.(isValid);
  }, [isValid, onValidationChange]);

  const handleFormSubmit = async (data: CustomerFormData) => {
    try {
      const submitData: CreateCustomerRequest = {
        ...data,
        address: {
          ...data.address,
          addressLine2: data.address.addressLine2 || undefined,
        },
      };
      await onSubmit(submitData);
      // Only reset form after successful submission
      reset(defaultValues);
    } catch (error) {
      console.error('Failed to create customer:', error);
      // Don't reset form on error - keep user input intact
      // Error will be displayed via the error prop from Redux state
    }
  };

  // Expose validation trigger to parent
  useEffect(() => {
    // Store trigger function on the form element for parent access
    const formElement = document.getElementById('customer-form');
    if (formElement) {
      (formElement as any).validateForm = trigger;
      (formElement as any).submitForm = handleSubmit(handleFormSubmit);
    }
  }, [trigger, handleSubmit, handleFormSubmit]);

  // Clear error when user starts typing
  useEffect(() => {
    if (error && onErrorClear) {
      const formElement = document.getElementById('customer-form');
      const handleInput = () => onErrorClear();

      if (formElement) {
        formElement.addEventListener('input', handleInput);
        return () => formElement.removeEventListener('input', handleInput);
      }
    }
  }, [error, onErrorClear]);

  return (
    <Box id="customer-form" sx={{ p: 2 }}>
      {/* Display error message if present */}
      {error && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="error" sx={{ p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
            {error}
          </Typography>
        </Box>
      )}

      {/* Personal Information Section */}
      <Typography variant="h6" gutterBottom>
        {t('CreateCustomer.personalInfo')}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Controller
              name="firstName"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label={t('CreateCustomer.firstName')}
                  fullWidth
                  required
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  disabled={isSubmitting}
                />
              )}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Controller
              name="lastName"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label={t('CreateCustomer.lastName')}
                  fullWidth
                  required
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  disabled={isSubmitting}
                />
              )}
            />
          </Box>
        </Box>
      </Box>

      {/* Contact Information Section */}
      <Typography variant="h6" gutterBottom>
        {t('CreateCustomer.contactInfo')}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Controller
              name="contact.email"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label={t('CreateCustomer.email')}
                  type="email"
                  fullWidth
                  required
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  disabled={isSubmitting}
                />
              )}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Controller
              name="contact.phone"
              control={control}
              render={({ field, fieldState }) => (
                <MuiTelInput
                  {...field}
                  label={t('CreateCustomer.phone')}
                  fullWidth
                  required
                  defaultCountry="US"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  disabled={isSubmitting}
                />
              )}
            />
          </Box>
        </Box>
      </Box>

      {/* Address Information Section */}
      <Typography variant="h6" gutterBottom>
        {t('CreateCustomer.addressInfo')}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Street Address - Full width for better usability */}
        <Box>
          <Controller
            name="address.addressLine1"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label={t('CreateCustomer.addressLine1')}
                fullWidth
                required
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                placeholder={t('CreateCustomer.addressLine1Placeholder') || 'Street address'}
                disabled={isSubmitting}
              />
            )}
          />
        </Box>

        {/* Optional Address Line 2 - Full width */}
        <Box>
          <Controller
            name="address.addressLine2"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                value={field.value || ''}
                label={t('CreateCustomer.addressLine2')}
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                placeholder={t('CreateCustomer.addressLine2Placeholder') || 'Apartment, suite, etc. (optional)'}
                disabled={isSubmitting}
              />
            )}
          />
        </Box>

        {/* City, Zipcode, Country - Responsive layout */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <Box sx={{ flex: 2 }}>
            <Controller
              name="address.city"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label={t('CreateCustomer.city')}
                  fullWidth
                  required
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  disabled={isSubmitting}
                />
              )}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Controller
              name="address.zipcode"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label={t('CreateCustomer.zipcode')}
                  fullWidth
                  required
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  disabled={isSubmitting}
                />
              )}
            />
          </Box>
          <Box sx={{ flex: 1.5 }}>
            <Controller
              name="address.country"
              control={control}
              render={({ field, fieldState }) => (
                <CountryCodeAutocomplete
                  label={t('CreateCustomer.country')}
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  fullWidth
                />
              )}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
