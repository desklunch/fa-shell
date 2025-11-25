import { createContext, useContext, ReactNode } from "react";
import type { LayoutConfig } from "../types/layout";

const LayoutContext = createContext<LayoutConfig | undefined>(undefined);

interface LayoutProviderProps {
  config: LayoutConfig;
  children: ReactNode;
}

/**
 * Provider component that makes layout configuration available to all components
 * Wrap your app with this provider and pass in your configuration
 */
export function LayoutProvider({ config, children }: LayoutProviderProps) {
  return (
    <LayoutContext.Provider value={config}>
      {children}
    </LayoutContext.Provider>
  );
}

/**
 * Hook to access layout configuration
 * Must be used within a LayoutProvider
 */
export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
}
