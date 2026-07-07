import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { User } from 'src/models';

export interface UserState {
  data?: User | null;
  shopId?: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  data: null,
  shopId: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    createUser: (state, action: PayloadAction<User>) => {
      state.loading = true;
      state.error = null;
    },
    createUserSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
    createUserFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateUser: (state, action: PayloadAction<{ id: string; data: Partial<User> }>) => {
      state.loading = true;
      state.error = null;
    },
    updateUserSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
    updateUserFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess: (state) => {
      state.loading = false;
      state.data = null;
      state.error = null;
    },
    deleteUserFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchUserByClerkId: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    fetchUserByClerkIdSuccess: (state, action: PayloadAction<User & { shopId?: string }>) => {
      state.loading = false;
      state.data = action.payload;
      state.shopId = action.payload.shopId || null;
      state.error = null;
    },
    fetchUserByClerkIdFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { reducer: UserReducer, actions: UserActions } = userSlice;
