'use client';

import GroupIcon from '@mui/icons-material/Group';
import { alpha, Box, Drawer, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import React, { FC, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from 'src/hooks/store';
import { useRouter, usePathname } from 'src/i18n/routing';
import { selectMessages } from 'src/store/selectors/messagesSelectors';
import { selectUsers } from 'src/store/selectors/usersSelectors';
import { setCurrentUserId, setMessages } from 'src/store/slices/messagesSlice';
import { User } from 'src/store/slices/usersSlice';
import { extractDigits } from 'src/utils/extractDigits';

import { ChatList } from './ChatList';
import { ChatWindow } from './ChatWindow';
import { MessageInput } from './MessageInput';

export const ChatPage: FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const messages = useAppSelector(selectMessages);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(true);
  const searchParams = useSearchParams();
  const phoneFromQuery = searchParams.get('phone');

  const handleUserReset = () => {
    setSelectedUser(null);
    setDrawerOpen(true);

    router.push(pathname);
    dispatch(setCurrentUserId(null));
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setDrawerOpen(false);

    const phone = extractDigits(user.phone);
    router.push(`?phone=${phone}`);
    dispatch(setCurrentUserId(user.id));
  };

  const handleSend = (text: string) => {
    if (!selectedUser) return;
    dispatch(
      setMessages({
        userId: selectedUser.id,
        messages: [...messages?.[selectedUser?.id], { id: `msg-${Date.now()}`, sender: false, text, timestamp: 'Now' }],
      }),
    );
  };

  useEffect(() => {
    if (phoneFromQuery && !selectedUser) {
      const user = users?.find((userItem) => extractDigits(userItem?.phone) === phoneFromQuery);

      if (user) {
        handleUserClick(user);
      } else {
        handleUserReset();
      }
    }
  }, []);

  return (
    <Box display="flex" height="100vh" position="relative" overflow="hidden">
      {isMobile && !drawerOpen && (
        <IconButton
          onClick={() => setDrawerOpen(true)}
          sx={{
            'position': 'fixed',
            'top': 12,
            'right': 16,
            'backgroundColor': theme.palette.primary.main,
            'color': theme.palette.common.white,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.8),
            },
            'zIndex': 1300,
          }}
        >
          <GroupIcon />
        </IconButton>
      )}

      {!isMobile && (
        <Box width="300px" bgcolor="#fff" borderRight="1px solid #ddd">
          <ChatList users={users} onSelect={handleUserClick} />
        </Box>
      )}

      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        sx={{
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
        }}
      >
        {!selectedUser ? (
          <Box flex={1} display="flex" justifyContent="center" alignItems="center">
            <Typography variant="h6" color="textSecondary">
              Select a user to start chatting
            </Typography>
          </Box>
        ) : (
          <>
            <ChatWindow messages={messages?.[selectedUser?.id] || []} />
            <MessageInput onSend={handleSend} />
          </>
        )}
      </Box>

      {isMobile && (
        <Drawer
          sx={{
            width: 300,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: 300, boxSizing: 'border-box' },
          }}
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <ChatList users={users} onSelect={handleUserClick} />
        </Drawer>
      )}
    </Box>
  );
};
