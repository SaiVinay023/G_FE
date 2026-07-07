'use client';

import { useUser, UserButton } from '@clerk/nextjs';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { Box, IconButton } from '@mui/material';
import Badge from '@mui/material/Badge';
import { FC } from 'react';

import { Search, SearchIconWrapper, StyledInputBase } from 'src/components/Layout/Header/NavigationButtons/styles';
import { CreateCustomer } from 'src/components/modals/CreateCustomer';
import { CreateEstimate } from 'src/components/modals/CreateEstimate';
import { Tooltip } from 'src/components/Tooltip';
import { useModal } from 'src/hooks/components/useModal';

export const NavigationButtons: FC<{ disableSearch: boolean }> = ({ disableSearch }) => {
  const modal = useModal();
  const { user, isLoaded } = useUser();

  const addCustomer = () => {
    modal.openModal(CreateCustomer);
  };

  const addEstimate = () => {
    modal.openModal(CreateEstimate);
  };

  return (
    <>
      {!disableSearch && (
        <Search>
          <SearchIconWrapper>
            <SearchIcon color="primary" />
          </SearchIconWrapper>

          <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
        </Search>
      )}

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ display: { xs: 'flex', md: 'none' } }} alignItems="center" gap={1}>
        {isLoaded && (
          <Box pl={1}>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: '40px',
                    height: '40px',
                  },
                },
              }}
            />
          </Box>
        )}
      </Box>

      <Box sx={{ display: { xs: 'none', md: 'flex' } }} alignItems="center" gap={1}>
        <Tooltip title="Create Customer">
          <IconButton size="large" color="inherit" aria-label="Create Customer" onClick={addCustomer}>
            <PersonAddOutlinedIcon color="primary" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Create Estimate">
          <IconButton size="large" color="inherit" aria-label="Create Estimate" onClick={addEstimate}>
            <PostAddOutlinedIcon color="primary" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Notifications">
          <IconButton size="large" aria-label="show new notifications" color="inherit">
            <Badge badgeContent={17} color="error">
              <NotificationsNoneOutlinedIcon color="primary" />
            </Badge>
          </IconButton>
        </Tooltip>

        {isLoaded && (
          <Tooltip title={user?.fullName}>
            <Box pl={1}>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: {
                      width: '40px',
                      height: '40px',
                    },
                  },
                }}
              />
            </Box>
          </Tooltip>
        )}
      </Box>
    </>
  );
};
