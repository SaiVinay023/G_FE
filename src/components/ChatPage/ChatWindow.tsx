import CheckIcon from '@mui/icons-material/Check';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { Box, Typography } from '@mui/material';
import React, { FC, useMemo, useRef, useEffect } from 'react';

import { Message } from 'src/store/slices/messagesSlice';

type ChatWindowProps = {
  messages: Message[];
};

export const ChatWindow: FC<ChatWindowProps> = ({ messages }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  const groupMessagesByDate = useMemo(() => {
    return messages.reduce((groups: { [date: string]: Message[] }, message) => {
      const date = new Date(message.timestamp).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {});
  }, [messages]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <Box flex={1} overflow="auto" p={2} bgcolor="#f5f5f5">
      {Object.entries(groupMessagesByDate).map(([date, messages]) => (
        <Box key={date} mb={4}>
          <Typography variant="caption" color="textSecondary" textAlign="center" display="block" mb={2}>
            {date === new Date().toLocaleDateString() ? 'Today' : date}
          </Typography>

          {messages.map((msg) => (
            <Box key={msg.id} display="flex" justifyContent={msg.sender ? 'flex-start' : 'flex-end'} mb={1}>
              <Box
                bgcolor={msg.sender ? '#e0e0e0' : '#007bff'}
                color={msg.sender ? '#000' : '#fff'}
                borderRadius={4}
                p={1.5}
                pb={0.25}
                maxWidth="70%"
                position="relative"
              >
                <Typography variant="body2">{msg.text}</Typography>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={1}
                  fontSize="12px"
                  color={msg.sender ? '#555' : '#ddd'}
                >
                  <Typography variant="caption">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>

                  {!msg.sender && (
                    <Box ml={1}>{msg.read ? <DoneAllIcon fontSize="small" /> : <CheckIcon fontSize="small" />}</Box>
                  )}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      ))}

      <Box ref={bottomRef} sx={{ pb: 4 }} />
    </Box>
  );
};
