import { createContext, useContext, type ReactNode } from 'react';
import {
  useHeadlessSelect,
  type UseHeadlessSelectOptions,
  type SelectOption,
} from '@clean/ui-logic';

type SelectContextType = {
  isOpen: boolean;
  getTriggerProps: ReturnType<typeof useHeadlessSelect>['getTriggerProps'];
  getListboxProps: ReturnType<typeof useHeadlessSelect>['getListboxProps'];
  getOptionProps: ReturnType<typeof useHeadlessSelect>['getOptionProps'];
  options: SelectOption[];
  selectedValue: string;
};

const SelectContext = createContext<SelectContextType | undefined>(undefined);

function useSelectContext() {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error('Select subcomponents must be used inside a <Select> component.');
  }
  return context;
}

export interface SelectProps extends UseHeadlessSelectOptions {
  children: ReactNode;
  className?: string;
}

export function Select({ options, selectedValue, onChange, children, className }: SelectProps) {
  const headless = useHeadlessSelect({ options, selectedValue, onChange });

  return (
    <SelectContext.Provider value={{ ...headless, options, selectedValue }}>
      <div className={`select-root ${className || ''}`} onMouseLeave={headless.close}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ className }: { className?: string }) {
  const { getTriggerProps } = useSelectContext();
  const triggerProps = getTriggerProps();

  return (
    <div {...triggerProps} className={`select-trigger ${className || ''}`}>
      <span>{triggerProps['data-selected-label']}</span>
      <span className="select-arrow">▼</span>
    </div>
  );
}

export function SelectOptions({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { isOpen, getListboxProps } = useSelectContext();
  const listboxProps = getListboxProps();

  if (!isOpen) return null;

  return (
    <ul {...listboxProps} className={`select-options-list ${className || ''}`}>
      {children}
    </ul>
  );
}

export function SelectOptionComponent({
  value,
  index,
  children,
  className,
}: {
  value: string;
  index: number;
  children: ReactNode;
  className?: string;
}) {
  const { getOptionProps } = useSelectContext();
  const optionProps = getOptionProps(index);

  return (
    <li {...optionProps} className={`select-option-item ${className || ''}`} data-value={value}>
      {children}
    </li>
  );
}

Select.Trigger = SelectTrigger;
Select.Options = SelectOptions;
Select.Option = SelectOptionComponent;
export { useHeadlessSelect };
