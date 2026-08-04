import { Provider } from 'react-redux';
import { createCartReduxStore } from '@clean/cart-store';
import { DependencyProvider } from './ui/dependency-context';
import { BudgetTrackerContainer } from './ui/budget-tracker-container';
import { dependencies } from './ui/di-container';
import './app.css';

const store = createCartReduxStore(dependencies);

export function App() {
  return (
    <Provider store={store}>
      <DependencyProvider>
        <div className="app-shell">
          <header className="app-header">
            <div className="app-title-group">
              <h1>Clean Architecture Monorepo</h1>
              <span className="architecture-tag">Hexagonal • DDD • Redux Toolkit</span>
            </div>
          </header>
          <main className="app-main">
            <BudgetTrackerContainer />
          </main>
        </div>
      </DependencyProvider>
    </Provider>
  );
}

export default App;
