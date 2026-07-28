import { StatusBar } from 'expo-status-bar';

import { BudgetTrackerContainer } from './budget-tracker-container';

export function App() {
  return (
    <>
      <StatusBar style="dark" />
      <BudgetTrackerContainer />
    </>
  );
}
