import r2wc from '@r2wc/react-to-web-component';
import { BudgetTrackerContainer } from './ui/budget-tracker-container';
import { DependencyProvider } from './ui/dependency-context';
import './ui/styles/dashboard.css';
import './index.css';

// We wrap the component in the DependencyProvider so the Web Component
// has access to all the Clean Architecture use cases and repositories.
const ConnectedBudgetTracker = () => {
  return (
    <DependencyProvider>
      <BudgetTrackerContainer />
    </DependencyProvider>
  );
};

// Create the Web Component using r2wc(Component, options)
const BudgetTrackerWebComponent = r2wc(ConnectedBudgetTracker, {
  props: {}, // Add any props here that you expect host applications (e.g. PHP) to pass down
});

// Register it with the browser
customElements.define('budget-tracker-widget', BudgetTrackerWebComponent);
