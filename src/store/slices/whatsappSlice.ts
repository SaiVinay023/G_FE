import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WhatsAppCredentials, UpdateWhatsAppCredentialsRequest } from '../../models/whatsapp';

export interface WhatsAppPendingAuth {
  code?: string;
  phoneNumberId?: string;
  wbaId?: string;
}

export interface WhatsAppState {
  credentials: WhatsAppCredentials | null;
  loading: boolean;
  updating: boolean;
  error: string | null;
  isConnected: boolean;
  pendingAuth: WhatsAppPendingAuth | null;
}

export const initialState: WhatsAppState = {
  credentials: null,
  loading: false,
  updating: false,
  error: null,
  isConnected: false,
  pendingAuth: null,
};

export const whatsappSlice = createSlice({
  name: 'whatsapp',
  initialState,
  reducers: {
    fetchCredentialsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchCredentialsSuccess(state, action: PayloadAction<WhatsAppCredentials>) {
      state.loading = false;
      state.credentials = action.payload;
      state.isConnected = action.payload.isRegistered;
    },
    fetchCredentialsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.isConnected = false;
    },
    updateCredentials(state, action: PayloadAction<UpdateWhatsAppCredentialsRequest>) {
      state.updating = true;
      state.error = null;
    },
    updateCredentialsSuccess(state, action: PayloadAction<WhatsAppCredentials>) {
      state.updating = false;
      state.credentials = action.payload;
      state.isConnected = action.payload.isRegistered;
      state.pendingAuth = null;
    },
    updateCredentialsFailure(state, action: PayloadAction<string>) {
      state.updating = false;
      state.error = action.payload;
    },
    setPendingAuthCode(state, action: PayloadAction<string>) {
      if (!state.pendingAuth) {
        state.pendingAuth = {};
      }
      state.pendingAuth.code = action.payload;
    },
    setPendingSignupData(state, action: PayloadAction<{ phoneNumberId: string; wbaId: string }>) {
      if (!state.pendingAuth) {
        state.pendingAuth = {};
      }
      state.pendingAuth.phoneNumberId = action.payload.phoneNumberId;
      state.pendingAuth.wbaId = action.payload.wbaId;
    },
    clearPendingAuth(state) {
      state.pendingAuth = null;
    },
    clearCredentials(state) {
      state.credentials = null;
      state.isConnected = false;
      state.error = null;
      state.pendingAuth = null;
    },
    clearError(state) {
      state.error = null;
    },
    setConnectionStatus(state, action: PayloadAction<boolean>) {
      state.isConnected = action.payload;
      if (state.credentials) {
        state.credentials.isRegistered = action.payload;
      }
    },
  },
});

export const WhatsAppActions = whatsappSlice.actions;
export const WhatsAppReducer = whatsappSlice.reducer;
