import {
  Box,
  Typography,
  TextField,
  MenuItem,
  CircularProgress,
  InputAdornment,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { FC, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';

import { CountryCodeAutocomplete } from 'src/components/fields';
import { useWheelSizeForm } from 'src/hooks/components/useWheelSize';

const vehicleSchema = z.object({
  licenseCountry: z.string().min(1, 'EmployeeCreateForm.validation.required'),
  licensePlateNumber: z.string().min(1, 'EmployeeCreateForm.validation.required'),
  make: z.string().min(1, 'EmployeeCreateForm.validation.required'),
  model: z.string().min(1, 'EmployeeCreateForm.validation.required'),
  generation: z.string().min(1, 'EmployeeCreateForm.validation.required'),
  type: z.string().min(1, 'EmployeeCreateForm.validation.required'),
  wheelOption: z.string().optional(),
  vin: z.string().optional(),
  kba: z.string().optional(),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;

interface AddVehicleFormProps {
  customerId: string;
  onSubmit: (data: VehicleFormData) => Promise<void>;
  onValidationChange?: (isValid: boolean) => void;
  isSubmitting?: boolean;
  error?: string | null; // Add this
  onErrorClear?: () => void; // Add this
}

const defaultValues: VehicleFormData = {
  licenseCountry: '',
  licensePlateNumber: '',
  make: '',
  model: '',
  generation: '',
  type: '',
  wheelOption: '',
  vin: '',
  kba: '',
};

export const AddVehicleForm: FC<AddVehicleFormProps> = ({
  customerId,
  onSubmit,
  onValidationChange,
  isSubmitting = false,
  error, // Add this
  onErrorClear, // Add this
}) => {
  const t = useTranslations();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    trigger,
    watch,
    setValue,
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues,
    mode: 'onTouched',
  });

  const make = watch('make');
  const model = watch('model');
  const generation = watch('generation');

  const {
    makes,
    models,
    generations,
    modifications,
    wheelOptions,
    loading,
    handleMakeChange,
    handleModelChange,
    handleGenerationChange,
    handleModificationChange,
    selectedMake,
    selectedModel,
    selectedGeneration,
  } = useWheelSizeForm();

  // Notify parent about validation state changes
  useEffect(() => {
    onValidationChange?.(isValid);
  }, [isValid, onValidationChange]);

  // Sync form values with wheel size hook
  useEffect(() => {
    if (make !== selectedMake) {
      handleMakeChange(make);
    }
  }, [make, selectedMake, handleMakeChange]);

  useEffect(() => {
    if (model !== selectedModel) {
      handleModelChange(model);
    }
  }, [model, selectedModel, handleModelChange]);

  useEffect(() => {
    if (generation !== selectedGeneration) {
      handleGenerationChange(generation);
    }
  }, [generation, selectedGeneration, handleGenerationChange]);

  // Reset dependent fields when parent selection changes
  useEffect(() => {
    if (make && make !== selectedMake) {
      setValue('model', '', { shouldValidate: false, shouldDirty: false });
      setValue('generation', '', { shouldValidate: false, shouldDirty: false });
      setValue('type', '', { shouldValidate: false, shouldDirty: false });
    }
  }, [make, selectedMake, setValue]);

  useEffect(() => {
    if (model && model !== selectedModel) {
      setValue('generation', '', { shouldValidate: false, shouldDirty: false });
      setValue('type', '', { shouldValidate: false, shouldDirty: false });
    }
  }, [model, selectedModel, setValue]);

  useEffect(() => {
    if (generation && generation !== selectedGeneration) {
      setValue('type', '', { shouldValidate: false, shouldDirty: false });
    }
  }, [generation, selectedGeneration, setValue]);

  const handleFormSubmit = async (data: VehicleFormData) => {
    try {
      await onSubmit(data);
      // Reset form after successful submission
      reset(defaultValues);
    } catch (error) {
      console.error('Failed to add vehicle:', error);
      // Don't reset form on error so user can fix and retry
    }
  };

  // Expose validation trigger to parent
  useEffect(() => {
    const formElement = document.getElementById('vehicle-form');
    if (formElement) {
      (formElement as any).validateForm = trigger;
      (formElement as any).submitForm = handleSubmit(handleFormSubmit);
    }
  }, [trigger, handleSubmit, handleFormSubmit]);

  const makeOptions = useMemo(() => makes.map((make) => ({ id: make.slug, label: make.name })), [makes]);
  const modelOptions = useMemo(() => models.map((model) => ({ id: model.slug, label: model.name })), [models]);
  const generationOptions = useMemo(() => generations.map((gen) => ({ id: gen.slug, label: gen.name })), [generations]);
  const modificationOptions = useMemo(
    () => modifications.map((mod) => ({ id: mod.slug, label: mod.name })),
    [modifications],
  );

  const wheelOptionsList = useMemo(
    () =>
      wheelOptions.flatMap(
        (option) =>
          option.wheels?.map((wheel, index) => ({
            value: `${option.slug}-${index}`,
            label: `${wheel.front?.rim || 'N/A'}" - ${wheel.front?.tire_full || 'N/A'}`,
          })) || [],
      ),
    [wheelOptions],
  );

  // Clear error when user starts typing
  useEffect(() => {
    if (error && onErrorClear) {
      const formElement = document.getElementById('vehicle-form');
      const handleInput = () => onErrorClear();

      if (formElement) {
        formElement.addEventListener('input', handleInput);
        return () => formElement.removeEventListener('input', handleInput);
      }
    }
  }, [error, onErrorClear]);

  return (
    <Box id="vehicle-form" sx={{ p: 2 }}>
      {/* Display error message if present */}
      {error && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="error" sx={{ p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
            {error}
          </Typography>
        </Box>
      )}

      {/* License Information Section */}
      <Typography variant="h6" gutterBottom>
        {t('CreateCustomer.licenseInfo')}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Controller
              name="licenseCountry"
              control={control}
              render={({ field, fieldState }) => (
                <CountryCodeAutocomplete
                  label={t('CreateCustomer.licenseCountry')}
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  fullWidth
                />
              )}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Controller
              name="licensePlateNumber"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label={t('CreateCustomer.licensePlate')}
                  fullWidth
                  required
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  placeholder={t('CreateCustomer.licensePlatePlaceholder') || 'Enter license plate'}
                  disabled={isSubmitting}
                />
              )}
            />
          </Box>
        </Box>
      </Box>

      {/* Vehicle Specifications Section */}
      <Typography variant="h6" gutterBottom>
        {t('CreateCustomer.vehicleSpecs')}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Controller
              name="make"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label={t('CreateCustomer.make')}
                  select
                  fullWidth
                  required
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  disabled={loading.makes || isSubmitting}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    handleMakeChange(e.target.value);
                  }}
                  InputProps={{
                    endAdornment: loading.makes ? (
                      <InputAdornment position="end">
                        <CircularProgress size={20} />
                      </InputAdornment>
                    ) : null,
                  }}
                >
                  <MenuItem value="">
                    <em>{t('CreateCustomer.selectMake')}</em>
                  </MenuItem>
                  {makeOptions.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Controller
              name="model"
              control={control}
              render={({ field, fieldState }) => {
                const isDisabled = !make || loading.models || isSubmitting;
                return (
                  <TextField
                    {...field}
                    label={t('CreateCustomer.model')}
                    select
                    fullWidth
                    required
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    disabled={isDisabled}
                    sx={{
                      '& .MuiInputBase-root': {
                        cursor: isDisabled ? 'not-allowed' : 'default',
                      },
                      '& .MuiInputBase-input': {
                        cursor: isDisabled ? 'not-allowed' : 'default',
                      },
                    }}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      handleModelChange(e.target.value);
                    }}
                    InputProps={{
                      endAdornment: loading.models ? (
                        <InputAdornment position="end">
                          <CircularProgress size={20} />
                        </InputAdornment>
                      ) : null,
                    }}
                  >
                    <MenuItem value="">
                      <em>{t('CreateCustomer.selectModel')}</em>
                    </MenuItem>
                    {modelOptions.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                );
              }}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Controller
              name="generation"
              control={control}
              render={({ field, fieldState }) => {
                const isDisabled = !model || loading.generations || isSubmitting;
                return (
                  <TextField
                    {...field}
                    label={t('CreateCustomer.generation')}
                    select
                    fullWidth
                    required
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    disabled={isDisabled}
                    sx={{
                      '& .MuiInputBase-root': {
                        cursor: isDisabled ? 'not-allowed' : 'default',
                      },
                      '& .MuiInputBase-input': {
                        cursor: isDisabled ? 'not-allowed' : 'default',
                      },
                    }}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      handleGenerationChange(e.target.value);
                    }}
                    InputProps={{
                      endAdornment: loading.generations ? (
                        <InputAdornment position="end">
                          <CircularProgress size={20} />
                        </InputAdornment>
                      ) : null,
                    }}
                  >
                    <MenuItem value="">
                      <em>{t('CreateCustomer.selectGeneration')}</em>
                    </MenuItem>
                    {generationOptions.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                );
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Controller
              name="type"
              control={control}
              render={({ field, fieldState }) => {
                const isDisabled = !generation || loading.modifications || isSubmitting;
                return (
                  <TextField
                    {...field}
                    label={t('CreateCustomer.type')}
                    select
                    fullWidth
                    required
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    disabled={isDisabled}
                    sx={{
                      '& .MuiInputBase-root': {
                        cursor: isDisabled ? 'not-allowed' : 'default',
                      },
                      '& .MuiInputBase-input': {
                        cursor: isDisabled ? 'not-allowed' : 'default',
                      },
                    }}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      handleModificationChange(e.target.value);
                    }}
                    InputProps={{
                      endAdornment: loading.modifications ? (
                        <InputAdornment position="end">
                          <CircularProgress size={20} />
                        </InputAdornment>
                      ) : null,
                    }}
                  >
                    <MenuItem value="">
                      <em>{t('CreateCustomer.selectType')}</em>
                    </MenuItem>
                    {modificationOptions.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                );
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Additional Vehicle Information Section */}
      <Typography variant="h6" gutterBottom>
        {t('CreateCustomer.additionalVehicleInfo')}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Controller
              name="vin"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label={t('CreateCustomer.vin')}
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  placeholder="Enter VIN (optional)"
                  disabled={isSubmitting}
                />
              )}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Controller
              name="kba"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label={t('CreateCustomer.kba')}
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  placeholder="Enter KBA (optional)"
                  disabled={isSubmitting}
                />
              )}
            />
          </Box>
        </Box>
      </Box>

      {/* Wheel Options Section */}
      {wheelOptionsList.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            {t('CreateCustomer.wheelOptions')}
          </Typography>
          <Box sx={{ pl: 1 }}>
            <Controller
              name="wheelOption"
              control={control}
              render={({ field }) => (
                <RadioGroup value={field.value} onChange={field.onChange}>
                  {wheelOptionsList.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio />}
                      label={<Typography variant="body2">{option.label}</Typography>}
                      disabled={isSubmitting}
                    />
                  ))}
                </RadioGroup>
              )}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};
