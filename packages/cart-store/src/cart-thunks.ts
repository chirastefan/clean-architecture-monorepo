import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  AddItemUseCase,
  CartUseCase,
  RemoveItemUseCase,
  UpdateLimitUseCase,
  type BudgetCart,
} from '@clean/cart';

export type StoreDependencies = {
  cartUseCase: CartUseCase;
  addItemUseCase: AddItemUseCase;
  updateLimitUseCase: UpdateLimitUseCase;
  removeItemUseCase: RemoveItemUseCase;
};

export const fetchCartThunk = createAsyncThunk<
  BudgetCart,
  string,
  { extra: { deps: StoreDependencies } }
>('cart/fetchCart', async (cartId, { extra, rejectWithValue }) => {
  const result = await extra.deps.cartUseCase.execute(cartId);
  if (result.ok) {
    return result.value;
  }
  return rejectWithValue(result.error.message);
});

export const addItemThunk = createAsyncThunk<
  BudgetCart,
  { cartId: string; name: string; price: number; category: string },
  { extra: { deps: StoreDependencies } }
>('cart/addItem', async (payload, { extra, rejectWithValue }) => {
  const result = await extra.deps.addItemUseCase.execute(
    payload.cartId,
    payload.name,
    payload.price,
    payload.category
  );
  if (result.ok) {
    return result.value;
  }
  return rejectWithValue(result.error.message);
});

export const updateLimitThunk = createAsyncThunk<
  BudgetCart,
  { cartId: string; newLimit: number },
  { extra: { deps: StoreDependencies } }
>('cart/updateLimit', async (payload, { extra, rejectWithValue }) => {
  const result = await extra.deps.updateLimitUseCase.execute(payload.cartId, payload.newLimit);
  if (result.ok) {
    return result.value;
  }
  return rejectWithValue(result.error.message);
});

export const removeItemThunk = createAsyncThunk<
  BudgetCart,
  { cartId: string; itemId: string },
  { extra: { deps: StoreDependencies } }
>('cart/removeItem', async (payload, { extra, rejectWithValue }) => {
  const result = await extra.deps.removeItemUseCase.execute(payload.cartId, payload.itemId);
  if (result.ok) {
    return result.value;
  }
  return rejectWithValue(result.error.message);
});
