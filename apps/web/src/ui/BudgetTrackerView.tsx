import { useState, type FormEvent } from 'react';
import { type BudgetCart } from '@clean/cart';
import { Select } from './components/Select/Select';
import './components/Select/Select.css';

type ToastMsg = {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
};

export interface BudgetTrackerViewProps {
  cart: BudgetCart | null;
  loading: boolean;
  toasts: ToastMsg[];
  onAddItem: (name: string, price: number, category: string) => Promise<void>;
  onUpdateLimit: (limit: number) => Promise<void>;
  onRemoveItem: (itemId: string) => Promise<void>;
}

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  { value: 'grocery', label: 'Groceries' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'other', label: 'Other' },
];

const ADD_CATEGORY_OPTIONS = CATEGORY_OPTIONS.slice(1);

export function BudgetTrackerView({
  cart,
  loading,
  toasts,
  onAddItem,
  onUpdateLimit,
  onRemoveItem,
}: BudgetTrackerViewProps) {
  const [isEditingLimit, setIsEditingLimit] = useState(false);
  const [newLimit, setNewLimit] = useState('');

  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemCategory, setItemCategory] = useState('grocery');

  const [categoryFilter, setCategoryFilter] = useState('all');

  const handleAddSubmit = (e: FormEvent) => {
    e.preventDefault();
    const price = parseFloat(itemPrice);
    if (!itemName.trim() || isNaN(price) || price <= 0) return;

    onAddItem(itemName.trim(), price, itemCategory);
    setItemName('');
    setItemPrice('');
  };

  const handleLimitSubmit = (e: FormEvent) => {
    e.preventDefault();
    const limit = parseFloat(newLimit);
    if (isNaN(limit) || limit < 0) return;

    onUpdateLimit(limit);
    setIsEditingLimit(false);
    setNewLimit('');
  };

  if (!cart) {
    return <div className="loading-container">Synchronizing Budget Planner...</div>;
  }

  const totalSpent = cart.getTotalSpent();
  const remaining = cart.getRemainingBudget();
  const percentageSpent = Math.min(100, (totalSpent / cart.limit) * 100);

  const filteredItems = cart.items.filter(
    (item) => categoryFilter === 'all' || item.category === categoryFilter
  );

  const categoryNames: Record<string, string> = {
    grocery: 'Groceries',
    entertainment: 'Entertainment',
    utilities: 'Utilities',
    other: 'Other',
  };

  return (
    <div className="kanban-container-root">
      <div className="toast-area">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`} role="alert">
            {t.type === 'success' ? '✓ ' : t.type === 'error' ? '⚠ ' : 'ℹ '}
            {t.message}
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-left">
          <div className="balance-card budget-summary-card">
            <header className="card-top">
              <span className="card-label">Monthly Limit Goal</span>
              {!isEditingLimit ? (
                <button
                  className="edit-limit-btn"
                  onClick={() => {
                    setNewLimit(cart.limit.toString());
                    setIsEditingLimit(true);
                  }}
                  disabled={loading}
                >
                  ✎ Edit Limit
                </button>
              ) : (
                <form className="inline-limit-form" onSubmit={handleLimitSubmit}>
                  <input
                    type="number"
                    value={newLimit}
                    onChange={(e) => setNewLimit(e.target.value)}
                    className="limit-input"
                    step="5"
                    min="0"
                    required
                  />
                  <button type="submit" className="save-limit-btn">
                    ✓
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingLimit(false)}
                    className="cancel-limit-btn"
                  >
                    &times;
                  </button>
                </form>
              )}
            </header>
            <span className="card-amount">${cart.limit.toFixed(2)}</span>

            <div className="budget-progress-section">
              <div className="progress-bar-container">
                <div
                  className={`progress-bar ${percentageSpent > 85 ? 'progress-danger' : percentageSpent > 60 ? 'progress-warning' : 'progress-success'}`}
                  style={{ width: `${percentageSpent}%` }}
                ></div>
              </div>
              <div className="budget-stats">
                <span>Spent: ${totalSpent.toFixed(2)}</span>
                <span className="remaining-budget">
                  Remaining:{' '}
                  <strong className={remaining < 30 ? 'low-budget' : ''}>
                    ${remaining.toFixed(2)}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          <div className="action-card">
            <h3>Add Planned Item</h3>
            <form className="transaction-form" onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label htmlFor="item-name">Item Name</label>
                <input
                  type="text"
                  id="item-name"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="E.g., Desk Lamp"
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-group-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="item-price">Estimated Price ($)</label>
                  <input
                    type="number"
                    id="item-price"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    disabled={loading}
                    required
                  />
                </div>

                <div className="form-group" style={{ flex: 1.2 }}>
                  <label>Category</label>
                  <Select
                    options={ADD_CATEGORY_OPTIONS}
                    selectedValue={itemCategory}
                    onChange={setItemCategory}
                  >
                    <Select.Trigger />
                    <Select.Options>
                      {ADD_CATEGORY_OPTIONS.map((opt, i) => (
                        <Select.Option key={opt.value} value={opt.value} index={i}>
                          {opt.label}
                        </Select.Option>
                      ))}
                    </Select.Options>
                  </Select>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-deposit"
                style={{ width: '100%', marginTop: '8px' }}
                disabled={loading || !itemName || !itemPrice}
              >
                + Add to Shopping list
              </button>
            </form>
          </div>
        </div>

        <div className="dashboard-right">
          <div className="ledger-card">
            <header className="ledger-header" style={{ alignItems: 'center' }}>
              <div>
                <h3>Planning Shopping List</h3>
                <span className="ledger-badge">Clean Architecture Monorepo</span>
              </div>

              <Select
                options={CATEGORY_OPTIONS}
                selectedValue={categoryFilter}
                onChange={setCategoryFilter}
              >
                <Select.Trigger />
                <Select.Options>
                  {CATEGORY_OPTIONS.map((opt, i) => (
                    <Select.Option key={opt.value} value={opt.value} index={i}>
                      {opt.label}
                    </Select.Option>
                  ))}
                </Select.Options>
              </Select>
            </header>

            <div className="ledger-list" style={{ maxHeight: '420px' }}>
              {filteredItems.length === 0 ? (
                <div className="empty-ledger">No items found for this filter.</div>
              ) : (
                filteredItems.map((item) => (
                  <div key={item.id} className="ledger-item">
                    <div className="item-icon-category" data-category={item.category}>
                      {item.category[0].toUpperCase()}
                    </div>
                    <div className="item-details">
                      <span className="tx-title">{item.name}</span>
                      <span className="tx-time">
                        {categoryNames[item.category]} •{' '}
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="item-value" style={{ marginRight: '16px' }}>
                      ${item.price.toFixed(2)}
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="delete-item-btn"
                      disabled={loading}
                      aria-label={`Remove ${item.name}`}
                    >
                      &times;
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
