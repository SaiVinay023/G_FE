import { List, ListItem, ListItemText, Avatar, Button, useTheme, alpha, Box, TextField } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { FC, useCallback, useState, useMemo } from 'react';

import { User } from 'src/store/slices/usersSlice';
import { extractDigits } from 'src/utils/extractDigits';

type ChatListProps = {
  users: User[];
  onSelect: (user: User) => void;
};

export const ChatList: FC<ChatListProps> = ({ users, onSelect }) => {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const phoneFromQuery = searchParams.get('phone');
  const theme = useTheme();

  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        const search = searchTerm.toLowerCase();
        const phone = extractDigits(user.phone);
        return user.name.toLowerCase().includes(search) || phone.includes(search);
      }),
    [searchTerm, users],
  );

  const isActive = useCallback(
    (user: User) => {
      const phone = extractDigits(user.phone);
      return phoneFromQuery === phone;
    },
    [phoneFromQuery],
  );

  return (
    <Box display="flex" flexDirection="column" height="100%" overflow="hidden">
      <Box p={2} pb={1}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Search by name or phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <List sx={{ overflowY: 'auto' }}>
        {filteredUsers.map((user) => (
          <ListItem
            variant="text"
            component={Button}
            key={user.id}
            sx={{
              'minHeight': 72,
              'backgroundColor': isActive(user) ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              },
            }}
            onClick={() => onSelect(user)}
          >
            <Avatar src={user.avatar} />
            <ListItemText primary={user.name} secondary={user.phone} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
