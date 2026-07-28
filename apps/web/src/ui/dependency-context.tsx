import { createContext, useContext, type ReactNode } from 'react';
import { dependencies, type Dependencies } from './di-container';

const DependencyContext = createContext<Dependencies | null>(null);

export function DependencyProvider({ children }: { children: ReactNode }) {
  return <DependencyContext.Provider value={dependencies}>{children}</DependencyContext.Provider>;
}

export function useDependencies(): Dependencies {
  const context = useContext(DependencyContext);
  if (!context) {
    throw new Error('useDependencies must be used within DependencyProvider');
  }
  return context;
}
