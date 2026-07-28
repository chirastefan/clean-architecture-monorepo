import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { BudgetTrackerView } from './budget-tracker-view';
import { useMobileCartStore } from './store/use-cart-store';

const CART_ID = 'default-planner';

export function BudgetTrackerContainer() {
  const { cart, loading, errorMessage, loadCart, addItem, updateLimit, removeItem } =
    useMobileCartStore(
      useShallow((state) => ({
        cart: state.cart,
        loading: state.loading,
        errorMessage: state.errorMessage,
        loadCart: state.loadCart,
        addItem: state.addItem,
        updateLimit: state.updateLimit,
        removeItem: state.removeItem,
      }))
    );

  useEffect(() => {
    void loadCart(CART_ID);
  }, [loadCart]);

  return (
    <BudgetTrackerView
      cart={cart}
      loading={loading}
      errorMessage={errorMessage}
      onRefresh={() => loadCart(CART_ID)}
      onAddItem={(name, price, category) => addItem(CART_ID, name, price, category)}
      onUpdateLimit={(newLimit) => updateLimit(CART_ID, newLimit)}
      onRemoveItem={(itemId) => removeItem(CART_ID, itemId)}
    />
  );
}
