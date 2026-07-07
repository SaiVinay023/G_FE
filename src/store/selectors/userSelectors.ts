import { RootState } from '../index';

export const selectUser = (state: RootState) => state.user.data;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) => state.user.error;
export const selectUserShopId = (state: RootState) => state.user.shopId;
