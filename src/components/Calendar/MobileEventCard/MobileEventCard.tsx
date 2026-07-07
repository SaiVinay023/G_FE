import { Card, CardContent, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/system';
import moment from 'moment';
import { FC, useCallback } from 'react';

import { EstimateModal } from 'src/components/modals/EstimateModal';
import { useModal } from 'src/hooks/components/useModal';
import { CalendarEvent } from 'src/models';

interface MobileEventCardProps {
  event: CalendarEvent;
}

export const MobileEventCard: FC<MobileEventCardProps> = ({ event }) => {
  const modal = useModal();
  const theme = useTheme();

  const openEstimateModal = useCallback(
    (card: CalendarEvent) => {
      if (card.break || !card?.cardData?.id) return;
      // @ts-expect-error modal type error
      modal.openModal(EstimateModal, {
        payload: {
          card: card.cardData,
        },
        fullHeight: true,
      });
    },
    [modal],
  );

  return (
    <Card
      key={event.id}
      sx={{
        'mt': 1,
        '&.MuiPaper-root': {
          background: event.break
            ? alpha(theme.palette.secondary.main, 0.3)
            : alpha(theme.palette.primary.main, 0.1) + '!important',
        },
      }}
      onClick={() => openEstimateModal(event)}
    >
      <CardContent sx={{ pb: '16px !important' }}>
        <Typography gutterBottom variant="h6">
          {event.title}
        </Typography>

        <Typography variant="body2">
          {moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}
        </Typography>

        {!event.break && event.description && (
          <Typography variant="body1" sx={{ mt: 1 }}>
            {event.description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
