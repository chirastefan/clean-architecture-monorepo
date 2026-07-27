import { create } from 'zustand';
import { type BudgetCart } from '@clean/cart';
import { dependencies, type Dependencies } from '../CompositionRoot';

export interface CartStoreState {
  cart: BudgetCart | null;
  loading: boolean;
  error: string | null;
  fetchCart: (cartId?: string) => Promise<void>;
  addItem: (name: string, price: number, category: string) => Promise<void>;
  updateLimit: (limit: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearError: () => void;
}

export const createCartStore = (deps: Dependencies = dependencies) =>
  create<CartStoreState>((set, get) => ({
    cart: null,
    loading: false,
    error: null,

    fetchCart: async (cartId = 'default-planner') => {
      set({ loading: true, error: null });
      const result = await deps.cartUseCase.execute(cartId);

      if (result.ok) {
        set({ cart: result.value, loading: false });
      } else {
        set({ error: result.error.message, loading: false });
      }
    },

    addItem: async (name, price, category) => {
      const currentCartId = get().cart?.id ?? 'default-planner';
      set({ loading: true, error: null });

      const result = await deps.addItemUseCase.execute(currentCartId, name, price, category);

      if (result.ok) {
        set({ cart: result.value, loading: false });
      } else {
        set({ error: result.error.message, loading: false });
      }
    },

    updateLimit: async (limit) => {
      const currentCartId = get().cart?.id ?? 'default-planner';
      set({ loading: true, error: null });

      const result = await deps.updateLimitUseCase.execute(currentCartId, limit);

      if (result.ok) {
        set({ cart: result.value, loading: false });
      } else {
        set({ error: result.error.message, loading: false });
      }
    },

    removeItem: async (itemId) => {
      const currentCartId = get().cart?.id ?? 'default-planner';
      set({ loading: true, error: null });

      const result = await deps.removeItemUseCase.execute(currentCartId, itemId);

      if (result.ok) {
        set({ cart: result.value, loading: false });
      } else {
        set({ error: result.error.message, loading: false });
      }
    },

    clearError: () => set({ error: null }),
  }));

export const useCartStore = createCartStore();
