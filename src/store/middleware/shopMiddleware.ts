import { createListenerMiddleware } from '@reduxjs/toolkit';

import { shopApi, ShopQuery } from 'src/api/shopApi';
import { Shop } from 'src/models';
import { dummyShop } from 'src/store/dummyData/dummyShop';

import { RootState } from '../index';
import { ShopActions } from '../slices/shopSlice';

const shopListenerMiddleware = createListenerMiddleware();

const createShop = async (listenerApi: any, data: any) => {
  const result = await listenerApi.dispatch(shopApi.endpoints.createShop.initiate(data));
  if ('data' in result) return result.data as Shop;
  throw result.error;
};

const updateShop = async (listenerApi: any, id: string, data: any) => {
  const result = await listenerApi.dispatch(shopApi.endpoints.updateShop.initiate({ id, data }));
  if ('data' in result) return result.data as Shop;
  throw result.error;
};

const getShopById = async (listenerApi: any, id: string, query?: ShopQuery) => {
  const result = await listenerApi.dispatch(shopApi.endpoints.getShopById.initiate({ id, query }));
  if ('data' in result) return result.data as Shop;
  throw result.error;
};

shopListenerMiddleware.startListening({
  actionCreator: ShopActions.fetchShopStart,
  effect: async (action, listenerApi) => {
    const payload = action.payload;
    const shopId = typeof payload === 'string' ? payload : payload.id;
    const query = typeof payload === 'string' ? undefined : payload.query;

    if (!shopId) {
      listenerApi.dispatch(ShopActions.fetchShopFailure('No Shop presented'));
      return;
    }

    try {
      const shop = await getShopById(listenerApi, shopId, query);
      listenerApi.dispatch(ShopActions.fetchShopSuccess(shop));
    } catch (error: any) {
      listenerApi.dispatch(ShopActions.fetchShopFailure(error.message || 'Failed to fetch shop data'));
    }
  },
});

shopListenerMiddleware.startListening({
  actionCreator: ShopActions.createShop,
  effect: async (action, listenerApi) => {
    try {
      const newShop = await createShop(listenerApi, action.payload);
      listenerApi.dispatch(ShopActions.createShopSuccess(newShop));
    } catch (error: any) {
      listenerApi.dispatch(ShopActions.createShopFailure(error.message || 'Failed to create shop'));
    }
  },
});

shopListenerMiddleware.startListening({
  actionCreator: ShopActions.updateShop,
  effect: async (action, listenerApi) => {
    try {
      const { id, data } = action.payload;
      const updatedShop = await updateShop(listenerApi, id, data);
      listenerApi.dispatch(ShopActions.updateShopSuccess(updatedShop));
    } catch (error: any) {
      listenerApi.dispatch(ShopActions.updateShopFailure(error.message || 'Failed to update shop'));
    }
  },
});

//  TODO: remove after BE updates
shopListenerMiddleware.startListening({
  actionCreator: ShopActions.fetchShopSuccess,
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    // eslint-disable-next-line no-console
    console.log('Shop loaded:', action.payload);
    // eslint-disable-next-line no-console
    console.log('Current state:', state.shop);
  },
});

shopListenerMiddleware.startListening({
  actionCreator: ShopActions.createShopSuccess,
  effect: async (action, listenerApi) => {
    // eslint-disable-next-line no-console
    console.log('Shop created successfully:', action.payload);
  },
});

export const { middleware: shopMiddleware } = shopListenerMiddleware;
