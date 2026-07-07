// src/store/middleware/quickShareMiddleware.ts

import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { quickShareApi } from 'src/api/quickShareApi';
import { RootState } from 'src/store';
import { QuickShareActions } from 'src/store/slices/quickShareSlice';

const quickShareListenerMiddleware = createListenerMiddleware();

const sendQuickShareEmail = async (
  listenerApi: any,
  payload: { email: string; subject: string; message: string; phone?: string }
) => {
  const result = await listenerApi.dispatch(
    quickShareApi.endpoints.sendQuickShareEmail.initiate(payload)
  );

  if ('data' in result) return result.data;
  throw result.error;
};

quickShareListenerMiddleware.startListening({
  matcher: isAnyOf(QuickShareActions.sendQuickShareStart),
  effect: async (action, listenerApi) => {
    try {
      const { email, subject, message } = action.payload;
      await sendQuickShareEmail(listenerApi, { email, subject, message });
      listenerApi.dispatch(QuickShareActions.sendQuickShareSuccess());
    } catch (error) {
      listenerApi.dispatch(
        QuickShareActions.sendQuickShareFailure('Failed to send quick share')
      );
    }
  },
});

export const { middleware: quickShareMiddleware } = quickShareListenerMiddleware;
