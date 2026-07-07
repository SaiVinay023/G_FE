import { createListenerMiddleware } from '@reduxjs/toolkit';

import { dummyMessages } from 'src/store/dummyData/dummyData';

import { MessagesActions } from '../slices/messagesSlice';

const chatMiddleware = createListenerMiddleware();

chatMiddleware.startListening({
  actionCreator: MessagesActions.setCurrentUserId,
  effect: async (action, listenerApi) => {
    const userId = action.payload;

    if (!userId) return;

    const messages = dummyMessages(userId);
    listenerApi.dispatch(MessagesActions.setMessages({ userId, messages }));
  },
});

export const { middleware: chatActionsMiddleware } = chatMiddleware;
