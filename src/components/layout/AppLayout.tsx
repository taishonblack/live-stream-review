import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { BottomNav } from "./BottomNav";
import { useResponsiveNav } from "@/hooks/use-responsive-nav";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { layoutMode, navMode, toggleCollapsed, toggleHidden } = useResponsiveNav();
  const isPortrait = layoutMode === "mobilePortrait";

  return (
    <div className="flex min-h-screen w-full bg-background">
      {!isPortrait && (
        <AppSidebar
          navMode={navMode}
          onToggleCollapsed={toggleCollapsed}
          onToggleHidden={toggleHidden}
        />
      )}
      <main className={cn("flex-1 overflow-auto", isPortrait && "pb-24")}>
        {children}
      </main>
      {isPortrait && <BottomNav />}
    </div>
  );
}
