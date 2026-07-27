import { createContext, useContext, type ReactNode } from 'react';
import { dependencies, Dependencies } from './CompositionRoot';

const DependencyContext = createContext<Dependencies | undefined>(undefined);

export interface DependencyProviderProps {
  children: ReactNode;
}

export function DependencyProvider({ children }: { children: ReactNode }) {
  return (
    <DependencyContext.Provider value={dependencies}>
      {children}
    </DependencyContext.Provider>
  );
}

export function useDependencies() {
  const context = useContext(DependencyContext);
  if (!context) {
    throw new Error('useDependencies must be used within a DependencyProvider.');
  }
  return context;
}
