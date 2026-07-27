import { BudgetTrackerContainer } from './ui/BudgetTrackerContainer';
import { DependencyProvider } from './ui/DependencyContext';
import './ui/styles/Dashboard.css';
import './App.css';

function App() {
  return (
    <DependencyProvider>
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>DDD Feature Packages Monorepo</h1>
          <p className="subtitle">
            Consuming <code>@domain/cart</code> and <code>@domain/auth</code> feature packages directly inside apps/web.
          </p>
        </header>

        <main className="dashboard-main">
          <BudgetTrackerContainer />
        </main>
      </div>
    </DependencyProvider>
  );
}

export default App;
