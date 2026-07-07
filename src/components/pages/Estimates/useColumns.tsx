import { Typography } from '@mui/material';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import React from 'react';

import { LicensePlate } from 'src/components/LicensePlate';
import { StatusLabel } from 'src/components/StatusLabel/StatusLabel';
import { SmartTableColumn } from 'src/components/Table';
import { EstimateRes } from 'src/models';
import { formatMoney } from 'src/utils/money';

export const useColumns = (): SmartTableColumn<EstimateRes>[] => {
  const t = useTranslations();

  return [
    {
      minWidth: 120,
      getValue: (item) => (
        <Typography fontFamily="inherit" fontSize={16} component="span">
          {moment(item?.creationDate).format('MM.DD.YYYY')}
        </Typography>
      ),
      name: 'creationDate',
      title: t('Estimates.date'),
      growCoefficient: 5,
    },
    {
      minWidth: 350,
      getValue: (item) => (
        <Typography fontFamily="inherit" fontSize={16} component="span">
          {item?.title}
        </Typography>
      ),
      name: 'title',
      title: t('Estimates.topic'),
      growCoefficient: 1,
    },
    {
      minWidth: 170,
      getValue: (item) => (
        <Typography fontFamily="inherit" fontSize={16} component="span">
          {item?.user?.firstName} {item?.user?.lastName}
        </Typography>
      ),
      name: 'customer.name',
      title: t('Estimates.client'),
      growCoefficient: 1,
    },
    {
      minWidth: 212,
      getValue: (item) => (
        <span>
          <LicensePlate
            licensePlateNumber={item?.vehicle?.licensePlateNumber}
            licensePlateNumberCountryCode={item?.vehicle?.licensePlateNumberCountryCode}
          />
        </span>
      ),
      name: 'vehicle.licensePlateNumber',
      title: t('Estimates.plate'),
      growCoefficient: 1,
    },
    {
      minWidth: 200,
      getValue: (item) => (
        <Typography fontFamily="inherit" fontSize={16} component="span">
          {formatMoney(Number(item?.total ?? 0) / 100)}
        </Typography>
      ),
      name: 'total',
      title: t('Estimates.amount'),
      growCoefficient: 1,
    },
    {
      minWidth: 200,
      getValue: (item) => {
        return (
          <Typography fontFamily="inherit" fontSize={16} component="span">
            <StatusLabel status={item?.status} />
          </Typography>
        );
      },
      name: 'status',
      title: t('Estimates.status'),
      growCoefficient: 1,
    },
  ];
};
