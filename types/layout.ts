import { ReactNode } from "react";

/**
 * Navigation item configuration
 */
export interface NavItem {
  name: string;
  href: string;
  icon: any; // Lucide icon component
  active?: boolean;
  allowedRoles?: string[];
  badge?: number | string;
}

/**
 * Navigation section with optional heading
 */
export interface NavSection {
  heading?: string;
  items: NavItem[];
}

/**
 * User data for display in sidebar
 */
export interface LayoutUser {
  id: number | string;
  username: string;
  email: string;
  fullName?: string;
  role?: string;
}

/**
 * Breadcrumb item for header
 */
export interface Breadcrumb {
  label: string;
  href?: string;
}

/**
 * Action button for header
 */
export interface ActionButton {
  label: string;
  onClick: () => void;
  icon?: any;
  variant?: "default" | "outline" | "ghost";
}

/**
 * Configuration for the layout framework
 */
export interface LayoutConfig {
  /** Current authenticated user */
  user: LayoutUser | null;
  
  /** Navigation sections to display in sidebar */
  navigation: NavSection[];
  
  /** Callback when user clicks sign out */
  onSignOut?: () => void;
  
  /** Callback when user clicks to edit profile */
  onEditProfile?: () => void;
  
  /** Optional custom logo component */
  logo?: ReactNode;
  
  /** Optional search handler */
  onSearch?: () => void;
  
  /** Optional keyboard shortcut for search (default: Cmd+K) */
  searchShortcut?: string;
  
  /** Optional custom action slots for header */
  headerActions?: ActionButton[];
  
  /** Optional custom footer content for sidebar */
  sidebarFooter?: ReactNode;
}

/**
 * Props for PageLayout component
 */
export interface PageLayoutProps {
  children: ReactNode;
  breadcrumbs?: Breadcrumb[];
  actionButton?: ActionButton;
}
