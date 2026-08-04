import { createSlice } from '@reduxjs/toolkit';
import { type BudgetCart } from '@clean/cart';
import { addItemThunk, fetchCartThunk, removeItemThunk, updateLimitThunk } from './cart-thunks';

export type CartState = {
  cart: BudgetCart | null;
  loading: boolean;
  errorMessage: string | null;
};

const initialState: CartState = {
  cart: null,
  loading: false,
  errorMessage: null,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCartThunk.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(fetchCartThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = (action.payload as string) || 'Failed to fetch cart';
      })
      // Add Item
      .addCase(addItemThunk.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(addItemThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(addItemThunk.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = (action.payload as string) || 'Failed to add item';
      })
      // Update Limit
      .addCase(updateLimitThunk.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(updateLimitThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(updateLimitThunk.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = (action.payload as string) || 'Failed to update limit';
      })
      // Remove Item
      .addCase(removeItemThunk.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(removeItemThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(removeItemThunk.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = (action.payload as string) || 'Failed to remove item';
      });
  },
});

export const cartReducer = cartSlice.reducer;
