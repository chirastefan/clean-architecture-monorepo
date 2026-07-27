import { useState, useEffect, useCallback } from 'react';
import { type BudgetCart } from '@clean/cart';
import { useDependencies } from './DependencyContext';
import { BudgetTrackerView } from './BudgetTrackerView';

type ToastMsg = {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
};

export function BudgetTrackerContainer() {
  const { notificationAdapter, cartUseCase, addItemUseCase, updateLimitUseCase, removeItemUseCase } = useDependencies();

  const [cart, setCart] = useState<BudgetCart | null>(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  const loadCart = useCallback(async () => {
    setLoading(true);
    const result = await cartUseCase.execute('default-planner');
    if (result.ok) {
      setCart(result.value);
    }
    setLoading(false);
  }, [cartUseCase]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

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

  const handleAddItem = async (name: string, price: number, category: string) => {
    setLoading(true);
    const result = await addItemUseCase.execute('default-planner', name, price, category);
    if (result.ok) {
      setCart(result.value);
    }
    setLoading(false);
  };

  const handleUpdateLimit = async (limit: number) => {
    setLoading(true);
    const result = await updateLimitUseCase.execute('default-planner', limit);
    if (result.ok) {
      setCart(result.value);
    }
    setLoading(false);
  };

  const handleRemoveItem = async (itemId: string) => {
    setLoading(true);
    const result = await removeItemUseCase.execute('default-planner', itemId);
    if (result.ok) {
      setCart(result.value);
    }
    setLoading(false);
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
