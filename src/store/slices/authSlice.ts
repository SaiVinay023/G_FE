import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  tokenExpiry: number | null; // Token expiration timestamp
  refreshing: boolean; // Whether we're currently refreshing the token
  lastRefresh: number | null; // Last successful token refresh timestamp
  error: string | null; // Auth error message
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  isLoading: true,
  tokenExpiry: null,
  refreshing: false,
  lastRefresh: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<{ token: string | null; expiry?: number }>) => {
      const { token, expiry } = action.payload;
      state.token = token;
      state.isAuthenticated = !!token;
      state.isLoading = false;
      state.refreshing = false;
      state.error = null;
      state.lastRefresh = Date.now();

      // Set expiry time (default to 50 minutes from now if not provided)
      state.tokenExpiry = expiry || (token ? Date.now() + 50 * 60 * 1000 : null);
    },
    clearToken: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.refreshing = false;
      state.tokenExpiry = null;
      state.lastRefresh = null;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.refreshing = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
      state.refreshing = false;
    },
    // Action to check if token needs refresh
    checkTokenExpiry: (state) => {
      if (state.tokenExpiry && Date.now() > state.tokenExpiry - 5 * 60 * 1000) {
        // Token expires in less than 5 minutes, mark for refresh
        state.refreshing = true;
      }
    },
  },
});

export const { setToken, clearToken, setLoading, setRefreshing, setError, checkTokenExpiry } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectAuthToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthRefreshing = (state: { auth: AuthState }) => state.auth.refreshing;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectTokenExpiry = (state: { auth: AuthState }) => state.auth.tokenExpiry;
export const selectLastRefresh = (state: { auth: AuthState }) => state.auth.lastRefresh;

// Computed selectors
export const selectIsTokenExpired = (state: { auth: AuthState }) => {
  const { tokenExpiry } = state.auth;
  return tokenExpiry ? Date.now() > tokenExpiry : false;
};

export const selectIsTokenExpiringSoon = (state: { auth: AuthState }) => {
  const { tokenExpiry } = state.auth;
  return tokenExpiry ? Date.now() > tokenExpiry - 5 * 60 * 1000 : false;
};
