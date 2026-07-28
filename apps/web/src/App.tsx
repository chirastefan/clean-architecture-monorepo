import { DependencyProvider } from './ui/dependency-context';
import { BudgetTrackerContainer } from './ui/budget-tracker-container';
import './app.css';

export function App() {
  return (
    <DependencyProvider>
      <div className="app-shell">
        <header className="app-header">
          <div className="app-title-group">
            <h1>Clean Architecture Monorepo</h1>
            <span className="architecture-tag">Hexagonal • DDD • Result Pattern</span>
          </div>
        </header>
        <main className="app-main">
          <BudgetTrackerContainer />
        </main>
      </div>
    </DependencyProvider>
  );
}

export default App;
