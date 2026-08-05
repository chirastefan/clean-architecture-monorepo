import { useEffect } from 'react';
import {
  addItemThunk,
  fetchCartThunk,
  removeItemThunk,
  updateLimitThunk,
  useCartDispatch,
  useCartSelector,
} from '@clean/cart-store';

import { BudgetTrackerView } from './budget-tracker-view';

const CART_ID = 'default-planner';

export function BudgetTrackerContainer() {
  const dispatch = useCartDispatch();
  const cart = useCartSelector((state) => state.cart.cart);
  const loading = useCartSelector((state) => state.cart.loading);
  const errorMessage = useCartSelector((state) => state.cart.errorMessage);

  useEffect(() => {
    dispatch(fetchCartThunk(CART_ID));
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchCartThunk(CART_ID));
  };

  const handleAddItem = (name: string, price: number, category: string) => {
    dispatch(addItemThunk({ cartId: CART_ID, name, price, category }));
  };

  const handleUpdateLimit = (newLimit: number) => {
    dispatch(updateLimitThunk({ cartId: CART_ID, newLimit }));
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeItemThunk({ cartId: CART_ID, itemId }));
  };

  return (
    <BudgetTrackerView
      cart={cart}
      loading={loading}
      errorMessage={errorMessage}
      onRefresh={handleRefresh}
      onAddItem={handleAddItem}
      onUpdateLimit={handleUpdateLimit}
      onRemoveItem={handleRemoveItem}
    />
  );
}
