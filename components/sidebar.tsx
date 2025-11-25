import { useState, useEffect, useRef } from "react";
import { cn } from "../lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ChevronUp,
  Search,
} from "lucide-react";
import { Button } from "../ui/button";
import { useLayout } from "../hooks/layout-context";
import Logo from "./logo";
import type { NavItem, NavSection } from "../types/layout";

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ isMobileOpen, onMobileClose }: SidebarProps) {
  const { user, navigation, onSearch } = useLayout();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(false);
  const prevLocationRef = useRef("");

  // Initialize group collapsed states from sessionStorage
  const [groupCollapsedState, setGroupCollapsedState] = useState<Record<string, boolean>>(() => {
    if (typeof window === 'undefined') return {};
    const saved = sessionStorage.getItem('sidebar-groups-collapsed');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {};
      }
    }
    // Initialize with default values from navigation config
    const initial: Record<string, boolean> = {};
    navigation.forEach(section => {
      if (section.heading) {
        initial[section.heading] = false;
      }
    });
    return initial;
  });

  // Save to sessionStorage whenever group state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('sidebar-groups-collapsed', JSON.stringify(groupCollapsedState));
    }
  }, [groupCollapsedState]);

  // Toggle group collapsed state
  const toggleGroup = (heading: string) => {
    setGroupCollapsedState(prev => ({
      ...prev,
      [heading]: !prev[heading]
    }));
  };

  // Filter items based on user role
  const filterByRole = (items: NavItem[]) => {
    if (!user?.role) return items;
    return items.filter(item => {
      if (!item.allowedRoles || item.allowedRoles.length === 0) return true;
      return item.allowedRoles.includes(user.role);
    });
  };

  // Filter sections based on user role
  const filterSections = (sections: NavSection[]) => {
    if (!user?.role) return sections;
    return sections
      .map(section => ({
        ...section,
        items: filterByRole(section.items)
      }))
      .filter(section => section.items.length > 0);
  };

  const visibleNavigation = filterSections(navigation);

  // Track screen size for medium breakpoint behavior
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const wasMediumScreen = isMediumScreen;
      const nowMediumScreen = width >= 768 && width < 1024;
      const isSmallScreen = width < 768;
      const isLargeScreen = width >= 1024;

      setIsMediumScreen(nowMediumScreen);

      // On small screens, always ensure sidebar is expanded (for mobile menu labels)
      if (isSmallScreen) {
        setIsCollapsed(false);
      }
      // When entering medium screen from any other breakpoint, force collapsed
      else if (nowMediumScreen && !wasMediumScreen) {
        setIsCollapsed(true);
      }
      // When on large screen and coming from medium, restore expanded
      else if (isLargeScreen && wasMediumScreen) {
        setIsCollapsed(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [isMediumScreen]);

  // Determine if sidebar should show expanded content
  const isSmallScreen =
    typeof window !== "undefined" && window.innerWidth < 768;
  const showExpanded = isSmallScreen
    ? true
    : isMediumScreen
      ? isHovered
      : !isCollapsed;

  // Close mobile menu on route change
  useEffect(() => {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    if (prevLocationRef.current !== currentPath && prevLocationRef.current !== '') {
      onMobileClose();
      if (isMediumScreen) {
        setIsHovered(false);
      }
    }
    prevLocationRef.current = currentPath;
  }, [typeof window !== 'undefined' ? window.location.pathname : '', isMediumScreen, onMobileClose]);

  // Handle medium screen hover behavior
  const handleMouseEnter = () => {
    if (isMediumScreen) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (isMediumScreen) {
      setIsHovered(false);
    }
  };

  // On small screens, don't render if not open
  if (
    !isMobileOpen &&
    typeof window !== "undefined" &&
    window.innerWidth < 768
  ) {
    return null;
  }

  return (
    <aside
      className={cn(
        "bg-sidebar border-r border-black/10 z-50 transition-all duration-200",
        "flex flex-col max-h-screen",
        // Large screens: collapsible width
        "lg:relative lg:z-auto",
        isCollapsed && !isMediumScreen && "lg:w-[72px]",
        !isCollapsed && !isMediumScreen && "lg:w-[320px]",
        // Medium screens: collapsed by default, overlay when hovered
        "md:relative md:z-50",
        isMediumScreen && isHovered && "md:w-[480px] md:shadow-xl",
        isMediumScreen && !isHovered && "md:w-[72px] md:shadow-sm",
        // Small screens: full width overlay when open
        "fixed",
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-testid="sidebar-main"
    >
      {/* Logo and Toggle */}
      <div className="h-[72px] border-b border-black/10 flex items-center justify-between p-3">
        <Button
          variant="ghost"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="bg-transparent h-12 w-12 p-0 flex [&_svg]:w-9 [&_svg]:h-9"
          data-testid="button-toggle-sidebar"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Logo width="36" />
        </Button>

        {/* Mobile close button - only show on small screens */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onMobileClose}
          className="h-8 w-8 p-0 md:hidden"
          data-testid="button-close-sidebar"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </Button>

        {!isCollapsed && (
          <>
            {/* Desktop toggle button - only show on large screens, not medium */}
            {!isMediumScreen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={cn(
                  "h-8 w-8 p-0 hidden lg:flex"
                )}
                data-testid="button-toggle-sidebar"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            )}
          </>
        )}
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto p-2 py-2 space-y-2"
        data-testid="nav-sidebar"
      >
        {/* Search Button */}
        {onSearch && (
          <div
            className={cn(
              "",
              !showExpanded && "flex justify-center",
            )}
            data-testid="sidebar-search"
          >
            <Button
              variant="ghost"
              onClick={onSearch}
              className={cn(
                "w-full justify-start gap-2 hover:bg-[#DAF600] hover:bg-accent-foreground hover:text-accent px-3 pr-2 transition-colors",
                !showExpanded && "justify-start w-auto px-3"
              )}
              data-testid="button-search"
              aria-label={showExpanded ? undefined : "Search"}
            >
              <Search className="h-5 w-5 flex-shrink-0" />
              {showExpanded && (
                <span className="text-[15px] font-medium">Search</span>
              )}
              {showExpanded && (
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded px-1.5 font-mono text-[11px] font-medium text-black opacity-100 bg-black/5">
                  <span className="text-xs">⌘</span>K
                </kbd>
              )}
            </Button>
          </div>
        )}

        {/* Navigation Sections */}
        {visibleNavigation.map((section, sectionIndex) => {
          const isGroupCollapsed = section.heading ? (groupCollapsedState[section.heading] || false) : false;
          
          return (
            <div className={sectionIndex === 0 ? "" : "mt-4"} key={section.heading || `section-${sectionIndex}`}>
              {/* Section Header with Collapse Trigger */}
              {section.heading && showExpanded && (
                <button
                  onClick={() => toggleGroup(section.heading!)}
                  className={cn(
                    "w-full h-8 rounded-md flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider opacity-70 pl-3 pr-1 py-1 mb-2 hover:opacity-100 transition-all duration-100 hover:bg-black/5",
                    sectionIndex === 0 ? "mt-0" : "mt-2",
                  )}
                  data-testid={`button-toggle-section-${section.heading.toLowerCase()}`}
                  aria-label={`Toggle ${section.heading} section`}
                >
                  <span data-testid={`text-section-${section.heading.toLowerCase()}`}>
                    {section.heading}
                  </span>
                  {isGroupCollapsed ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronUp className="h-4 w-4" />
                  )}
                </button>
              )}

              {/* Navigation Items */}
              {!isGroupCollapsed && (
                <ul className="">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isEnabled = item.active !== false;
                    const badge = item.badge;

                    const navItemClasses = cn(
                      "flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 relative",
                      isEnabled &&
                        "hover:bg-[#DAF600] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2",
                      !showExpanded && "justify-center lg:justify-center",
                      !isEnabled &&
                        "opacity-30 cursor-not-allowed pointer-events-none",
                    );

                    return (
                      <li key={item.name}>
                        {isEnabled ? (
                          <a
                            href={item.href}
                            className={navItemClasses}
                            aria-label={showExpanded ? undefined : item.name}
                            data-testid={`link-nav-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                          >
                            <Icon
                              className="h-5 w-5 flex-shrink-0"
                              aria-hidden="true"
                            />
                            {showExpanded && (
                              <span className="text-[15px] font-medium flex-1">
                                {item.name}
                              </span>
                            )}
                            {badge !== undefined && badge !== null && (
                              <span 
                                className={cn(
                                  "rounded-full bg-[#E2FF00] text-black font-bold flex items-center justify-center",
                                  showExpanded 
                                    ? "h-5 min-w-[20px] px-1.5 text-xs" 
                                    : "absolute -top-0.5 -right-0.5 h-3 w-3 text-[8px]"
                                )}
                                data-testid={`badge-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                              >
                                {showExpanded ? (typeof badge === 'number' && badge > 9 ? '9+' : badge) : ''}
                              </span>
                            )}
                          </a>
                        ) : (
                          <div
                            className={navItemClasses}
                            aria-label={showExpanded ? undefined : item.name}
                            data-testid={`link-nav-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                          >
                            <Icon
                              className="h-5 w-5 flex-shrink-0"
                              aria-hidden="true"
                            />
                            {showExpanded && (
                              <span className="text-[15px] font-medium">
                                {item.name}
                              </span>
                            )}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
