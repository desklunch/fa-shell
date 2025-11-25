import { ChevronRight, Search, MoreVertical } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Logo from "./logo";

export interface Breadcrumb {
  label: string;
  href?: string;
}

export interface ActionButton {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "outline" | "ghost";
}

interface HeaderProps {
  isMobileOpen: boolean;
  onToggle: () => void;
  breadcrumbs?: Breadcrumb[];
  onSearchOpen?: () => void;
  actionButton?: ActionButton;
  customAction?: React.ReactNode;
}

export default function Header({ 
  isMobileOpen, 
  onToggle, 
  breadcrumbs, 
  onSearchOpen, 
  actionButton,
  customAction 
}: HeaderProps) {
  return (
    <header className="sticky top-0 shrink-0 h-[56px] md:h-[72px] bg-background border-b border-black/10 px-2 md:px-4 flex items-center justify-between gap-2" data-testid="header-main">
      {/* Left: Menu button - only visible on small screens */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="h-10 w-10 p-0 relative z-[101] md:hidden flex-shrink-0 [&_svg]:w-6 [&_svg]:h-6"
        data-testid="button-mobile-menu"
        aria-label="Toggle navigation menu"
      >
        <Logo width="36" />
      </Button>
      
      {/* Center: Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 flex-1 min-w-0 pl-1" aria-label="Breadcrumb" data-testid="breadcrumb-nav">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2 min-w-0">
              {index > 0 && <ChevronRight className="h-4 w-4 text-black/30 flex-shrink-0" />}
              {crumb.href && index < breadcrumbs.length - 1 ? (
                <a href={crumb.href} className={`${index == 0 ? `text-base font-semibold` : `text-sm`} hover:text-foreground transition-colors truncate`} data-testid={`breadcrumb-${index}`}>
                  {crumb.label}
                </a>
              ) : (
                <span className={`${index == 0 ? `text-base font-semibold` : `text-sm`} truncate`} data-testid={`breadcrumb-${index}`}>
                  {crumb.label}
                </span>
              )}
            </div>
          ))}
        </nav>
      )}
      
      {/* Spacer when no breadcrumbs */}
      {(!breadcrumbs || breadcrumbs.length === 0) && <div className="flex-1" />}
      
      {/* Right: Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        
        {/* Desktop: Show all buttons */}
        <div className="hidden md:flex items-center gap-2">
          {/* Action Button (e.g., New/Edit) */}
          {actionButton && (
            actionButton.href ? (
              <a href={actionButton.href}>
                <Button
                  variant={actionButton.variant || "default"}
                  size="sm"
                  className="h-9"
                  data-testid="button-header-action"
                >
                  <actionButton.icon className="h-4 w-4" />
                  {actionButton.label}
                </Button>
              </a>
            ) : (
              <Button
                variant={actionButton.variant || "default"}
                size="sm"
                onClick={actionButton.onClick}
                className="h-9"
                data-testid="button-header-action"
              >
                <actionButton.icon className="h-4 w-4" />
                {actionButton.label}
              </Button>
            )
          )}
        </div>

        {/* Mobile: Show dropdown menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0"
              data-testid="button-actions-menu"
              aria-label="Actions menu"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="bg-card"
            align="end"
            data-testid="dropdown-actions-menu">
            {/* Action Button in mobile menu */}
            {actionButton && (
              actionButton.href ? (
                <a href={actionButton.href}>
                  <DropdownMenuItem data-testid="menu-item-action">
                    <actionButton.icon className="h-4 w-4 mr-2" />
                    {actionButton.label}
                  </DropdownMenuItem>
                </a>
              ) : (
                <DropdownMenuItem onClick={actionButton.onClick} data-testid="menu-item-action">
                  <actionButton.icon className="h-4 w-4 mr-2" />
                  {actionButton.label}
                </DropdownMenuItem>
              )
            )}
            {onSearchOpen && (
              <DropdownMenuItem onClick={onSearchOpen} data-testid="menu-item-search">
                <Search className="h-4 w-4 mr-2" />
                Search
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Custom action slot that apps can inject (e.g., dialogs, modals) */}
      {customAction}
    </header>
  );
}
