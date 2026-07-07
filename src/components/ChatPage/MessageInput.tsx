import SendIcon from '@mui/icons-material/Send';
import { Box, TextField, Button } from '@mui/material';
import React, { useState } from 'react';

export const MessageInput = ({ onSend }: { onSend: (text: string) => void }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Box display="flex" p={2} bgcolor="#fff" borderTop="1px solid #ddd">
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        placeholder="Type a message"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <Button
        variant="contained"
        color="primary"
        sx={{ ml: 1 }}
        endIcon={<SendIcon fontSize="small" />}
        onClick={handleSend}
      >
        Send
      </Button>
    </Box>
  );
};
