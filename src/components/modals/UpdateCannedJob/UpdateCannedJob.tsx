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
import React, { useCallback, useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Category, CannedJob, UpdateCannedJobRequest } from 'src/store/slices/cannedJobsSlice';
import { UpdateCannedJobFormData, updateCannedJobSchema } from 'src/schemas/cannedjobSchema';
import { useCannedJobs } from 'src/hooks/pages/useCannedJobs';

interface UpdateCannedJobModalProps {
  open: boolean;
  onClose: () => void;
  cannedJob: CannedJob | null;
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

export const UpdateCannedJobModal: React.FC<UpdateCannedJobModalProps> = ({ open, onClose, cannedJob }) => {
  const { updateCannedJob, loading } = useCannedJobs();
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateCannedJobFormData>({
    resolver: zodResolver(updateCannedJobSchema),
    defaultValues: {
      shopId: '',
      serviceGroupId: '',
      description: '',
      category: '',
      macroCategory: null,
      position: 1,
      services: [defaultService],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'services',
  });

  const watchedServices = watch('services');
  const [totalEditedStates, setTotalEditedStates] = useState<boolean[]>([]);
  const [displayValues, setDisplayValues] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (cannedJob && open) {
      let serviceGroup: any = null;
      let services: any[] = [];
      let description = '';

      // Priority: estimateServiceGroups > serviceGroups > services
      if (cannedJob.estimateServiceGroups && cannedJob.estimateServiceGroups.length > 0) {
        serviceGroup = cannedJob.estimateServiceGroups[0];
        services = serviceGroup.estimateServices || [];
        description = serviceGroup.description || cannedJob.description || cannedJob.title || '';
      } else if (cannedJob.serviceGroups && cannedJob.serviceGroups.length > 0) {
        serviceGroup = cannedJob.serviceGroups[0];
        services = serviceGroup.estimateServices || [];
        // ServiceGroup doesn't have description, so use job-level description
        description = cannedJob.description || cannedJob.title || '';
      } else if (cannedJob.services && cannedJob.services.length > 0) {
        serviceGroup = cannedJob.services[0];
        services = serviceGroup.estimateServices || [];
        description = cannedJob.description || cannedJob.title || '';
      } else {
        // Fallback to job-level description
        description = cannedJob.description || cannedJob.title || '';
      }

      const formData: UpdateCannedJobFormData = {
        shopId: cannedJob.shopId,
        serviceGroupId: serviceGroup?.id || '',
        description: description,
        category: (serviceGroup && 'category' in serviceGroup ? serviceGroup.category : '') || '',
        macroCategory:
          (serviceGroup && 'macroCategory' in serviceGroup ? serviceGroup.macroCategory : null) ||
          cannedJob.macroCategory ||
          null,
        position: (serviceGroup && 'position' in serviceGroup ? serviceGroup.position : 1) || 1,
        services:
          services.length > 0
            ? services.map((service) => ({
                id: service.id,
                category: service.category as Category,
                description: service.description,
                internalId: service.internalId,
                manHours: parseFloat(service.manHours) || 0,
                price: parseFloat(service.price) || 0,
                total: parseFloat(service.total) || 0,
                position: service.position,
              }))
            : [defaultService],
      };

      reset(formData);
      replace(formData.services);
      setTotalEditedStates(new Array(formData.services.length).fill(false));

      const initialDisplayValues: { [key: string]: string } = {};
      formData.services.forEach((service, index) => {
        if (service.manHours > 0) initialDisplayValues[`manHours-${index}`] = service.manHours.toString();
        if (service.price > 0) initialDisplayValues[`price-${index}`] = service.price.toString();
        if (service.total > 0) initialDisplayValues[`total-${index}`] = service.total.toString();
      });
      setDisplayValues(initialDisplayValues);
    }
  }, [cannedJob, open, reset, replace]);

  // Auto-calculate totals for all services - moved outside of map
  useEffect(() => {
    if (watchedServices) {
      watchedServices.forEach((service, index) => {
        const manHours = service?.manHours ?? 0;
        const price = service?.price ?? 0;
        const isManuallyEdited = totalEditedStates[index] || false;

        if (!isManuallyEdited && manHours !== undefined && price !== undefined) {
          const computed = Number(manHours) * Number(price);
          setValue(`services.${index}.total`, computed);
          setDisplayValues((prev) => ({
            ...prev,
            [`total-${index}`]: computed === 0 ? '' : computed.toString(),
          }));
        }
      });
    }
  }, [watchedServices, totalEditedStates, setValue]);

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
        setDisplayValues((prev) => {
          const newValues = { ...prev };
          delete newValues[`manHours-${index}`];
          delete newValues[`price-${index}`];
          delete newValues[`total-${index}`];
          return newValues;
        });
      }
    },
    [remove, fields.length],
  );

  const handleFormSubmit = useCallback(
    async (data: UpdateCannedJobFormData) => {
      if (!cannedJob) return;

      setIsUpdating(true);
      try {
        const formattedData = {
          serviceGroupId: data.serviceGroupId,
          description: data.description,
          services: data.services.map((service, index) => ({
            ...service,
            position: index + 1,
          })),
        };

        await updateCannedJob(cannedJob.id, formattedData);
        onClose();
      } catch (error) {
        throw error;
      } finally {
        setIsUpdating(false);
      }
    },
    [updateCannedJob, cannedJob, onClose],
  );

  const handleClose = useCallback(() => {
    reset();
    setTotalEditedStates([]);
    setDisplayValues({});
    onClose();
  }, [reset, onClose]);

  const categoryOptions = Object.values(Category).filter((cat) => cat !== Category.All);

  if (!cannedJob) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Update Canned Job</Typography>
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

              {fields.map((field, index) => (
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
                            value={displayValues[`price-${index}`] ?? (field.value === 0 ? '' : field.value.toString())}
                            onChange={(e) => {
                              const value = e.target.value;
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
                            value={displayValues[`total-${index}`] ?? (field.value === 0 ? '' : field.value.toString())}
                            onChange={(e) => {
                              const value = e.target.value;
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
              ))}

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
          <Button type="submit" variant="contained" disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Update Canned Job'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
