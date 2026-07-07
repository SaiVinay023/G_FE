import { Box } from '@mui/material';
import { FC } from 'react';

import { CannedJobPage } from 'src/components/pages/CannedJob';

const Canned: FC = () => {
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
      <CannedJobPage />
    </Box>
  );
};

export default Canned;
