import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';

import { CalendarEvent } from 'src/models';

export interface EventsState {
  events: CalendarEvent[];
  unassignedEvents: CalendarEvent[];
  initialized: boolean;
  loading: boolean;
  error: string | null;
  filters: {
    startDate: string | null;
    endDate: string | null;
    period: 'day' | 'week' | 'month';
  };
}

const initialState: EventsState = {
  events: [],
  unassignedEvents: [],
  loading: false,
  initialized: false,
  error: null,
  filters: {
    startDate: null,
    endDate: null,
    period: 'week',
  },
};

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    calendarInitialize(state) {
      state.loading = true;
      state.error = null;
    },
    setEvents(state, action: PayloadAction<CalendarEvent[]>) {
      state.events = action.payload.map((event) => ({
        ...event,
        start: moment(event.start).format('YYYY-MM-DD HH:mm:ss'), // 👈 сохраняем ЧИСТОЕ время
        end: moment(event.end).format('YYYY-MM-DD HH:mm:ss'),
      }));
      state.loading = false;
      state.initialized = true;
    },
    setUnassignedEvents(state, action: PayloadAction<CalendarEvent[]>) {
      state.unassignedEvents = action.payload.map((event) => ({
        ...event,
        start: moment(event.start).format('YYYY-MM-DD HH:mm:ss'),
        end: moment(event.end).format('YYYY-MM-DD HH:mm:ss'),
      }));
    },
    updateUnassignedEvents(state, action: PayloadAction<string>) {
      state.unassignedEvents = state.unassignedEvents.filter((event) => event?.id !== action.payload);
    },
    addEvent(state, action: PayloadAction<CalendarEvent>) {
      state.events.push({
        ...action.payload,
        start: moment(action.payload.start).format('YYYY-MM-DD HH:mm:ss'),
        end: moment(action.payload.end).format('YYYY-MM-DD HH:mm:ss'),
      });
    },
    updateEvent(state, action: PayloadAction<CalendarEvent>) {
      state.events = state.events.map((event) =>
        event.id === action.payload.id
          ? {
              ...action.payload,
              start: moment(action.payload.start).format('YYYY-MM-DD HH:mm:ss'),
              end: moment(action.payload.end).format('YYYY-MM-DD HH:mm:ss'),
            }
          : event,
      );
    },
    removeEvent(state, action: PayloadAction<string>) {
      state.events = state.events.filter((event) => event.id !== action.payload);
    },
    updateFilters(state, action: PayloadAction<Partial<EventsState['filters']>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
});

export const EventsActions = eventsSlice.actions;
export const EventsReducer = eventsSlice.reducer;
