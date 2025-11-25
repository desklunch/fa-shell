// Main components
export { default as PageLayout } from "./components/page-layout";
export { default as Sidebar } from "./components/sidebar";
export { default as Header } from "./components/header";
export { default as Logo } from "./components/logo";

// Context and hooks
export { LayoutProvider, useLayout } from "./hooks/layout-context";

// UI components (re-export for convenience)
export { Button } from "./ui/button";
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./ui/dropdown-menu";

// Utilities
export { cn } from "./lib/utils";

// Types
export * from "./types";
