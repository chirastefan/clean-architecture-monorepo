import { useCallback, useEffect, useState } from 'react';
import { type BudgetCart } from '@clean/cart';

import { BudgetTrackerView } from './budget-tracker-view';
import { type MobileDependencies } from './di-container';

const CART_ID = 'default-planner';

interface BudgetTrackerContainerProps {
  dependencies: MobileDependencies;
}

export function BudgetTrackerContainer({ dependencies }: BudgetTrackerContainerProps) {
  const [cart, setCart] = useState<BudgetCart | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadCart = useCallback(async () => {
    setLoading(true);
    const result = await dependencies.cartUseCase.execute(CART_ID);

    if (result.ok) {
      setCart(result.value);
      setErrorMessage(null);
    } else {
      setErrorMessage(result.error.message);
    }

    setLoading(false);
  }, [dependencies]);

  useEffect(() => {
    void loadCart();
  }, [loadCart]);

  const addItem = useCallback(
    async (name: string, price: number, category: string) => {
      setLoading(true);
      const result = await dependencies.addItemUseCase.execute(CART_ID, name, price, category);

      if (result.ok) {
        setCart(result.value);
        setErrorMessage(null);
      } else {
        setErrorMessage(result.error.message);
      }

      setLoading(false);
      return result.ok;
    },
    [dependencies]
  );

  const updateLimit = useCallback(
    async (newLimit: number) => {
      setLoading(true);
      const result = await dependencies.updateLimitUseCase.execute(CART_ID, newLimit);

      if (result.ok) {
        setCart(result.value);
        setErrorMessage(null);
      } else {
        setErrorMessage(result.error.message);
      }

      setLoading(false);
      return result.ok;
    },
    [dependencies]
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      setLoading(true);
      const result = await dependencies.removeItemUseCase.execute(CART_ID, itemId);

      if (result.ok) {
        setCart(result.value);
        setErrorMessage(null);
      } else {
        setErrorMessage(result.error.message);
      }

      setLoading(false);
    },
    [dependencies]
  );

  return (
    <BudgetTrackerView
      cart={cart}
      loading={loading}
      errorMessage={errorMessage}
      onRefresh={loadCart}
      onAddItem={addItem}
      onUpdateLimit={updateLimit}
      onRemoveItem={removeItem}
    />
  );
}
