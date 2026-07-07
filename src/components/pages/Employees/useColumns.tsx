import DeleteIcon from '@mui/icons-material/Delete';
import { Typography, IconButton } from '@mui/material';
import { useTranslations } from 'next-intl';
import React from 'react';

import { SmartTableColumn } from 'src/components/Table';
import { Employee } from 'src/models';
import { formatPhoneNumber } from 'src/utils/formatPhoneNumber';

export const useColumns = (onDelete: (item: Employee) => void): SmartTableColumn<Employee>[] => {
  const t = useTranslations();

  return [
    {
      minWidth: 350,
      getValue: (item) => (
        <Typography fontFamily="inherit" fontSize={16} component="span">
          {item?.user?.firstName} {item?.user?.lastName}
        </Typography>
      ),
      name: 'name',
      title: t('columnTitle.name'),
      growCoefficient: 1,
    },
    {
      minWidth: 170,
      getValue: (item) => (
        <Typography fontFamily="inherit" fontSize={16} component="span">
          {formatPhoneNumber(item?.user?.contact?.phone || '')}
        </Typography>
      ),
      name: 'phoneNumber',
      title: t('customers.phone'),
      growCoefficient: 1,
    },
    {
      minWidth: 100,
      getValue: (item) => (
        <IconButton color="error" onClick={() => onDelete(item)}>
          <DeleteIcon />
        </IconButton>
      ),
      name: 'action',
      title: t('columnTitle.action'),
      growCoefficient: 0,
    },
  ];
};
