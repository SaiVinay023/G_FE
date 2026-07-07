'use client';

import { useUser } from '@clerk/nextjs';
import { Container, Paper, Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import React, { useEffect } from 'react';

import { SettingsForm } from '../Settings/SettingsForm';
import { useSettings } from 'src/hooks/pages/useSettings';
import { Shop } from 'src/models';

export const RegistrationConfirm = () => {
  const t = useTranslations();
  const router = useRouter();
  const currentLocale = useLocale();
  const { user } = useUser();
  const { shop, isSaving, handleSave } = useSettings();

  useEffect(() => {
    router.prefetch(`/${currentLocale}/today?newUser=true`);
  }, [router, currentLocale]);

  return (
    <Container maxWidth="md" sx={{ p: [2, 3, 3], overflow: 'auto' }}>
      <Paper variant="outlined" sx={{ p: [2, 3, 3], borderRadius: 2, mb: 3, position: 'relative' }}>
        <Box display="flex" flexDirection="column" gap={3}>
          <Typography textAlign="center" variant="h2" color="primary">
            {t('RegistrationLayout.welcome_to_carsu')}
          </Typography>

          <Box display="flex" alignItems="center" justifyContent="center">
            <Typography textAlign="center" fontSize={20}>
              {t('dynamic.finish_registration_for', {
                email: user?.emailAddresses?.[0]?.emailAddress,
              })}
            </Typography>
          </Box>

          <SettingsForm shop={shop as Shop} isSaving={isSaving} onSave={handleSave} />
        </Box>
      </Paper>
    </Container>
  );
};
