import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import { shopApi } from 'src/api/shopApi';
import { Shop } from 'src/models';
import { AppDispatch } from 'src/store';
import { selectShop, selectShopError, selectShopLoading } from 'src/store/selectors/shopSelectors';
import { ShopActions } from 'src/store/slices/shopSlice';
import { formatPhoneNumber } from 'src/utils/formatPhoneNumber';
import { useUser } from './useUser';

type UseShopContext = {
  shop?: Shop;
  loading: boolean;
  error: string | null;
  createShop: (shopData: Shop) => Promise<Shop>;
  updateShop: (id: string, shopData: Partial<Shop>) => Promise<Shop>;
  refetch: () => void;
};

export const useShop = (): UseShopContext => {
  const dispatch = useDispatch<AppDispatch>();
  const shop = useSelector(selectShop);
  const loading = useSelector(selectShopLoading);
  const error = useSelector(selectShopError);
  const { user, shopId } = useUser();

  const fetchShop = useCallback(
    async (id: string) => {
      try {
        dispatch(ShopActions.fetchShopStart(id));
        const result = await dispatch(
          shopApi.endpoints.getShopById.initiate(
            { id },
            {
              forceRefetch: true,
            },
          ),
        );

        if ('data' in result && result.data) {
          dispatch(ShopActions.fetchShopSuccess(result.data));
        } else if ('error' in result) {
          dispatch(ShopActions.fetchShopFailure('Failed to fetch shop'));
        }
      } catch (error: any) {
        dispatch(ShopActions.fetchShopFailure(error.message || 'Failed to fetch shop'));
      }
    },
    [dispatch],
  );

  const refetch = useCallback(() => {
    if (shopId) {
      fetchShop(shopId);
    }
  }, [fetchShop, shopId]);

  const createShop = useCallback(
    async (shopData: Shop): Promise<Shop> => {
      try {
        const result = await dispatch(shopApi.endpoints.createShop.initiate(shopData));

        if ('data' in result) {
          const createdShop = result.data as Shop;
          dispatch(ShopActions.createShopSuccess(createdShop));
          toast.success('Shop created successfully!');
          return createdShop;
        }

        throw new Error('Failed to create shop');
      } catch (error: any) {
        dispatch(ShopActions.createShopFailure(error.message || 'Failed to create shop'));
        toast.error(`Failed to create shop: ${error.message || 'Unknown error'}`);
        throw error;
      }
    },
    [dispatch],
  );

  const updateShop = useCallback(
    async (id: string, shopData: Partial<Shop>): Promise<Shop> => {
      try {
        dispatch(ShopActions.updateShop({ id, data: shopData }));

        const toastId = toast.loading('Updating shop information...');

        const result = await dispatch(shopApi.endpoints.updateShop.initiate({ id, data: shopData }));

        if ('data' in result) {
          if (shop) {
            const updatedShop = { ...shop, ...shopData };

            if (updatedShop.contact) {
              updatedShop.contact = {
                ...updatedShop.contact,
                phone: updatedShop.contact.phone
                  ? updatedShop.contact.phone.trim().startsWith('+')
                    ? updatedShop.contact.phone.trim()
                    : (formatPhoneNumber(updatedShop.contact.phone.trim()) as string)
                  : updatedShop.contact.phone,
              };
            }

            dispatch(ShopActions.updateShopSuccess(updatedShop as Shop));

            toast.success('Shop updated successfully!', { id: toastId });
            return updatedShop as Shop;
          }
          return result.data as Shop;
        } else if ('error' in result) {
          toast.error(`Failed to update shop: ${result.error}`, { id: toastId });
          throw result.error;
        }
        throw new Error('Failed to update shop');
      } catch (error: any) {
        dispatch(ShopActions.updateShopFailure(error.message || 'Failed to update shop'));
        toast.error(`Failed to update shop: ${error.message || 'Unknown error'}`);
        throw error;
      }
    },
    [dispatch, shop],
  );

  useEffect(() => {
    if (shopId && !shop && !loading) {
      fetchShop(shopId);
    }
  }, [shopId, shop, loading, fetchShop]);

  return { shop, loading, error, createShop, updateShop, refetch };
};
