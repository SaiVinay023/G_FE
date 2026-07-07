import { Box } from '@mui/material';
import React from 'react';

import { EstimateCard } from 'src/components/Estimates/EstimateCard';
import { EstimateRes } from 'src/models';

interface EstimateGridProps {
  estimates: EstimateRes[];
}

export const EstimateGrid: React.FC<EstimateGridProps> = ({ estimates }) => {
  return (
    <Box
      p={2}
      sx={{
        'display': 'grid',
        'gap': '16px',
        'gridTemplateColumns': `
          repeat(auto-fit, minmax(280px, 1fr))
        `,
        '@media (max-width: 600px)': {
          gridTemplateColumns: '1fr',
        },
        '@media (min-width: 600px) and (max-width: 960px)': {
          gridTemplateColumns: 'repeat(2, 1fr)',
        },
        '@media (min-width: 960px)': {
          gridTemplateColumns: 'repeat(3, 1fr)',
        },
      }}
    >
      {estimates.map((estimate) => (
        <EstimateCard key={estimate.id} card={estimate} />
      ))}
    </Box>
  );
};
