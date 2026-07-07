import { RootState } from 'src/store';

export const selectEventsState = (state: RootState) => state.events;
export const selectEvents = (state: RootState) => selectEventsState(state).events;
export const selectUnassignedEvents = (state: RootState) => selectEventsState(state).unassignedEvents;
export const selectEventsFilters = (state: RootState) => selectEventsState(state).filters;
export const selectEventsLoading = (state: RootState) => selectEventsState(state).loading;
export const selectEventsInitialized = (state: RootState) => selectEventsState(state).initialized;
export const selectEventsError = (state: RootState) => selectEventsState(state).error;
