import { configureStore } from '@reduxjs/toolkit';
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { cartReducer } from './cart-slice';
import { type StoreDependencies } from './cart-thunks';

export type StoreOptions = {
  deps: StoreDependencies;
  extraReducers?: Record<string, any>;
  extraMiddleware?: any[];
};

export const createCartReduxStore = ({
  deps,
  extraReducers = {},
  extraMiddleware = [],
}: StoreOptions) =>
  configureStore({
    reducer: {
      cart: cartReducer,
      ...extraReducers,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        thunk: {
          extraArgument: { deps },
        },
      }).concat(extraMiddleware),
  });

export type CartReduxStore = ReturnType<typeof createCartReduxStore>;
export type CartRootState = ReturnType<CartReduxStore['getState']>;
export type CartAppDispatch = CartReduxStore['dispatch'];

export const useCartDispatch = () => useDispatch<CartAppDispatch>();
export const useCartSelector: TypedUseSelectorHook<CartRootState> = useSelector;
