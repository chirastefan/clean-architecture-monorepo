import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { createCartReduxStore } from '@clean/cart-store';

import { BudgetTrackerContainer } from './budget-tracker-container';
import { createMobileDependencies } from './di-container';

const mobileDependencies = createMobileDependencies();
const store = createCartReduxStore({ deps: mobileDependencies });

export function App() {
  return (
    <Provider store={store}>
      <StatusBar style="dark" />
      <BudgetTrackerContainer />
    </Provider>
  );
}
