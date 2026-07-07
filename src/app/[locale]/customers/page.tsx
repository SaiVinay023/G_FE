import { Box } from '@mui/material';
import { FC } from 'react';

import { Customers } from 'src/components/pages/Customers';

const CustomersWrapper: FC = () => {
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
      <Customers />
    </Box>
  );
};

export default CustomersWrapper;
