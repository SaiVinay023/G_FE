import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Shop } from 'src/models';

export interface ShopState {
  isSidebarOpen: boolean;
}

const initialState: ShopState = {
  isSidebarOpen: true,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    closeSidebar(state) {
      state.isSidebarOpen = false;
    },
    openSidebar(state) {
      state.isSidebarOpen = true;
    },
  },
});

export const ThemeActions = themeSlice.actions;
export const ThemeReducers = themeSlice.reducer;
