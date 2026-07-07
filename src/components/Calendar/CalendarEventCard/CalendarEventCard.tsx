import { Typography, Box } from '@mui/material';
import moment from 'moment/moment';
import { FC } from 'react';

import { EstimateModal } from 'src/components/modals/EstimateModal';
import { Tooltip, TooltipTitle } from 'src/components/Tooltip';
import { useModal } from 'src/hooks/components/useModal';
import { WorkCard } from 'src/models';

interface CardProps {
  card: WorkCard;
  timeText?: string;
  isBreak?: boolean;
  showMonthContent?: boolean;
  onChange?: (value: string) => void;
}

export const CalendarEventCard: FC<CardProps> = ({ isBreak, timeText, showMonthContent = false, card, onChange }) => {
  const modal = useModal();

  const openEstimateModal = () => {
    if (isBreak) return;

    // @ts-expect-error modal type error
    modal.openModal(EstimateModal, {
      payload: { card, assignWorker: true },
      fullHeight: true,
    });
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    event.preventDefault();
    openEstimateModal();
  };

  return (
    <Tooltip
      title={
        <TooltipTitle>
          <Typography>
            {showMonthContent && card?.assignedDate ? moment(card?.assignedDate).format('HH:mm') : timeText}
          </Typography>

          <Typography fontSize={12} fontWeight={400}>
            {card?.title}
          </Typography>
        </TooltipTitle>
      }
    >
      <Box
        display="flex"
        flexDirection="column"
        data-event={JSON.stringify(card)}
        gap={0.25}
        sx={{
          borderRadius: '4px',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
        onClick={openEstimateModal}
        onTouchEnd={handleTouchStart}
      >
        <Typography color={isBreak ? 'textPrimary' : 'common.white'}>
          {showMonthContent && card?.assignedDate ? moment(card?.assignedDate).format('HH:mm') : timeText}
        </Typography>

        <Typography fontSize={12} fontWeight={400} noWrap color={isBreak ? 'textPrimary' : 'common.white'}>
          {card?.title}
        </Typography>
      </Box>
    </Tooltip>
  );
};
