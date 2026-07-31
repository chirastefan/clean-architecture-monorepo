import { useState } from 'react';
import { type BudgetCart } from '@clean/cart';
import { Select } from './components/select/select';
import './styles/dashboard.css';

export type ToastMessage = {
  id: string;
  message: string;
  type: string;
};

export type BudgetTrackerViewProps = {
  cart: BudgetCart | null;
  loading: boolean;
  toasts: ToastMessage[];
  onAddItem: (name: string, price: number, category: string) => void;
  onUpdateLimit: (newLimit: number) => void;
  onRemoveItem: (itemId: string) => void;
};

const CATEGORY_OPTIONS = [
  { value: 'utilities', label: '⚡ Utilities' },
  { value: 'grocery', label: '🛒 Grocery' },
  { value: 'entertainment', label: '🍿 Entertainment' },
  { value: 'education', label: '📚 Education' },
  { value: 'other', label: '💡 Other' },
];

export function BudgetTrackerView({
  cart,
  loading,
  toasts,
  onAddItem,
  onUpdateLimit,
  onRemoveItem,
}: BudgetTrackerViewProps) {
  const [name, setName] = useState('');
  const [priceStr, setPriceStr] = useState('');
  const [category, setCategory] = useState('utilities');

  const [limitStr, setLimitStr] = useState('');
  const [isEditingLimit, setIsEditingLimit] = useState(false);

  const totalSpent = cart ? cart.getTotalSpent() : 0;
  const limit = cart ? cart.limit : 300;
  const remaining = cart ? cart.getRemainingBudget() : 300;
  const percentage = Math.min(Math.round((totalSpent / limit) * 100), 100);

  const isExceeded = remaining < 0;

  const handleSubmitItem = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(priceStr);
    if (!name.trim() || isNaN(price)) return;
    onAddItem(name.trim(), price, category);
    setName('');
    setPriceStr('');
  };

  const handleSaveLimit = () => {
    const val = parseFloat(limitStr);
    if (!isNaN(val)) {
      onUpdateLimit(val);
    }
    setIsEditingLimit(false);
  };

  return (
    <div className="dashboard-layout">
      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-card toast-${toast.type}`}>
            <span className="toast-icon">
              {toast.type === 'error' ? '⚠️' : toast.type === 'success' ? '✅' : 'ℹ️'}
            </span>
            <span className="toast-text">{toast.message}</span>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* Left Column: Summary & Add Form */}
        <section className="card glass-panel summary-card">
          <div className="card-header">
            <h2>Monthly Budget Planner</h2>
            {loading && <span className="spinner-badge">Syncing...</span>}
          </div>

          {/* Budget Progress Meter */}
          <div className="budget-progress-box">
            <div className="progress-labels">
              <span>Spent: ${totalSpent.toFixed(2)}</span>
              <span>
                Limit:{' '}
                {isEditingLimit ? (
                  <span className="limit-inline-edit">
                    <input
                      type="number"
                      value={limitStr}
                      onChange={(e) => setLimitStr(e.target.value)}
                      placeholder={limit.toString()}
                      className="input-limit-sm"
                    />
                    <button onClick={handleSaveLimit} className="btn-save-sm" type="button">
                      Save
                    </button>
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setLimitStr(limit.toString());
                      setIsEditingLimit(true);
                    }}
                    className="btn-link-limit"
                    type="button"
                  >
                    ${limit.toFixed(2)} ✏️
                  </button>
                )}
              </span>
            </div>

            <div className="progress-track">
              <div
                className={`progress-fill ${isExceeded ? 'progress-exceeded' : ''}`}
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className="remaining-stat">
              Remaining:{' '}
              <strong className={isExceeded ? 'text-danger' : 'text-success'}>
                ${remaining.toFixed(2)}
              </strong>
            </div>
          </div>

          {/* Add Item Form */}
          <form onSubmit={handleSubmitItem} className="add-item-form">
            <h3>Add Planned Expense</h3>
            <div className="form-group">
              <label htmlFor="expense-name">Expense Name</label>
              <input
                id="expense-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ergonomic Keyboard"
                className="form-input"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label htmlFor="expense-price">Amount ($)</label>
                <input
                  id="expense-price"
                  type="number"
                  step="0.01"
                  value={priceStr}
                  onChange={(e) => setPriceStr(e.target.value)}
                  placeholder="0.00"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group flex-1">
                <label>Category</label>
                <Select options={CATEGORY_OPTIONS} selectedValue={category} onChange={setCategory}>
                  <Select.Trigger />
                  <Select.Options>
                    {CATEGORY_OPTIONS.map((opt, idx) => (
                      <Select.Option key={opt.value} value={opt.value} index={idx}>
                        {opt.label}
                      </Select.Option>
                    ))}
                  </Select.Options>
                </Select>
              </div>
            </div>

            <button type="submit" className="btn-primary-action">
              + Add to Monthly Budget
            </button>
          </form>
        </section>

        {/* Right Column: Planned Expenses List */}
        <section className="card glass-panel items-card">
          <div className="card-header">
            <h2>Planned Items ({cart?.items.length || 0})</h2>
          </div>

          {!cart || cart.items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <p>No expenses added yet this month.</p>
              <span className="empty-subtitle">
                Use the form to plan your monthly budget items.
              </span>
            </div>
          ) : (
            <ul className="expense-list">
              {cart.items.map((item) => (
                <li key={item.id} className="expense-item-row">
                  <div className="item-meta">
                    <span className="item-name">{item.name}</span>
                    <span className="item-category-badge">{item.category}</span>
                  </div>
                  <div className="item-actions">
                    <span className="item-price">${item.price.toFixed(2)}</span>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="btn-delete-icon"
                      title="Remove Item"
                      type="button"
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
