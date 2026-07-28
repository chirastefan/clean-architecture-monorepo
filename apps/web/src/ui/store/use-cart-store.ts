import { create } from 'zustand';
import { type BudgetCart } from '@clean/cart';
import { dependencies, type Dependencies } from '../di-container';

export interface CartStoreState {
  cart: BudgetCart | null;
  loading: boolean;
  error: string | null;
  fetchCart: (cartId: string) => Promise<void>;
  addItem: (cartId: string, name: string, price: number, category: string) => Promise<void>;
  updateLimit: (cartId: string, newLimit: number) => Promise<void>;
  removeItem: (cartId: string, itemId: string) => Promise<void>;
}

export const createCartStore = (deps: Dependencies = dependencies) =>
  create<CartStoreState>((set) => ({
    cart: null,
    loading: false,
    error: null,

    fetchCart: async (cartId: string) => {
      set({ loading: true, error: null });
      const result = await deps.cartUseCase.execute(cartId);
      if (result.ok) {
        set({ cart: result.value, loading: false });
      } else {
        set({ error: result.error.message, loading: false });
      }
    },

    addItem: async (cartId: string, name: string, price: number, category: string) => {
      set({ loading: true, error: null });
      const result = await deps.addItemUseCase.execute(cartId, name, price, category);
      if (result.ok) {
        set({ cart: result.value, loading: false });
      } else {
        set({ error: result.error.message, loading: false });
      }
    },

    updateLimit: async (cartId: string, newLimit: number) => {
      set({ loading: true, error: null });
      const result = await deps.updateLimitUseCase.execute(cartId, newLimit);
      if (result.ok) {
        set({ cart: result.value, loading: false });
      } else {
        set({ error: result.error.message, loading: false });
      }
    },

    removeItem: async (cartId: string, itemId: string) => {
      set({ loading: true, error: null });
      const result = await deps.removeItemUseCase.execute(cartId, itemId);
      if (result.ok) {
        set({ cart: result.value, loading: false });
      } else {
        set({ error: result.error.message, loading: false });
      }
    },
  }));

export const useCartStore = createCartStore();
