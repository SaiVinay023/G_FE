import { Box } from '@mui/material';
import { FC } from 'react';

import { Settings as SettingsPage } from 'src/components/pages';

const Settings: FC = () => {
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
      <SettingsPage />
    </Box>
  );
};

export default Settings;
