import { useState, useCallback, type KeyboardEvent, type MouseEvent } from 'react';

export type SelectOption = {
  value: string;
  label: string;
};

export type UseHeadlessSelectOptions = {
  options: SelectOption[];
  selectedValue: string;
  onChange: (value: string) => void;
};

export function useHeadlessSelect({ options, selectedValue, onChange }: UseHeadlessSelectOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) {
        const idx = options.findIndex((opt) => opt.value === selectedValue);
        setHighlightedIndex(idx !== -1 ? idx : 0);
      }
      return !prev;
    });
  }, [options, selectedValue]);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const selectIndex = useCallback(
    (index: number) => {
      const option = options[index];
      if (option) {
        onChange(option.value);
      }
      close();
    },
    [options, onChange, close]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          toggle();
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex((prev) => (prev + 1) % options.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((prev) => (prev - 1 + options.length) % options.length);
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          selectIndex(highlightedIndex);
          break;
        case 'Escape':
          e.preventDefault();
          close();
          break;
      }
    },
    [isOpen, options, highlightedIndex, toggle, selectIndex, close]
  );

  const getTriggerProps = useCallback(() => {
    const activeOption = options.find((o) => o.value === selectedValue);
    return {
      role: 'combobox',
      'aria-expanded': isOpen,
      'aria-haspopup': 'listbox' as const,
      'aria-controls': 'headless-select-listbox',
      tabIndex: 0,
      onClick: toggle,
      onKeyDown: handleKeyDown,
      'data-selected-label': activeOption ? activeOption.label : 'Select category...',
    };
  }, [isOpen, selectedValue, options, toggle, handleKeyDown]);

  const getListboxProps = useCallback(() => {
    return {
      id: 'headless-select-listbox',
      role: 'listbox',
      'aria-activedescendant': isOpen ? `select-option-${highlightedIndex}` : undefined,
      tabIndex: -1,
      onKeyDown: handleKeyDown,
    };
  }, [isOpen, highlightedIndex, handleKeyDown]);

  const getOptionProps = useCallback(
    (index: number) => {
      const option = options[index];
      const isSelected = option.value === selectedValue;
      const isHighlighted = index === highlightedIndex;

      return {
        id: `select-option-${index}`,
        role: 'option',
        'aria-selected': isSelected,
        'data-highlighted': isHighlighted ? '' : undefined,
        onClick: (e: MouseEvent) => {
          e.stopPropagation();
          selectIndex(index);
        },
        onMouseEnter: () => {
          setHighlightedIndex(index);
        },
      };
    },
    [options, selectedValue, highlightedIndex, selectIndex]
  );

  return {
    isOpen,
    highlightedIndex,
    getTriggerProps,
    getListboxProps,
    getOptionProps,
    close,
  };
}
