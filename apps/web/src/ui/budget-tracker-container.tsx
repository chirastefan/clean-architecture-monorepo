import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useDependencies } from './dependency-context';
import { BudgetTrackerView } from './budget-tracker-view';
import { useCartStore } from './store/use-cart-store';

export function BudgetTrackerContainer() {
  const { notificationAdapter } = useDependencies();
  const { cart, loading, fetchCart, addItem, updateLimit, removeItem } = useCartStore(
    useShallow((state) => ({
      cart: state.cart,
      loading: state.loading,
      fetchCart: state.fetchCart,
      addItem: state.addItem,
      updateLimit: state.updateLimit,
      removeItem: state.removeItem,
    }))
  );

  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: string }>>([]);

  useEffect(() => {
    fetchCart('default-planner');
  }, [fetchCart]);

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
    addItem('default-planner', name, price, category);
  };

  const handleUpdateLimit = (newLimit: number) => {
    updateLimit('default-planner', newLimit);
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem('default-planner', itemId);
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
