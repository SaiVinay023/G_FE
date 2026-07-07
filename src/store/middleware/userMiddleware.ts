import { RootState } from '../index';

export const selectUser = (state: RootState) => state.user.data;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) => state.user.error;
export const selectUserShopId = (state: RootState) => state.user.shopId;
import { createListenerMiddleware } from '@reduxjs/toolkit';

import { userApi } from 'src/api/userApi';
import { User } from 'src/models';
import { RootState } from '../index';
import { UserActions } from '../slices/userSlice';
import { ShopActions } from '../slices/shopSlice';

const userListenerMiddleware = createListenerMiddleware();

const createUser = async (listenerApi: any, data: any) => {
  const result = await listenerApi.dispatch(userApi.endpoints.createUser.initiate(data));
  if ('data' in result) return result.data as User;
  throw result.error;
};

const updateUser = async (listenerApi: any, id: string, data: any) => {
  const result = await listenerApi.dispatch(userApi.endpoints.updateUser.initiate({ id, data }));
  if ('data' in result) return result.data as User;
  throw result.error;
};

const deleteUser = async (listenerApi: any, id: string) => {
  const result = await listenerApi.dispatch(userApi.endpoints.deleteUser.initiate(id));
  if ('error' in result) throw result.error;
};

const fetchUserByClerkId = async (listenerApi: any, clerkUserId: string) => {
  const result = await listenerApi.dispatch(
    userApi.endpoints.getUserByClerkUserId.initiate({
      clerkUserId,
      query: { shop: true, address: true, contact: true },
    }),
  );
  if ('data' in result) return result.data;
  throw result.error;
};

userListenerMiddleware.startListening({
  actionCreator: UserActions.createUser,
  effect: async (action, listenerApi) => {
    try {
      const newUser = await createUser(listenerApi, action.payload);
      listenerApi.dispatch(UserActions.createUserSuccess(newUser));
    } catch (error: any) {
      listenerApi.dispatch(UserActions.createUserFailure(error.message || 'Failed to create user'));
    }
  },
});

userListenerMiddleware.startListening({
  actionCreator: UserActions.updateUser,
  effect: async (action, listenerApi) => {
    try {
      const { id, data } = action.payload;
      const updatedUser = await updateUser(listenerApi, id, data);
      listenerApi.dispatch(UserActions.updateUserSuccess(updatedUser));
    } catch (error: any) {
      listenerApi.dispatch(UserActions.updateUserFailure(error.message || 'Failed to update user'));
    }
  },
});

userListenerMiddleware.startListening({
  actionCreator: UserActions.deleteUser,
  effect: async (action, listenerApi) => {
    try {
      const id = action.payload;
      await deleteUser(listenerApi, id);
      listenerApi.dispatch(UserActions.deleteUserSuccess());
    } catch (error: any) {
      listenerApi.dispatch(UserActions.deleteUserFailure(error.message || 'Failed to delete user'));
    }
  },
});

userListenerMiddleware.startListening({
  actionCreator: UserActions.fetchUserByClerkId,
  effect: async (action, listenerApi) => {
    try {
      const userData = await fetchUserByClerkId(listenerApi, action.payload);
      listenerApi.dispatch(UserActions.fetchUserByClerkIdSuccess(userData));

      // If user has shop data, populate it with address and contact before dispatching
      if (userData.shop && userData.address && userData.contact) {
        const populatedShop = {
          ...userData.shop,
          address: userData.address,
          contact: userData.contact,
        };
        listenerApi.dispatch(ShopActions.fetchShopSuccess(populatedShop));
      } else if (userData.shop) {
        // Fallback: dispatch shop data as-is if address/contact are missing
        listenerApi.dispatch(ShopActions.fetchShopSuccess(userData.shop));
      }
    } catch (error: any) {
      listenerApi.dispatch(UserActions.fetchUserByClerkIdFailure(error.message || 'Failed to fetch user'));
    }
  },
});

export const { middleware: userMiddleware } = userListenerMiddleware;
