import { useEffect, useState } from 'react';
import {
  addItemThunk,
  fetchCartThunk,
  removeItemThunk,
  updateLimitThunk,
  useCartDispatch,
  useCartSelector,
} from '@clean/cart-store';

import { useDependencies } from './dependency-context';
import { BudgetTrackerView } from './budget-tracker-view';

export function BudgetTrackerContainer() {
  const { notificationAdapter } = useDependencies();
  const dispatch = useCartDispatch();
  const cart = useCartSelector((state) => state.cart.cart);
  const loading = useCartSelector((state) => state.cart.loading);

  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: string }>>([]);

  useEffect(() => {
    dispatch(fetchCartThunk('default-planner'));
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = (notificationAdapter as any).subscribe((message: string, type: string) => {
      const toast = { id: Math.random().toString(), message, type };
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 4000);
    });
    return unsubscribe;
  }, [notificationAdapter]);

  const handleAddItem = (name: string, price: number, category: string) => {
    dispatch(addItemThunk({ cartId: 'default-planner', name, price, category }));
  };

  const handleUpdateLimit = (newLimit: number) => {
    dispatch(updateLimitThunk({ cartId: 'default-planner', newLimit }));
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeItemThunk({ cartId: 'default-planner', itemId }));
  };

  return (
    <BudgetTrackerView
      cart={cart}
      loading={loading}
      toasts={toasts}
      onAddItem={handleAddItem}
      onUpdateLimit={handleUpdateLimit}
      onRemoveItem={handleRemoveItem}
    />
  );
}
