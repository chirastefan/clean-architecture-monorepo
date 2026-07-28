import { StatusBar } from 'expo-status-bar';

import { BudgetTrackerContainer } from './budget-tracker-container';
import { type MobileDependencies } from './di-container';

interface AppProps {
  dependencies: MobileDependencies;
}

export function App({ dependencies }: AppProps) {
  return (
    <>
      <StatusBar style="dark" />
      <BudgetTrackerContainer dependencies={dependencies} />
    </>
  );
}
