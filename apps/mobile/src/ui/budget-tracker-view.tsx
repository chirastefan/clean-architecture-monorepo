import { useState } from 'react';
import { type BudgetCart } from '@clean/cart';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Category = {
  value: string;
  label: string;
  accent: string;
};

const CATEGORIES: Category[] = [
  { value: 'utilities', label: 'Utilities', accent: '#f59e0b' },
  { value: 'grocery', label: 'Grocery', accent: '#10b981' },
  { value: 'entertainment', label: 'Fun', accent: '#8b5cf6' },
  { value: 'education', label: 'Learning', accent: '#3b82f6' },
  { value: 'other', label: 'Other', accent: '#64748b' },
];

type BudgetTrackerViewProps = {
  cart: BudgetCart | null;
  loading: boolean;
  errorMessage: string | null;
  onRefresh: () => Promise<void>;
  onAddItem: (name: string, price: number, category: string) => Promise<boolean>;
  onUpdateLimit: (newLimit: number) => Promise<boolean>;
  onRemoveItem: (itemId: string) => Promise<void>;
};

export function BudgetTrackerView({
  cart,
  loading,
  errorMessage,
  onRefresh,
  onAddItem,
  onUpdateLimit,
  onRemoveItem,
}: BudgetTrackerViewProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [limit, setLimit] = useState('');

  const totalSpent = cart?.getTotalSpent() ?? 0;
  const budgetLimit = cart?.limit ?? 300;
  const remaining = cart?.getRemainingBudget() ?? budgetLimit;
  const progress = budgetLimit > 0 ? Math.min(totalSpent / budgetLimit, 1) : 0;

  const submitExpense = async () => {
    const parsedAmount = Number(amount);
    if (!name.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return;
    }

    const added = await onAddItem(name.trim(), parsedAmount, category);
    if (added) {
      setName('');
      setAmount('');
    }
  };

  const saveLimit = async () => {
    if (!limit.trim()) {
      return;
    }

    const parsedLimit = Number(limit);
    if (!Number.isFinite(parsedLimit) || parsedLimit < 0) {
      return;
    }

    const updated = await onUpdateLimit(parsedLimit);
    if (updated) {
      setLimit('');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
        >
          <View style={styles.header}>
            <Text style={styles.eyebrow}>CLEAN ARCHITECTURE · MOBILE</Text>
            <Text style={styles.title}>Plan money{'\n'}with less noise.</Text>
            <Text style={styles.subtitle}>
              Same cart domain rules as web. Native controls, persistent device storage.
            </Text>
          </View>

          {errorMessage ? (
            <View accessibilityRole="alert" style={styles.errorBanner}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <View style={[styles.card, styles.summaryCard]}>
            <View style={styles.cardHeadingRow}>
              <View>
                <Text style={styles.cardKicker}>MONTHLY OVERVIEW</Text>
                <Text style={styles.cardTitle}>Budget pulse</Text>
              </View>
              {loading ? <ActivityIndicator color="#ffffff" /> : null}
            </View>

            <View style={styles.amountRow}>
              <View>
                <Text style={styles.summaryLabel}>SPENT</Text>
                <Text style={styles.spentAmount}>${totalSpent.toFixed(2)}</Text>
              </View>
              <View style={styles.remainingBlock}>
                <Text style={styles.summaryLabel}>LEFT</Text>
                <Text style={[styles.remainingAmount, remaining < 0 && styles.dangerAmount]}>
                  ${remaining.toFixed(2)}
                </Text>
              </View>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progress * 100}%` },
                  remaining < 0 && styles.progressDanger,
                ]}
              />
            </View>

            <Text style={styles.limitCaption}>Current limit · ${budgetLimit.toFixed(2)}</Text>

            <View style={styles.limitRow}>
              <TextInput
                accessibilityLabel="New monthly budget limit"
                inputMode="decimal"
                onChangeText={setLimit}
                placeholder={`New limit (${budgetLimit.toFixed(0)})`}
                placeholderTextColor="#94a3b8"
                style={styles.darkInput}
                value={limit}
              />
              <Pressable
                accessibilityRole="button"
                disabled={loading}
                onPress={() => void saveLimit()}
                style={({ pressed }) => [
                  styles.lightButton,
                  pressed && styles.buttonPressed,
                  loading && styles.buttonDisabled,
                ]}
              >
                <Text style={styles.lightButtonText}>Update</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardKickerDark}>ADD PLANNED EXPENSE</Text>
            <Text style={styles.sectionTitle}>What’s next?</Text>

            <Text style={styles.fieldLabel}>NAME</Text>
            <TextInput
              accessibilityLabel="Expense name"
              onChangeText={setName}
              placeholder="e.g. Ergonomic keyboard"
              placeholderTextColor="#94a3b8"
              returnKeyType="next"
              style={styles.input}
              value={name}
            />

            <Text style={styles.fieldLabel}>AMOUNT</Text>
            <TextInput
              accessibilityLabel="Expense amount"
              inputMode="decimal"
              onChangeText={setAmount}
              placeholder="$0.00"
              placeholderTextColor="#94a3b8"
              style={styles.input}
              value={amount}
            />

            <Text style={styles.fieldLabel}>CATEGORY</Text>
            <ScrollView
              horizontal
              contentContainerStyle={styles.categoryList}
              showsHorizontalScrollIndicator={false}
            >
              {CATEGORIES.map((option) => {
                const selected = option.value === category;
                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    key={option.value}
                    onPress={() => setCategory(option.value)}
                    style={[
                      styles.categoryPill,
                      selected && {
                        backgroundColor: option.accent,
                        borderColor: option.accent,
                      },
                    ]}
                  >
                    <Text style={[styles.categoryText, selected && styles.categoryTextSelected]}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Pressable
              accessibilityRole="button"
              disabled={loading}
              onPress={() => void submitExpense()}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.buttonPressed,
                loading && styles.buttonDisabled,
              ]}
            >
              <Text style={styles.primaryButtonText}>Add to budget</Text>
              <Text style={styles.primaryButtonArrow}>→</Text>
            </Pressable>
          </View>

          <View style={styles.listHeader}>
            <View>
              <Text style={styles.cardKickerDark}>PLANNED ITEMS</Text>
              <Text style={styles.sectionTitle}>This month</Text>
            </View>
            <Text style={styles.itemCount}>{cart?.items.length ?? 0}</Text>
          </View>

          {!cart || cart.items.length === 0 ? (
            <View style={[styles.card, styles.emptyCard]}>
              <Text style={styles.emptyMark}>＋</Text>
              <Text style={styles.emptyTitle}>Room to plan.</Text>
              <Text style={styles.emptyCopy}>
                Add first expense above. It stays on this device between sessions.
              </Text>
            </View>
          ) : (
            <View style={styles.expenseList}>
              {cart.items.map((item, index) => (
                <View key={item.id} style={styles.expenseCard}>
                  <View style={styles.expenseIndex}>
                    <Text style={styles.expenseIndexText}>
                      {String(index + 1).padStart(2, '0')}
                    </Text>
                  </View>
                  <View style={styles.expenseMeta}>
                    <Text numberOfLines={1} style={styles.expenseName}>
                      {item.name}
                    </Text>
                    <Text style={styles.expenseCategory}>{item.category.toUpperCase()}</Text>
                  </View>
                  <View style={styles.expenseAction}>
                    <Text style={styles.expensePrice}>${item.price.toFixed(2)}</Text>
                    <Pressable
                      accessibilityLabel={`Remove ${item.name}`}
                      accessibilityRole="button"
                      disabled={loading}
                      hitSlop={10}
                      onPress={() => void onRemoveItem(item.id)}
                    >
                      <Text style={styles.removeText}>Remove</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f1ea',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 48,
  },
  header: {
    paddingBottom: 28,
  },
  eyebrow: {
    color: '#ea580c',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.6,
    marginBottom: 14,
  },
  title: {
    color: '#172033',
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: -1.8,
    lineHeight: 47,
  },
  subtitle: {
    color: '#64748b',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 14,
    maxWidth: 340,
  },
  errorBanner: {
    backgroundColor: '#fee2e2',
    borderColor: '#fecaca',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
    padding: 14,
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 13,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#ffffff',
    borderColor: '#e2ded5',
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 18,
    padding: 20,
  },
  summaryCard: {
    backgroundColor: '#172033',
    borderColor: '#172033',
    padding: 22,
  },
  cardHeadingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardKicker: {
    color: '#f97316',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  cardKickerDark: {
    color: '#ea580c',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
  },
  amountRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 28,
  },
  remainingBlock: {
    alignItems: 'flex-end',
  },
  summaryLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  spentAmount: {
    color: '#ffffff',
    fontSize: 35,
    fontWeight: '800',
    letterSpacing: -1.2,
    marginTop: 4,
  },
  remainingAmount: {
    color: '#86efac',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 5,
  },
  dangerAmount: {
    color: '#fca5a5',
  },
  progressTrack: {
    backgroundColor: '#334155',
    borderRadius: 999,
    height: 8,
    marginTop: 22,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: '#fb923c',
    borderRadius: 999,
    height: 8,
  },
  progressDanger: {
    backgroundColor: '#ef4444',
  },
  limitCaption: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 10,
  },
  limitRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  darkInput: {
    backgroundColor: '#253147',
    borderColor: '#3b4a62',
    borderRadius: 12,
    borderWidth: 1,
    color: '#ffffff',
    flex: 1,
    fontSize: 14,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  lightButton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 18,
  },
  lightButtonText: {
    color: '#172033',
    fontSize: 13,
    fontWeight: '800',
  },
  sectionTitle: {
    color: '#172033',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.6,
    marginBottom: 22,
    marginTop: 4,
  },
  fieldLabel: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 7,
    marginTop: 4,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
    borderRadius: 14,
    borderWidth: 1,
    color: '#172033',
    fontSize: 15,
    marginBottom: 16,
    minHeight: 52,
    paddingHorizontal: 15,
  },
  categoryList: {
    gap: 8,
    paddingBottom: 6,
  },
  categoryPill: {
    borderColor: '#d8dee8',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  categoryText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '700',
  },
  categoryTextSelected: {
    color: '#ffffff',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#ea580c',
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    minHeight: 56,
    paddingHorizontal: 18,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  primaryButtonArrow: {
    color: '#ffffff',
    fontSize: 22,
  },
  buttonPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  listHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 4,
  },
  itemCount: {
    backgroundColor: '#172033',
    borderRadius: 999,
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    minWidth: 34,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 7,
    textAlign: 'center',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 34,
  },
  emptyMark: {
    color: '#cbd5e1',
    fontSize: 40,
    fontWeight: '300',
  },
  emptyTitle: {
    color: '#172033',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 8,
  },
  emptyCopy: {
    color: '#64748b',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
    maxWidth: 260,
    textAlign: 'center',
  },
  expenseList: {
    gap: 10,
  },
  expenseCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e2ded5',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 14,
  },
  expenseIndex: {
    alignItems: 'center',
    backgroundColor: '#fff7ed',
    borderRadius: 12,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  expenseIndexText: {
    color: '#ea580c',
    fontSize: 12,
    fontWeight: '800',
  },
  expenseMeta: {
    flex: 1,
    marginLeft: 12,
  },
  expenseName: {
    color: '#172033',
    fontSize: 15,
    fontWeight: '700',
  },
  expenseCategory: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 5,
  },
  expenseAction: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  expensePrice: {
    color: '#172033',
    fontSize: 15,
    fontWeight: '800',
  },
  removeText: {
    color: '#dc2626',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 8,
  },
});
