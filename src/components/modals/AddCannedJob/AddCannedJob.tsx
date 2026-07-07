'use client';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  IconButton,
  Typography,
  Box,
  MenuItem,
  Divider,
} from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Category } from 'src/store/slices/cannedJobsSlice';
import { CannedJobFormData, cannedJobSchema } from 'src/schemas/cannedjobSchema';

interface AddCannedJobModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CannedJobFormData) => Promise<void>;
  loading?: boolean;
}

const defaultService = {
  category: Category.Services,
  description: '',
  internalId: '',
  manHours: 0,
  price: 0,
  total: 0,
  position: 1,
};

export const AddCannedJobModal: React.FC<AddCannedJobModalProps> = ({ open, onClose, onSubmit, loading = false }) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CannedJobFormData>({
    resolver: zodResolver(cannedJobSchema),
    defaultValues: {
      description: '',
      services: [defaultService],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'services',
  });

  const watchedServices = watch('services');
  const [totalEditedStates, setTotalEditedStates] = useState<boolean[]>([]);
  const [displayValues, setDisplayValues] = useState<{ [key: string]: string }>({});

  const addService = useCallback(() => {
    const newService = {
      ...defaultService,
      position: fields.length + 1,
    };
    append(newService);
    setTotalEditedStates((prev) => [...prev, false]);
  }, [append, fields.length]);

  const removeService = useCallback(
    (index: number) => {
      if (fields.length > 1) {
        remove(index);
        setTotalEditedStates((prev) => prev.filter((_, i) => i !== index));
      }
    },
    [remove, fields.length],
  );

  const handleFormSubmit = useCallback(
    async (data: CannedJobFormData) => {
      try {
        const formattedData = {
          ...data,
          macroCategory: null,
          position: 1,
          services: data.services.map((service, index) => ({
            ...service,
            position: index + 1,
          })),
        };

        await onSubmit(formattedData);
        reset();
        setTotalEditedStates([]);
        setDisplayValues({});
      } catch (error) {
        throw error;
      }
    },
    [onSubmit, reset],
  );

  const handleManualSubmit = useCallback(async () => {
    const isFormValid = await handleSubmit(handleFormSubmit)();
    return isFormValid;
  }, [handleSubmit, handleFormSubmit]);

  const handleClose = useCallback(() => {
    reset();
    setTotalEditedStates([]);
    setDisplayValues({});
    onClose();
  }, [reset, onClose]);

  const categoryOptions = Object.values(Category).filter((cat) => cat !== Category.All);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Add Canned Job</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid size={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    fullWidth
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={12}>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Services</Typography>
                <Button startIcon={<AddIcon />} onClick={addService} variant="outlined" size="small">
                  Add Service
                </Button>
              </Box>

              {fields.map((field, index) => {
                const manHours = watchedServices?.[index]?.manHours ?? 0;
                const price = watchedServices?.[index]?.price ?? 0;
                const isManuallyEdited = totalEditedStates[index] || false;

                // Auto-calculate total if not manually edited
                React.useEffect(() => {
                  if (!isManuallyEdited && manHours !== undefined && price !== undefined) {
                    const computed = Number(manHours) * Number(price);
                    setValue(`services.${index}.total`, computed);
                    // Update display value for total
                    setDisplayValues((prev) => ({
                      ...prev,
                      [`total-${index}`]: computed === 0 ? '' : computed.toString(),
                    }));
                  }
                }, [manHours, price, index, isManuallyEdited, setValue]);

                return (
                  <Box key={field.id} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="subtitle2">Service {index + 1}</Typography>
                      {fields.length > 1 && (
                        <IconButton onClick={() => removeService(index)} size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>

                    <Grid container spacing={2}>
                      <Grid size={6}>
                        <Controller
                          name={`services.${index}.category`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              select
                              label="Category"
                              fullWidth
                              error={!!errors.services?.[index]?.category}
                              helperText={errors.services?.[index]?.category?.message}
                            >
                              {categoryOptions.map((category) => (
                                <MenuItem key={category} value={category}>
                                  {category}
                                </MenuItem>
                              ))}
                            </TextField>
                          )}
                        />
                      </Grid>

                      <Grid size={6}>
                        <Controller
                          name={`services.${index}.internalId`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Internal ID"
                              fullWidth
                              error={!!errors.services?.[index]?.internalId}
                              helperText={errors.services?.[index]?.internalId?.message}
                            />
                          )}
                        />
                      </Grid>

                      <Grid size={12}>
                        <Controller
                          name={`services.${index}.description`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Description"
                              fullWidth
                              error={!!errors.services?.[index]?.description}
                              helperText={errors.services?.[index]?.description?.message}
                            />
                          )}
                        />
                      </Grid>

                      <Grid size={4}>
                        <Controller
                          name={`services.${index}.manHours`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              type="text"
                              label="Man Hours"
                              fullWidth
                              value={
                                displayValues[`manHours-${index}`] ?? (field.value === 0 ? '' : field.value.toString())
                              }
                              onChange={(e) => {
                                const value = e.target.value;
                                // Allow empty string, numbers, and decimal points
                                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                  setDisplayValues((prev) => ({
                                    ...prev,
                                    [`manHours-${index}`]: value,
                                  }));
                                  setTotalEditedStates((prev) => {
                                    const newStates = [...prev];
                                    newStates[index] = false;
                                    return newStates;
                                  });
                                  field.onChange(value === '' ? 0 : Number(value));
                                }
                              }}
                              error={!!errors.services?.[index]?.manHours}
                              helperText={errors.services?.[index]?.manHours?.message}
                            />
                          )}
                        />
                      </Grid>

                      <Grid size={4}>
                        <Controller
                          name={`services.${index}.price`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              type="text"
                              label="Price"
                              fullWidth
                              value={
                                displayValues[`price-${index}`] ?? (field.value === 0 ? '' : field.value.toString())
                              }
                              onChange={(e) => {
                                const value = e.target.value;
                                // Allow empty string, numbers, and decimal points
                                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                  setDisplayValues((prev) => ({
                                    ...prev,
                                    [`price-${index}`]: value,
                                  }));
                                  setTotalEditedStates((prev) => {
                                    const newStates = [...prev];
                                    newStates[index] = false;
                                    return newStates;
                                  });
                                  field.onChange(value === '' ? 0 : Number(value));
                                }
                              }}
                              error={!!errors.services?.[index]?.price}
                              helperText={errors.services?.[index]?.price?.message}
                            />
                          )}
                        />
                      </Grid>

                      <Grid size={4}>
                        <Controller
                          name={`services.${index}.total`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              type="text"
                              label="Total"
                              fullWidth
                              value={
                                displayValues[`total-${index}`] ?? (field.value === 0 ? '' : field.value.toString())
                              }
                              onChange={(e) => {
                                const value = e.target.value;
                                // Allow empty string, numbers, and decimal points
                                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                  setDisplayValues((prev) => ({
                                    ...prev,
                                    [`total-${index}`]: value,
                                  }));
                                  setTotalEditedStates((prev) => {
                                    const newStates = [...prev];
                                    newStates[index] = true;
                                    return newStates;
                                  });
                                  field.onChange(value === '' ? 0 : Number(value));
                                }
                              }}
                              error={!!errors.services?.[index]?.total}
                              helperText={errors.services?.[index]?.total?.message}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                );
              })}

              {errors.services && (
                <Typography color="error" variant="body2">
                  {errors.services.message}
                </Typography>
              )}
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading || isSubmitting || !isValid}>
            {loading || isSubmitting ? 'Creating...' : 'Create Canned Job'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
