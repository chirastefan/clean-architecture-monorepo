import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { type CartDTO } from './dtos/cart-dto';

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  }),
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    getCartById: builder.query<CartDTO, string>({
      query: (id) => `/api/carts/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Cart', id }],
    }),
    updateCart: builder.mutation<CartDTO, CartDTO>({
      query: (cart) => ({
        url: `/api/carts/${cart.id}`,
        method: 'PUT',
        body: cart,
      }),
      invalidatesTags: (_result, _error, cart) => [{ type: 'Cart', id: cart.id }],
    }),
  }),
});
