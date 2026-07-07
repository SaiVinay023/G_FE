import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

import { whatsappApi } from 'src/api/whatsappApi';
import { RootState } from '../index';
import { WhatsAppActions } from '../slices/whatsappSlice';
import { UserActions } from '../slices/userSlice';
import { UpdateWhatsAppCredentialsRequest } from '../../models/whatsapp';
import { selectCanCompleteWhatsAppSetup, selectWhatsAppPendingAuth } from '../selectors/whatsappSelectors';

const whatsappListenerMiddleware = createListenerMiddleware();

const fetchWhatsAppCredentials = async (listenerApi: any) => {
  const result = await listenerApi.dispatch(whatsappApi.endpoints.getWhatsAppCredentials.initiate());

  if ('data' in result) {
    return result.data;
  }

  throw result.error;
};

const updateWhatsAppCredentials = async (listenerApi: any, data: UpdateWhatsAppCredentialsRequest) => {
  const result = await listenerApi.dispatch(whatsappApi.endpoints.updateWhatsAppCredentials.initiate(data));

  if ('data' in result) {
    return result.data;
  }

  throw result.error;
};

whatsappListenerMiddleware.startListening({
  actionCreator: WhatsAppActions.fetchCredentialsStart,
  effect: async (_, listenerApi) => {
    try {
      const credentials = await fetchWhatsAppCredentials(listenerApi);
      listenerApi.dispatch(WhatsAppActions.fetchCredentialsSuccess(credentials));
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to fetch WhatsApp credentials';
      listenerApi.dispatch(WhatsAppActions.fetchCredentialsFailure(errorMessage));
    }
  },
});

whatsappListenerMiddleware.startListening({
  actionCreator: WhatsAppActions.updateCredentials,
  effect: async (action, listenerApi) => {
    try {
      const updatedCredentials = await updateWhatsAppCredentials(listenerApi, action.payload);
      listenerApi.dispatch(WhatsAppActions.updateCredentialsSuccess(updatedCredentials));
      toast.success('WhatsApp credentials updated successfully');
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to update WhatsApp credentials';
      listenerApi.dispatch(WhatsAppActions.updateCredentialsFailure(errorMessage));
      toast.error(errorMessage);
    }
  },
});

whatsappListenerMiddleware.startListening({
  matcher: isAnyOf(WhatsAppActions.setPendingAuthCode, WhatsAppActions.setPendingSignupData),
  effect: async (_, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const canComplete = selectCanCompleteWhatsAppSetup(state);

    if (canComplete) {
      const pendingAuth = selectWhatsAppPendingAuth(state);

      if (pendingAuth?.code && pendingAuth?.phoneNumberId && pendingAuth?.wbaId) {
        const updateData: UpdateWhatsAppCredentialsRequest = {
          phoneNumberId: pendingAuth.phoneNumberId,
          wbaId: pendingAuth.wbaId,
          accessToken: pendingAuth.code,
        };

        listenerApi.dispatch(WhatsAppActions.updateCredentials(updateData));
      }
    }
  },
});

whatsappListenerMiddleware.startListening({
  matcher: isAnyOf(UserActions.fetchUserByClerkIdSuccess, UserActions.createUserSuccess, UserActions.updateUserSuccess),
  effect: async (action, listenerApi) => {
    const user = action.payload as any;
    const state = listenerApi.getState() as RootState;

    if (user?.shopId && !state.whatsapp.credentials) {
      listenerApi.dispatch(WhatsAppActions.fetchCredentialsStart());
    }
  },
});

export const { middleware: whatsappMiddleware } = whatsappListenerMiddleware;
