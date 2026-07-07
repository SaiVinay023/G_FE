import { Box, Typography, Badge, Divider, CircularProgress } from '@mui/material';
import { useTranslations } from 'next-intl';
import React, { memo, ReactNode } from 'react';

export interface ColumnLayoutProps {
  title: string;
  defaultHeight?: string;
  badgeContent: number;
  loading: boolean;
  children: ReactNode;
}

export const ColumnLayout: React.FC<ColumnLayoutProps> = memo(
  ({ defaultHeight = '160px', children, badgeContent, loading, title }) => {
    const t = useTranslations();

    return (
      <>
        <Box
          px={2}
          pt={2}
          width="100%"
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}
        >
          <Typography variant="h6" color={title === 'On hold' ? 'orange' : 'black'}>
            {title === 'Unassigned' && t('Scheduling.unassigned')}
            {title === 'Expected' && t('Today.expected')}
            {title === 'In-house' && t('Today.inHouse')}
            {title === 'In-progress' && t('Today.inProgress')}
            {title === 'Ready' && t('Today.ready')}
            {title === 'Picked up' && t('Today.pickedUp')}
            {title === 'On hold' && t('Today.onHold')}
          </Typography>
          <Badge badgeContent={badgeContent} color={title === 'On hold' ? 'error' : 'primary'} />
        </Box>

        <Divider />

        <Box
          display="flex"
          height="100%"
          minHeight={`calc(100vh - ${defaultHeight})`}
          maxHeight={`calc(100vh - ${defaultHeight})`}
          sx={{
            overflowY: 'auto',
            ...(loading
              ? {
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  pt: 5,
                }
              : {}),
          }}
        >
          {loading ? <CircularProgress /> : children}
        </Box>
      </>
    );
  },
);
