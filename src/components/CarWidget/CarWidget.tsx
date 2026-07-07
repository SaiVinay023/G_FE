import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, Typography, IconButton, Menu, MenuItem, MenuList, Avatar } from '@mui/material';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import { LicensePlate } from 'src/components/LicensePlate';
import { SearchResult } from 'src/components/modals/CreateEstimate/SearchCustomerForm';
import type { Vehicle } from 'src/models';

interface CarWidgetProps {
  vehicle: SearchResult;
  disableMenu?: boolean;
  showCustomer?: boolean;
  updateVehicle?: (val: Vehicle) => void;
}

export const CarWidget: React.FC<CarWidgetProps> = ({
  showCustomer = false,
  disableMenu = false,
  vehicle,
  updateVehicle,
}) => {
  const t = useTranslations();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditVehicle = () => {
    updateVehicle?.(vehicle);
    handleMenuClose();
  };

  const handleCreateEstimate = () => {
    handleMenuClose();
  };

  return (
    <Box
      sx={{
        position: 'relative',
        backgroundColor: 'white',
        borderRadius: 2,
        p: [1, 2, 2],
        border: '1px solid',
        borderColor: 'grey.300',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        minWidth: '270px',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {showCustomer && (
          <>
            {vehicle?.name && (
              <Typography variant="subtitle1" fontWeight={600}>
                {vehicle.name}
              </Typography>
            )}

            {vehicle?.phoneNumber && (
              <Typography variant="body2" color="textSecondary">
                {vehicle?.phoneNumber}
              </Typography>
            )}

            {(vehicle?.name || vehicle?.phoneNumber) && (
              <Box
                sx={{
                  width: '100%',
                  height: '1px',
                  bgcolor: 'grey.300',
                  my: 1,
                }}
              />
            )}
          </>
        )}

        <Typography variant="body2" fontWeight={600}>
          {vehicle.make} {vehicle.model}
        </Typography>

        <Typography gutterBottom variant="body2" color="textSecondary">
          {vehicle.type}
        </Typography>

        <LicensePlate
          licensePlateNumber={vehicle.licensePlateNumber}
          licensePlateNumberCountryCode={vehicle.licensePlateNumberCountryCode}
        />
      </Box>

      <Avatar
        variant="square"
        src={vehicle.image || 'https://via.placeholder.com/150?text=No+Image'}
        alt={vehicle.make}
        sx={{
          width: disableMenu ? [86, 110, 185] : [86, 96],
          height: disableMenu ? '100%' : [86, 96],
          minHeight: [86, 96],
          mr: 2,
          img: {
            objectFit: 'contain',
            width: '100%',
            height: '100%',
          },
          ...(disableMenu ? { ml: [2, 4, 4] } : {}),
        }}
      />

      {!disableMenu && (
        <>
          <Box position="absolute" top={0.25} right={0.5}>
            <IconButton onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuList>
              <MenuItem onClick={handleEditVehicle}>{t('Added.editVehicle')}</MenuItem>
              <MenuItem onClick={handleCreateEstimate}>{t('Single.createEstimate')}</MenuItem>
            </MenuList>
          </Menu>
        </>
      )}
    </Box>
  );
};
