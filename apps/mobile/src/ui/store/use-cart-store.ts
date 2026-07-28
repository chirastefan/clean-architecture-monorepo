import { create } from 'zustand';
import { type BudgetCart } from '@clean/cart';
import { createMobileDependencies, type MobileDependencies } from '../di-container';

export interface CartStoreState {
  cart: BudgetCart | null;
  loading: boolean;
  errorMessage: string | null;
  loadCart: (cartId: string) => Promise<void>;
  addItem: (cartId: string, name: string, price: number, category: string) => Promise<boolean>;
  updateLimit: (cartId: string, newLimit: number) => Promise<boolean>;
  removeItem: (cartId: string, itemId: string) => Promise<void>;
}

export const createCartStore = (deps: MobileDependencies = createMobileDependencies()) =>
  create<CartStoreState>((set) => ({
    cart: null,
    loading: false,
    errorMessage: null,

    loadCart: async (cartId: string) => {
      set({ loading: true, errorMessage: null });
      const result = await deps.cartUseCase.execute(cartId);
      if (result.ok) {
        set({ cart: result.value, loading: false });
      } else {
        set({ errorMessage: result.error.message, loading: false });
      }
    },

    addItem: async (cartId: string, name: string, price: number, category: string) => {
      set({ loading: true, errorMessage: null });
      const result = await deps.addItemUseCase.execute(cartId, name, price, category);
      if (result.ok) {
        set({ cart: result.value, loading: false });
        return true;
      } else {
        set({ errorMessage: result.error.message, loading: false });
        return false;
      }
    },

    updateLimit: async (cartId: string, newLimit: number) => {
      set({ loading: true, errorMessage: null });
      const result = await deps.updateLimitUseCase.execute(cartId, newLimit);
      if (result.ok) {
        set({ cart: result.value, loading: false });
        return true;
      } else {
        set({ errorMessage: result.error.message, loading: false });
        return false;
      }
    },

    removeItem: async (cartId: string, itemId: string) => {
      set({ loading: true, errorMessage: null });
      const result = await deps.removeItemUseCase.execute(cartId, itemId);
      if (result.ok) {
        set({ cart: result.value, loading: false });
      } else {
        set({ errorMessage: result.error.message, loading: false });
      }
    },
  }));

export const useCartStore = createCartStore();
