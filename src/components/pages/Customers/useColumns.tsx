import { Avatar, Box, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import React from 'react';

import { LicensePlate } from 'src/components/LicensePlate';
import { SmartTableColumn } from 'src/components/Table';
import { Customer } from 'src/models';
import { formatPhoneNumber } from 'src/utils/formatPhoneNumber';

import { stringAvatar } from '../../../utils/getAvatarInitials';

export const useColumns = (): SmartTableColumn<Customer>[] => {
  const t = useTranslations();

  return [
    {
      minWidth: 350,
      getValue: (item) => {
        const fullName = `${item?.user?.firstName || ''} ${item?.user?.lastName || ''}`.trim();
        return (
          <Box component="span" display="flex" alignItems="center">
            <Avatar
              {...stringAvatar(fullName)}
              sx={{ ...stringAvatar(fullName).sx, width: 24, height: 24, fontSize: 12 }}
            />

            <Typography fontFamily="inherit" fontSize={16} component="span" sx={{ ml: 1 }}>
              {fullName}
            </Typography>
          </Box>
        );
      },
      name: 'user.firstName',
      title: t('customers.name'),
      growCoefficient: 1,
    },
    {
      minWidth: 170,
      getValue: (item) => (
        <Typography fontFamily="inherit" fontSize={16} component="span">
          {formatPhoneNumber(item?.user?.contact?.phone || '')}
        </Typography>
      ),
      name: 'user.contact.phone',
      title: t('customers.phone'),
      growCoefficient: 1,
    },
    {
      minWidth: 212,
      getValue: (item) => {
        const firstVehicle = item?.vehicles?.[0]?.vehicle;
        return (
          <span>
            <LicensePlate
              licensePlateNumber={firstVehicle?.licensePlateNumber}
              licensePlateNumberCountryCode={firstVehicle?.licensePlateNumberCountryCode}
            />
          </span>
        );
      },
      name: 'vehicles[0].vehicle.licensePlateNumber',
      title: t('customers.licensePlate'),
      growCoefficient: 1,
    },
  ];
};
