import { RootState } from 'src/store';

export const selectShopState = (state: RootState) => state.shop;
export const selectShop = (state: RootState) => selectShopState(state).data;
export const selectShopLoading = (state: RootState) => selectShopState(state).loading;
export const selectShopError = (state: RootState) => selectShopState(state).error;
