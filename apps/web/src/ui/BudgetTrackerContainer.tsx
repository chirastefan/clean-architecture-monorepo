import { useState, useEffect } from 'react';
import { useDependencies } from './DependencyContext';
import { BudgetTrackerView } from './BudgetTrackerView';
import { useCartStore } from './store/useCartStore';

type ToastMsg = {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
};

export function BudgetTrackerContainer() {
  const { notificationAdapter } = useDependencies();
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  // Consuming presentation state and actions from Zustand store
  const { cart, loading, fetchCart, addItem, updateLimit, removeItem } = useCartStore();

  useEffect(() => {
    fetchCart('default-planner');
  }, [fetchCart]);

  useEffect(() => {
    const unsubscribe = notificationAdapter.subscribe((message, type) => {
      const id = `toast-${Date.now()}`;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    });
    return unsubscribe;
  }, [notificationAdapter]);

  return (
    <BudgetTrackerView
      cart={cart}
      loading={loading}
      toasts={toasts}
      onAddItem={addItem}
      onUpdateLimit={updateLimit}
      onRemoveItem={removeItem}
    />
  );
}
