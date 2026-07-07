'use client';

import { Paper, Grid } from '@mui/material';
import React, { useCallback } from 'react';

import { Loader } from 'src/components/Loader';
import { SettingsForm } from 'src/components/pages/Settings/SettingsForm';
import { WhatsAppFacebookConnect } from 'src/components/WhatsAppFacebookConnect';
import { useSettings } from 'src/hooks/pages/useSettings';
import { Shop } from 'src/models';

export const Settings: React.FC = () => {
  const { shop, loading, error, isSaving, handleSave } = useSettings();

  const handleUploadClick = useCallback(() => {
    console.log('Upload customers clicked');
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6, lg: 7 }}>
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 3, position: 'relative' }}>
          <Loader
            sx={{ mb: 3, minHeight: 150, position: 'absolute' }}
            loading={loading}
            render={() => <SettingsForm shop={shop as Shop} isSaving={isSaving} onSave={handleSave} />}
          />
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 5 }}>
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 3, position: 'relative' }}>
          <WhatsAppFacebookConnect
            onUploadClick={handleUploadClick}
            phoneNumberDetails={
              shop?.name
                ? {
                    verified_name: shop.name,
                    display_phone_number: undefined, // Will be populated from WhatsApp credentials in the component
                  }
                : undefined
            }
          />
        </Paper>
      </Grid>
    </Grid>
  );
};
