import { RootState } from 'src/store';

export const selectMessagesState = (state: RootState) => state.messages;
export const selectMessages = (state: RootState) => selectMessagesState(state).messages;
export const selectCurrentUserId = (state: RootState) => selectMessagesState(state).currentUserId;
