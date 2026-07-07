import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { appointmentApi } from 'src/api/appointmentApi';

interface Customer {
  id?: string;
  name: string;
  phone: string;
  email: string;
  licensePlate?: string;
}

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  extendedProps?: {
    customer: Customer;
    comments?: string;
  };
}

interface AppointmentState {
  events: Event[];
  unassignedEvents: Event[];
  loading: boolean;
  appointmentModalOpen: boolean;
  selectedEventId?: string;
  draftCustomer?: Customer; // new
}

const initialState: AppointmentState = {
  events: [],
  unassignedEvents: [],
  loading: false,
  appointmentModalOpen: false,
};

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    addEvent(state, action: PayloadAction<Event>) {
      state.events.push(action.payload);
    },
    removeEvent(state, action: PayloadAction<string>) {
      state.events = state.events.filter(e => e.id !== action.payload);
    },
    updateEvent(state, action: PayloadAction<Event>) {
      const idx = state.events.findIndex(e => e.id === action.payload.id);
      if (idx >= 0) state.events[idx] = action.payload;
    },
    setUnassignedEvents(state, action: PayloadAction<Event[]>) {
      state.unassignedEvents = action.payload;
    },
    openAppointmentModal(state, action: PayloadAction<Customer | undefined>) {
      state.appointmentModalOpen = true;
      state.draftCustomer = action.payload; // seed modal
    },
    closeAppointmentModal(state) {
      state.appointmentModalOpen = false;
      state.draftCustomer = undefined;
      state.selectedEventId = undefined;
    },
    setSelectedEventId(state, action: PayloadAction<string | undefined>) {
      state.selectedEventId = action.payload;
    },
    setDraftCustomer(state, action: PayloadAction<Customer | undefined>) {
      state.draftCustomer = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(appointmentApi.endpoints.fetchEvents.matchPending, (state) => {
        state.loading = true;
      })
      .addMatcher(appointmentApi.endpoints.fetchEvents.matchFulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.map((evt) => ({
          ...evt,
          start: new Date(evt.start),
          end: new Date(evt.end),
        }));
      })
      .addMatcher(appointmentApi.endpoints.fetchEvents.matchRejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  setLoading,
  addEvent,
  removeEvent,
  updateEvent,
  setUnassignedEvents,
  openAppointmentModal,
  closeAppointmentModal,
  setSelectedEventId,
  setDraftCustomer,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
