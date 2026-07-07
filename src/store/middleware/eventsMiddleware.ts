import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import moment from 'moment';

import { RootState } from 'src/store';
import { dummyEvents } from 'src/store/dummyData/dummyEvents';
import { EventsActions, EventsState } from 'src/store/slices/eventSlice';

const eventsListenerMiddleware = createListenerMiddleware();

const fetchEvents = async (filters: EventsState['filters']) => {
  // TODO: Replace with API request in the future
  return dummyEvents
    .filter((event) => {
      const eventDate = moment(event.start);
      return (
        (!filters.startDate || eventDate.isSameOrAfter(moment(filters.startDate))) &&
        (!filters.endDate || eventDate.isSameOrBefore(moment(filters.endDate)))
      );
    })
    .map((event) => ({
      ...event,
      start: moment(event.start).format('YYYY-MM-DD HH:mm:ss'),
      end: moment(event.end).format('YYYY-MM-DD HH:mm:ss'),
    }));
};

eventsListenerMiddleware.startListening({
  matcher: isAnyOf(EventsActions.calendarInitialize, EventsActions.updateFilters),
  effect: async (_action, listenerApi) => {
    try {
      const state = listenerApi.getState() as RootState;
      const filters = state.events.filters;
      const data = await fetchEvents(filters);
      const unassignedEvents = data.filter((event) => !event.cardData?.assignee && !event.break);
      const assignedEvents = data.filter((event) => !!event.cardData?.assignee || event.break);

      listenerApi.dispatch(EventsActions.setEvents(assignedEvents));
      listenerApi.dispatch(EventsActions.setUnassignedEvents(unassignedEvents));
    } catch (error) {
      console.error('Failed to fetch events', error);
    }
  },
});

export const { middleware: eventsActionsMiddleware } = eventsListenerMiddleware;
