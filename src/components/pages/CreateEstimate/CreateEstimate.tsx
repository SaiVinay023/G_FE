'use client';

import { Box } from '@mui/material';
import { FC } from 'react';

import { CreateEstimateForm } from 'src/components/Estimates';

import { useCreateEstimate } from '../../../hooks/pages/index';
import { Shop } from '../../../models/index';
import { Loader } from '../../Loader';

type CreateEstimateProps = {
  contactId: string;
  vehicleId: string;
};
export const CreateEstimate: FC<CreateEstimateProps> = ({ contactId, vehicleId }) => {
  const { shop, customer, vehicle, initialValues, defaultValues, loading, isSaving, handleSave, handleCancel } =
    useCreateEstimate(contactId, vehicleId);

  return (
    <Loader
      sx={{ mb: 3, minHeight: 150, position: 'absolute' }}
      loading={loading}
      render={() =>
        !customer || !vehicle ? (
          <Box sx={{ p: 3 }}>Customer or vehicle not found</Box>
        ) : (
          <CreateEstimateForm
            shop={shop as Shop}
            customer={customer}
            vehicle={vehicle}
            initialValues={initialValues}
            defaultValues={defaultValues}
            isSaving={isSaving}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )
      }
    />
  );
};
