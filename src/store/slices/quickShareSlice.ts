// src/store/slices/quickShareSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sending: false,
  error: null as string | null,
};

export const quickShareSlice = createSlice({
  name: 'quickShare',
  initialState,
  reducers: {
    sendQuickShareStart: state => { state.sending = true; state.error = null; },
    sendQuickShareSuccess: state => { state.sending = false; },
    sendQuickShareFailure: (state, action) => {
      state.sending = false;
      state.error = action.payload || 'Unknown error';
    },
  }
});

export const QuickShareActions = quickShareSlice.actions;
export default quickShareSlice.reducer;
