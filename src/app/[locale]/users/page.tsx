import { Box } from '@mui/material';
import { FC } from 'react';

import { Employees } from 'src/components/pages';

const Users: FC = () => {
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
      <Employees />
    </Box>
  );
};

export default Users;
