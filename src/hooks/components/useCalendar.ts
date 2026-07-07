import type { EventChangeArg, EventDropArg } from '@fullcalendar/core';
import moment from 'moment';
import { useCallback, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from 'src/hooks/store';
import { CalendarEvent } from 'src/models';
import {
  selectEvents,
  selectEventsFilters,
  selectEventsInitialized,
  selectEventsLoading,
  selectUnassignedEvents,
} from 'src/store/selectors/eventsSelectors';
import { EventsActions, EventsState } from 'src/store/slices/eventSlice';

interface UseCalendarReturn {
  events: CalendarEvent[];
  unassignedEvents: CalendarEvent[];
  filters: EventsState['filters'];
  loading: boolean;
  onEventDrop: (eventDropInfo: EventDropArg) => void;
  onEventChange: (updatedEvent: EventChangeArg) => void;
  onEventRemove: (eventId: string) => void;
  onEventAdd: (newEvent: CalendarEvent) => void;
  updateFilters: (newFilters: Partial<EventsState['filters']>) => void;
}
export const defaultSlotMinTime = '07:00:00';
export const defaultSlotMaxTime = '20:00:00';

export const useCalendar = (): UseCalendarReturn => {
  const dispatch = useAppDispatch();
  const events = useAppSelector(selectEvents);
  const unassignedEvents = useAppSelector(selectUnassignedEvents);
  const filters = useAppSelector(selectEventsFilters);
  const loading = useAppSelector(selectEventsLoading);
  const initialized = useAppSelector(selectEventsInitialized);

  console.log('events', events);
  console.log('unassignedEvents', unassignedEvents);

  const createUpdatedEvent = useCallback((event: any, oldEvent?: any): CalendarEvent => {
    const duration = oldEvent?.end ? moment(oldEvent.end).diff(moment(oldEvent.start), 'milliseconds') : 0;
    const newDuration = event?.end ? moment(event.end).diff(moment(event.start), 'milliseconds') : 0;

    let newStart = moment(event.start);
    let newEnd = moment(event.end || newStart.clone().add(duration, 'milliseconds'));

    const minTime = moment(`${newStart.format('YYYY-MM-DD')}T${defaultSlotMinTime}`);
    const maxTime = moment(`${newStart.format('YYYY-MM-DD')}T${defaultSlotMaxTime}`);

    if (newDuration === duration) {
      if (newStart.isBefore(minTime)) {
        newStart = minTime.clone();
        newEnd = minTime.clone().add(newDuration, 'milliseconds');
      }
      if (newEnd.isAfter(maxTime)) {
        newEnd = maxTime.clone();
        newStart = maxTime.clone().subtract(newDuration, 'milliseconds');
      }
    }

    return {
      id: event.id,
      title: event.title,
      start: newStart.format('YYYY-MM-DD HH:mm:ss'),
      end: newEnd.format('YYYY-MM-DD HH:mm:ss'),
      break: (event.extendedProps?.break || event?.break) ?? false,
      description: (event.extendedProps?.description || event?.description) ?? '',
      cardData: event?.extendedProps?.cardData || event?.cardData,
      allDay: event?.extendedProps?.allDay || event?.allDay,
    };
  }, []);

  const handleEventDrop = useCallback(
    (eventDropInfo: EventDropArg) => {
      const updatedEvent = createUpdatedEvent(eventDropInfo.event, eventDropInfo.oldEvent);
      dispatch(EventsActions.updateEvent(updatedEvent));
    },
    [dispatch, createUpdatedEvent],
  );

  const handleEventChange = useCallback(
    (updatedEvent: EventChangeArg) => {
      const updatedCalendarEvent = createUpdatedEvent(updatedEvent.event, updatedEvent.oldEvent);
      dispatch(EventsActions.updateEvent(updatedCalendarEvent));
    },
    [dispatch, createUpdatedEvent],
  );

  const handleEventRemove = useCallback(
    (eventId: string) => {
      dispatch(EventsActions.removeEvent(eventId));
    },
    [dispatch],
  );

  const handleEventAdd = useCallback(
    (newEvent: CalendarEvent) => {
      dispatch(EventsActions.addEvent(newEvent));
      dispatch(EventsActions.updateUnassignedEvents(newEvent?.id));
    },
    [dispatch],
  );

  const updateFilters = useCallback(
    (newFilters: Partial<EventsState['filters']>) => {
      dispatch(EventsActions.updateFilters(newFilters));
    },
    [dispatch],
  );

  useEffect(() => {
    if (!initialized) {
      dispatch(EventsActions.calendarInitialize());
    }
  }, [dispatch, initialized]);

  return {
    events,
    loading,
    filters,
    unassignedEvents,
    onEventDrop: handleEventDrop,
    onEventChange: handleEventChange,
    onEventRemove: handleEventRemove,
    onEventAdd: handleEventAdd,
    updateFilters,
  };
};
