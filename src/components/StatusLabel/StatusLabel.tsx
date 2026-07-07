import { alpha, Chip, ChipProps } from '@mui/material';
import { useTranslations } from 'next-intl';
import React, { FC, useMemo } from 'react';

import { BuiltInEstimateStatus, BuiltInWorkCardStatus, BuiltInWorkCardStatusValues } from 'src/models';
import { getStatusChip } from 'src/utils/getStatusColor';

type StatusLabelProps = {
  showWorkLabel?: boolean;
  fullWidth?: boolean;
  size?: ChipProps['size'];
  status: BuiltInEstimateStatus | BuiltInWorkCardStatus;
  onClick?: (val: BuiltInEstimateStatus | BuiltInWorkCardStatus) => void;
};

export const StatusLabel: FC<StatusLabelProps> = ({
  fullWidth = false,
  showWorkLabel = false,
  size = 'small',
  status,
  onClick,
}) => {
  const statusValue = getStatusChip(status);
  const t = useTranslations();
  const label = useMemo(
    () =>
      statusValue?.statusLabel !== 'Unknown'
        ? showWorkLabel
          ? t(statusValue.statusLabel)
          : statusValue.statusLabel
        : '',
    [statusValue.statusLabel, showWorkLabel, t],
  );

  return !label ? null : (
    <Chip
      component="span"
      size={size}
      label={label}
      color={statusValue.chipColor}
      variant="outlined"
      sx={(theme) => ({
        minWidth: 95,
        // @ts-ignore
        bgcolor: alpha(theme.palette[statusValue.chipColor]?.main || theme.palette.grey[500], 0.1),
        ...(fullWidth && {
          width: '100%',
        }),
      })}
      onClick={!onClick ? undefined : () => onClick(status)}
    />
  );
};
