'use client';

import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { SharedBadge, SharedButton, SharedCard } from '@clean/web-ui-components';
import {
  addItemThunk,
  createCartReduxStore,
  fetchCartThunk,
  removeItemThunk,
  updateLimitThunk,
  useCartDispatch,
  useCartSelector,
} from '@clean/cart-store';
import { dependencies } from '../ui/di-container';

const CART_ID = 'default-planner';
const store = createCartReduxStore(dependencies);

const CATEGORIES = [
  { value: 'utilities', label: 'Utilities', color: '#f59e0b' },
  { value: 'grocery', label: 'Grocery', color: '#10b981' },
  { value: 'entertainment', label: 'Fun', color: '#8b5cf6' },
  { value: 'education', label: 'Learning', color: '#3b82f6' },
  { value: 'other', label: 'Other', color: '#64748b' },
];

function NextBudgetPageContent() {
  const dispatch = useCartDispatch();
  const cart = useCartSelector((state) => state.cart.cart);
  const loading = useCartSelector((state) => state.cart.loading);
  const errorMessage = useCartSelector((state) => state.cart.errorMessage);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [limit, setLimit] = useState('');

  useEffect(() => {
    dispatch(fetchCartThunk(CART_ID));
  }, [dispatch]);

  const totalSpent = cart?.getTotalSpent() ?? 0;
  const budgetLimit = cart?.limit ?? 300;
  const remaining = cart?.getRemainingBudget() ?? budgetLimit;
  const progress = budgetLimit > 0 ? Math.min(totalSpent / budgetLimit, 1) : 0;

  const handleAddExpense = () => {
    const parsed = Number(amount);
    if (!name.trim() || !Number.isFinite(parsed) || parsed <= 0) return;
    dispatch(addItemThunk({ cartId: CART_ID, name: name.trim(), price: parsed, category }));
    setName('');
    setAmount('');
  };

  const handleUpdateLimit = () => {
    const parsed = Number(limit);
    if (!limit.trim() || !Number.isFinite(parsed) || parsed < 0) return;
    dispatch(updateLimitThunk({ cartId: CART_ID, newLimit: parsed }));
    setLimit('');
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeItemThunk({ cartId: CART_ID, itemId }));
  };

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <SharedBadge color="#3b82f6">NEXT.JS 15 APP ROUTER · SHARED REDUX STORE</SharedBadge>
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            margin: '0.5rem 0',
          }}
        >
          Shared Domain, Shared Redux Store.
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.05rem', margin: 0 }}>
          Powered by <code>@clean/cart</code> domain use cases and <code>@clean/cart-store</code>.
        </p>
      </header>

      {errorMessage && (
        <div
          style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            padding: '1rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            fontWeight: 600,
          }}
        >
          {errorMessage}
        </div>
      )}

      {/* Summary Card */}
      <SharedCard dark style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <SharedBadge color="#f97316">MONTHLY OVERVIEW</SharedBadge>
            <h2 style={{ margin: '0.25rem 0 0', fontSize: '1.5rem' }}>Budget Pulse</h2>
          </div>
          {loading && <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Loading...</span>}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            margin: '1.5rem 0 1rem',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.75rem',
                color: '#94a3b8',
                fontWeight: 700,
                letterSpacing: '0.1em',
              }}
            >
              SPENT
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800 }}>${totalSpent.toFixed(2)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontSize: '0.75rem',
                color: '#94a3b8',
                fontWeight: 700,
                letterSpacing: '0.1em',
              }}
            >
              REMAINING
            </div>
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: remaining < 0 ? '#fca5a5' : '#86efac',
              }}
            >
              ${remaining.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: '8px',
            backgroundColor: '#334155',
            borderRadius: '999px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress * 100}%`,
              backgroundColor: remaining < 0 ? '#ef4444' : '#fb923c',
              borderRadius: '999px',
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.75rem' }}>
          Current limit · ${budgetLimit.toFixed(2)}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <input
            type="number"
            placeholder={`New limit (${budgetLimit})`}
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            style={{
              flex: 1,
              padding: '0.6rem 0.8rem',
              borderRadius: '10px',
              border: '1px solid #334155',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              fontSize: '0.9rem',
            }}
          />
          <SharedButton variant="light" onClick={handleUpdateLimit}>
            Update
          </SharedButton>
        </div>
      </SharedCard>

      {/* Add Item Card */}
      <SharedCard style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1rem', fontSize: '1.2rem', fontWeight: 700 }}>
          Add Planned Expense
        </h3>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '2fr 1fr' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#64748b',
                marginBottom: '0.35rem',
              }}
            >
              EXPENSE NAME
            </label>
            <input
              type="text"
              placeholder="e.g. Ergonomic chair"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.95rem',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#64748b',
                marginBottom: '0.35rem',
              }}
            >
              AMOUNT ($)
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.95rem',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <label
            style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#64748b',
              marginBottom: '0.35rem',
            }}
          >
            CATEGORY
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: '999px',
                  border: `1px solid ${cat.value === category ? cat.color : '#cbd5e1'}`,
                  backgroundColor: cat.value === category ? cat.color : '#ffffff',
                  color: cat.value === category ? '#ffffff' : '#475569',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '1.25rem' }}>
          <SharedButton variant="primary" fullWidth onClick={handleAddExpense}>
            Add Expense →
          </SharedButton>
        </div>
      </SharedCard>

      {/* Item List */}
      <SharedCard>
        <h3 style={{ margin: '0 0 1rem', fontSize: '1.2rem', fontWeight: 700 }}>
          Planned Items ({cart?.items.length ?? 0})
        </h3>
        {!cart || cart.items.length === 0 ? (
          <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No expenses planned yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {cart.items.map((item) => (
              <li
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.95rem' }}>{item.name}</strong>
                  <span style={{ marginLeft: '0.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                    ({item.category})
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontWeight: 700 }}>${item.price.toFixed(2)}</span>
                  <SharedButton
                    variant="danger"
                    onClick={() => handleRemoveItem(item.id)}
                    style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                  >
                    Delete
                  </SharedButton>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SharedCard>
    </main>
  );
}

export default function NextBudgetPage() {
  return (
    <Provider store={store}>
      <NextBudgetPageContent />
    </Provider>
  );
}
