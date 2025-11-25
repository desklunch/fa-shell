import { ReactNode, useState } from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import type { Breadcrumb, ActionButton } from "../types/layout";

interface PageLayoutProps {
  children: ReactNode;
  breadcrumbs?: Breadcrumb[];
  actionButton?: ActionButton;
  customHeaderAction?: ReactNode;
}

/**
 * Main page layout component that orchestrates the sidebar and header
 * Handles mobile menu state and search functionality
 */
export default function PageLayout({ 
  children, 
  breadcrumbs, 
  actionButton,
  customHeaderAction
}: PageLayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex flex-col bg-[#E3D8CD] overflow-hidden overscroll-contain w-screen h-screen">
      <div className="flex flex-1 rounded-none md:rounded-xl ring ring-[1.5px] ring-black/5 shadow-lg overflow-hidden overscroll-contain md:m-4 shadow-4xl">
        <Sidebar
          isMobileOpen={isMobileOpen}
          onMobileClose={() => setIsMobileOpen(false)}
        />
        <main className="flex flex-col overflow-x-hidden bg-background w-full">
          <Header
            isMobileOpen={isMobileOpen}
            onToggle={() => setIsMobileOpen(!isMobileOpen)}
            breadcrumbs={breadcrumbs}
            actionButton={actionButton}
            customAction={customHeaderAction}
          />
          {children}
        </main>
      </div>
    </div>
  );
}
