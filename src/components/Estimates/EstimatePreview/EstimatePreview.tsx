'use client';
import { Paper, Stack, Box } from '@mui/material';
import React, { FC } from 'react';

import { Loader } from 'src/components/Loader';
import { EstimateInfo } from 'src/components/modals/EstimateModal/EstimateInfo';
import { useEstimateID } from 'src/hooks/pages';
import { EstimateRes } from 'src/models';

export const EstimatePreview: FC<{ id: string }> = ({ id }) => {
  const { estimate, loading } = useEstimateID(id);

  return (
    <Box
      component={Paper}
      variant="outlined"
      flexGrow={1}
      position="relative"
      sx={{
        borderRadius: '15px',
      }}
    >
      <Loader
        sx={{ mb: 3, minHeight: 150, position: 'absolute' }}
        loading={!loading}
        render={() => (
          <Stack gap={5} height="100%">
            <EstimateInfo estimate={estimate as EstimateRes} />
          </Stack>
        )}
      />
    </Box>
  );
};
