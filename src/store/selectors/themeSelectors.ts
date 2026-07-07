import { RootState } from 'src/store';

export const selectTheme = (state: RootState) => state.theme;
export const isOpenSidebarSelect = (state: RootState) => selectTheme(state).isSidebarOpen;
