import { Box, Divider, Typography } from '@mui/material';
import { groupBy, sortBy } from 'lodash';
import moment from 'moment';
import { FC, useMemo } from 'react';

import { MobileEventCard } from 'src/components/Calendar/MobileEventCard';
import { CalendarEvent } from 'src/models';

interface MobileEventListProps {
  events: CalendarEvent[];
}

export const MobileEventList: FC<MobileEventListProps> = ({ events }) => {
  const groupedEvents = useMemo(() => {
    const sortedEvents = sortBy(events, (event) => moment(event.start).valueOf());
    return groupBy(sortedEvents, (event) => moment(event.start).format('YYYY-MM-DD'));
  }, [events]);

  return (
    <Box sx={{ maxHeight: '90vh', overflowY: 'auto', p: 2 }}>
      {Object.entries(groupedEvents).map(([date, dailyEvents]) => (
        <Box key={date} mb={2}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
            {moment(date).format('DD MMMM YYYY')}
          </Typography>

          <Divider />

          {dailyEvents.map((event) => (
            <MobileEventCard key={event.id} event={event} />
          ))}
        </Box>
      ))}
    </Box>
  );
};
