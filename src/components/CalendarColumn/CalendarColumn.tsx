import { ThirdPartyDraggable } from '@fullcalendar/interaction';
import { Paper, Box } from '@mui/material';
import React, { memo, useEffect, useRef } from 'react';

import { Card } from 'src/components/KanbanBoard/Card';
import { ColumnLayout } from 'src/components/KanbanBoard/ColumnLayout';
import { CalendarEvent, WorkCard } from 'src/models';
import { enableTextSelectionPrevention, disableTextSelectionPrevention } from 'src/utils/preventTextSelection';

interface ColumnProps {
  events: CalendarEvent[];
  loading: boolean;
  onChange?: () => void;
}

export const CalendarColumn = memo(({ events, loading }: ColumnProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    enableTextSelectionPrevention();

    const containerEl = containerRef.current;

    if (!containerEl || initializedRef.current) return;

    initializedRef.current = true;

    new ThirdPartyDraggable(containerEl, {
      itemSelector: '.fc-event',
      eventData(eventEl) {
        return (eventEl?.dataset?.event ?? '')?.length > 0 ? JSON.parse(eventEl?.dataset?.event ?? '') : {};
      },
    });

    return () => {
      disableTextSelectionPrevention();
    };
  }, []);

  return (
    <Paper
      ref={containerRef}
      variant="outlined"
      sx={{ p: 0, minWidth: '277px', mr: 2, borderRadius: 2, pb: 3, height: '100%' }}
    >
      <ColumnLayout loading={loading} badgeContent={events?.length} title="Unassigned">
        <Box width="100%" p={2}>
          {events.map((card, index) => (
            <Box
              key={card.id}
              mb={2}
              data-event={JSON.stringify(card)}
              data-title={card?.title}
              className="fc-event"
              data-id={card.id}
            >
              <Card disableDnD card={(card.cardData || {}) as WorkCard} index={index} />
            </Box>
          ))}

          <Box height={50} width="100%" />
        </Box>
      </ColumnLayout>
    </Paper>
  );
});
