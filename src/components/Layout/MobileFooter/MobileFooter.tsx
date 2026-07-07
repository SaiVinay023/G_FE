import AddIcon from '@mui/icons-material/Add';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { BottomNavigation, BottomNavigationAction, Badge, Paper } from '@mui/material';
import React, { useState } from 'react';

import { CreateCustomer } from 'src/components/modals/CreateCustomer';
import { CreateEstimate } from 'src/components/modals/CreateEstimate';
import { useModal } from 'src/hooks/components/useModal';

export const MobileFooter = () => {
  const modal = useModal();
  const [value, setValue] = useState<number | undefined>(undefined);

  const addCustomer = () => {
    modal.openModal(CreateCustomer, {
      onModalResolved: () => {
        setValue(undefined);
      },
      onModalRejected: () => {
        setValue(undefined);
      },
    });
  };

  const addEstimate = () => {
    modal.openModal(CreateEstimate, {
      onModalResolved: () => {
        setValue(undefined);
      },
      onModalRejected: () => {
        setValue(undefined);
      },
    });
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: { xs: 'block', md: 'none' },
        zIndex: 1,
      }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={value}
        sx={{ minHeight: 60 }}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction label="Customer" icon={<AddIcon />} onClick={addCustomer} />

        <BottomNavigationAction
          label="Notifications"
          icon={
            <Badge badgeContent={17} color="error">
              <NotificationsNoneOutlinedIcon />
            </Badge>
          }
        />
        <BottomNavigationAction label="Estimate" icon={<AddIcon />} onClick={addEstimate} />
      </BottomNavigation>
    </Paper>
  );
};
