import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  sender: boolean;
  text: string;
  timestamp: string;
  read?: boolean;
}

export interface MessagesState {
  currentUserId: string | null;
  messages: {
    [userId: string]: Message[];
  };
}

const initialState: MessagesState = {
  currentUserId: null,
  messages: {},
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages(state, action: PayloadAction<{ userId: string; messages: Message[] }>) {
      state.messages[action.payload.userId] = action.payload.messages;
    },
    setCurrentUserId(state, action: PayloadAction<string | null>) {
      state.currentUserId = action.payload;

      if (!action.payload) {
        state.messages = {};
      }
    },
  },
});

export const MessagesActions = messagesSlice.actions;
export const { setMessages, setCurrentUserId } = messagesSlice.actions;
export const MessagesReducer = messagesSlice.reducer;
