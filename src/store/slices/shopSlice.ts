import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CreateShop, Shop } from 'src/models';
import { ShopQuery } from 'src/api/shopApi';

export interface ShopState {
  data?: Shop;
  loading: boolean;
  error: string | null;
}

export type FetchShopStartPayload = string | { id: string; query?: ShopQuery };

const initialState: ShopState = {
  data: {
    id: undefined,
    name: '',
    vatNumber: '',
    contact: {
      email: '',
      phone: '',
    },
    address: {
      id: undefined,
      addressLine1: '',
      addressLine2: null,
      zipcode: '',
      city: '',
      country: '',
    },
    logo: '',
    enabled: true,
    hourlyRate: 0,
    vatId: '',
    language: undefined,
    workSchedules: undefined,
    // whatsappPhoneNumberId: null,
    // whatsappAccessToken: null,
    // whatsappWabaId: null,
    // isWhatsappRegistered: false,
  },
  loading: false,
  error: null,
};

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    fetchShopStart(state, action: PayloadAction<FetchShopStartPayload>) {
      state.loading = true;
      state.error = null;
    },
    fetchShopSuccess(state, action: PayloadAction<Shop>) {
      state.loading = false;
      state.data = action.payload;
    },
    fetchShopFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    createShop(state, action: PayloadAction<CreateShop>) {
      state.loading = true;
      state.error = null;
    },
    createShopSuccess(state, action: PayloadAction<Shop>) {
      state.loading = false;
      state.data = action.payload;
    },
    createShopFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    updateShop(state, action: PayloadAction<{ id: string; data: Partial<Shop> }>) {
      state.loading = true;
      state.error = null;
    },
    updateShopSuccess(state, action: PayloadAction<Shop>) {
      state.loading = false;
      state.data = action.payload;
    },
    updateShopFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const ShopActions = shopSlice.actions;
export const ShopReducers = shopSlice.reducer;
