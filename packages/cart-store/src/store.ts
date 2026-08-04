import { configureStore } from '@reduxjs/toolkit';
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { cartReducer } from './cart-slice';
import { type StoreDependencies } from './cart-thunks';

export const createCartReduxStore = (deps: StoreDependencies) =>
  configureStore({
    reducer: {
      cart: cartReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        thunk: {
          extraArgument: { deps },
        },
      }),
  });

export type CartReduxStore = ReturnType<typeof createCartReduxStore>;
export type CartRootState = ReturnType<CartReduxStore['getState']>;
export type CartAppDispatch = CartReduxStore['dispatch'];

export const useCartDispatch = () => useDispatch<CartAppDispatch>();
export const useCartSelector: TypedUseSelectorHook<CartRootState> = useSelector;
