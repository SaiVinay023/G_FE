'use client';

import { Box, Button, Divider, Paper, Grid, CircularProgress } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form-mui';

import { CarWidget } from 'src/components/CarWidget';
import { CustomerSnippet } from 'src/components/CustomerSnippet';

import { Customer, Shop, Vehicle } from '../../../models/index';
import { EstimateHeader } from '../EstimateHeader';
import { EstimateTotals } from '../EstimateTotals';
import { ServiceGroupsSection } from '../ServiceGroupsSection';

export interface Service {
  description: string;
  internalId: string;
  manHours: string;
  price: string;
  total?: string;
}

export interface FormValues {
  serviceTitle: string;
  kms: string;
  customerComments: string;
  serviceGroups: {
    description: string;
    category: string;
    services: Service[];
  }[];
  subTotal: string;
  vat: string;
  total: string;
  discount: string;
}

interface CreateEstimateFormProps {
  customer: Customer;
  shop: Shop;
  vehicle: Vehicle;
  initialValues?: FormValues;
  defaultValues?: FormValues;
  isSaving?: boolean;
  onSave: (data: FormValues) => Promise<void>;
  onCancel: () => void;
}

export const CreateEstimateForm = ({
  shop,
  customer,
  vehicle,
  initialValues,
  defaultValues,
  isSaving = false,
  onSave,
  onCancel,
}: CreateEstimateFormProps) => {
  const t = useTranslations();
  const formMethods = useForm<FormValues>({
    defaultValues: initialValues || defaultValues,
    mode: 'onTouched',
  });

  const { handleSubmit, reset } = formMethods;

  const onSubmit = async (data: FormValues) => {
    try {
      await onSave(data);
      // Reset form to default values after successful submission
      if (defaultValues) {
        reset(defaultValues);
      }
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  // Reset form when initialValues change
  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  return (
    <FormProvider {...formMethods}>
      <Box component="form" sx={{ width: '100%' }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomerSnippet customer={customer} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <CarWidget vehicle={vehicle} />
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <EstimateHeader />
          <ServiceGroupsSection shop={shop} />
          <EstimateTotals shop={shop} />

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" color="error" onClick={onCancel}>
              {t('Single.discard')}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit(onSubmit)}
              disabled={isSaving}
              startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : undefined}
            >
              {isSaving ? t('common.saving') : t('Single.save')}
            </Button>
          </Box>
        </Paper>
      </Box>
    </FormProvider>
  );
};
