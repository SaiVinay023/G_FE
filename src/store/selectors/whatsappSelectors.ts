import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

export const selectWhatsAppState = (state: RootState) => state.whatsapp;
export const selectWhatsAppCredentials = (state: RootState) => selectWhatsAppState(state).credentials;
export const selectWhatsAppLoading = (state: RootState) => selectWhatsAppState(state).loading;
export const selectWhatsAppUpdating = (state: RootState) => selectWhatsAppState(state).updating;
export const selectWhatsAppError = (state: RootState) => selectWhatsAppState(state).error;
export const selectWhatsAppConnectionStatus = (state: RootState) => selectWhatsAppState(state).isConnected;
export const selectWhatsAppPendingAuth = (state: RootState) => selectWhatsAppState(state).pendingAuth;

export const selectWhatsAppPhoneNumberId = createSelector(
  selectWhatsAppCredentials,
  (credentials) => credentials?.phoneNumberId,
);

export const selectWhatsAppWabaId = createSelector(selectWhatsAppCredentials, (credentials) => credentials?.wbaId);

export const selectWhatsAppShopId = createSelector(selectWhatsAppCredentials, (credentials) => credentials?.shopId);

export const selectIsWhatsAppRegistered = createSelector(
  selectWhatsAppCredentials,
  (credentials) => credentials?.isRegistered ?? false,
);

export const selectWhatsAppCredentialsId = createSelector(selectWhatsAppCredentials, (credentials) => credentials?.id);

export const selectCanCompleteWhatsAppSetup = createSelector(selectWhatsAppPendingAuth, (pendingAuth) => {
  return !!(pendingAuth?.code && pendingAuth?.phoneNumberId && pendingAuth?.wbaId);
});
