import { Box } from '@mui/material';
import { FC } from 'react';

import { Estimates as EstimatesPage } from 'src/components/pages';

const Estimates: FC = () => {
  return (
    <Box
      position="relative"
      p={2}
      flexGrow={1}
      display="flex"
      flexDirection="column"
      height="100%"
      sx={{ overflowY: 'auto' }}
    >
      <EstimatesPage />
    </Box>
  );
};

export default Estimates;
