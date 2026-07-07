import { Box } from '@mui/material';
import { FC } from 'react';

import { ChatPage as Chat } from 'src/components/ChatPage';

const ChatPage: FC = () => {
  return (
    <Box
      position="relative"
      flexGrow={1}
      display="flex"
      flexDirection="column"
      height="100%"
      sx={{ overflowY: 'auto' }}
    >
      <Chat />
    </Box>
  );
};

export default ChatPage;
