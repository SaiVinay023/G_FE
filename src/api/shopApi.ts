import { CreateShop, Shop } from 'src/models';

export interface ShopQuery {
  contact?: boolean;
  address?: boolean;
  vat?: boolean;
}

export interface CreateShopPayload extends CreateShop {
  firstName: string;
  lastName: string;
  weeklySchedule: Array<{
    day: number;
    start: string;
    finish: string;
    dayOff: boolean;
    breakFrom: string;
    breakTo: string;
  }>;
}

export const cleanShopData = (shopData: Partial<Shop>): Partial<Shop> => {
  const cleanData = { ...shopData };

  const fieldsToRemove = ['id', 'contactId', 'addressId', 'createdAt', 'updatedAt', 'vat'];
  fieldsToRemove.forEach((field) => delete cleanData[field]);

  if (cleanData.contact) {
    const contact = { ...cleanData.contact };
    delete contact.id;
    delete contact.createdAt;
    delete contact.updatedAt;

    cleanData.contact = contact;
  }

  if (cleanData.address) {
    const address = { ...cleanData.address };
    delete address.id;
    delete address.createdAt;
    delete address.updatedAt;

    cleanData.address = address;
  }

  return cleanData;
};

import { baseApi } from './baseApi';

export const shopApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getShopById: build.query<Shop, { id: string; query?: ShopQuery }>({
      query: ({ id, query }) => {
        const params = new URLSearchParams();

        if (query?.contact !== undefined) {
          params.append('contact', String(query.contact));
        }
        if (query?.address !== undefined) {
          params.append('address', String(query.address));
        }
        if (query?.vat !== undefined) {
          params.append('vat', String(query.vat));
        }

        const queryString = params.toString();
        return queryString ? `/api/shop/${id}?${queryString}` : `/api/shop/${id}`;
      },
    }),
    createShop: build.mutation<Shop, CreateShopPayload>({
      query: (newShop) => ({
        url: '/api/shop/create',
        method: 'POST',
        body: newShop,
      }),
      invalidatesTags: ['Shop'],
    }),
    updateShop: build.mutation<Shop, { id: string; data: Partial<Shop> }>({
      query: ({ id, data }) => {
        const cleanedData = cleanShopData(data);

        return {
          url: `/api/shop/update/${id}`,
          method: 'PUT',
          body: cleanedData,
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Shop', id }],
    }),
  }),
});

export const { useGetShopByIdQuery, useCreateShopMutation, useUpdateShopMutation } = shopApi;
