'use client';

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface Estimate {
  id: string;
  title: string;
  date: string;
  amount: number;
}

interface EstimatesTabProps {
  estimates?: Estimate[];
  expandedSections?: Record<string, boolean>;
  toggleSection?: (section: string) => void;
}

const EstimatesTab: React.FC<EstimatesTabProps> = ({ estimates = [] }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>Estimates</Typography>
      {estimates.length === 0 ? (
        <Typography>No estimates available.</Typography>
      ) : (
        estimates.map(estimate => (
          <Paper key={estimate.id} sx={{ p: 2, mb: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1">{estimate.title}</Typography>
              <Typography variant="body2">{estimate.date} — {estimate.amount}€</Typography>
            </Box>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default EstimatesTab;
