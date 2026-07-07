import { BuiltInEstimateStatus, BuiltInWorkCardStatus, columnStatusTitles } from 'src/models';

export type ChipColorType = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
export const getStatusChip = (
  status: BuiltInEstimateStatus | BuiltInWorkCardStatus,
): {
  chipColor: ChipColorType;
  statusLabel: string;
} => {
  let chipColor: ChipColorType = 'default';
  let statusLabel = 'Unknown';

  switch (status) {
    case BuiltInEstimateStatus.CONCEPT:
      chipColor = 'primary';
      statusLabel = 'Concept';
      break;
    case BuiltInEstimateStatus.SENT:
      chipColor = 'warning';
      statusLabel = 'Sent';
      break;
    case BuiltInEstimateStatus.APPROVED:
      chipColor = 'info';
      statusLabel = 'Approved';
      break;
    case BuiltInEstimateStatus.SCHEDULED:
      chipColor = 'success';
      statusLabel = 'Scheduled';
      break;
    case BuiltInEstimateStatus.CANCELED:
      chipColor = 'error';
      statusLabel = 'Declined';
      break;
    case BuiltInWorkCardStatus.EXPECTED:
      chipColor = 'primary';
      statusLabel = columnStatusTitles[BuiltInWorkCardStatus.EXPECTED];
      break;
    case BuiltInWorkCardStatus.IN_HOUSE:
      chipColor = 'primary';
      statusLabel = columnStatusTitles[BuiltInWorkCardStatus.IN_HOUSE];
      break;
    case BuiltInWorkCardStatus.IN_PROGRESS:
      chipColor = 'primary';
      statusLabel = columnStatusTitles[BuiltInWorkCardStatus.IN_PROGRESS];
      break;
    case BuiltInWorkCardStatus.READY:
      chipColor = 'primary';
      statusLabel = columnStatusTitles[BuiltInWorkCardStatus.READY];
      break;
    case BuiltInWorkCardStatus.PICKED_UP:
      chipColor = 'primary';
      statusLabel = columnStatusTitles[BuiltInWorkCardStatus.PICKED_UP];
      break;
    case BuiltInWorkCardStatus.ON_HOLD:
      chipColor = 'error';
      statusLabel = columnStatusTitles[BuiltInWorkCardStatus.ON_HOLD];
      break;
  }

  return {
    chipColor,
    statusLabel,
  };
};
