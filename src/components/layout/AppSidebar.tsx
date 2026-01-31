import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MonitorPlay,
  Plus,
  Link2,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TecqLogo } from "@/components/brand/TecqLogo";

const navItems = [
  { title: "Sessions", url: "/dashboard", icon: MonitorPlay },
  { title: "Create Session", url: "/create", icon: Plus },
  { title: "Join Session", url: "/join", icon: Link2 },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-200",
        collapsed ? "w-[72px]" : "w-[220px]"
      )}
    >
      {/* Brand Block */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        {collapsed ? (
          <div className="flex items-center justify-center w-10 h-10">
            {/* Mini metro icon when collapsed */}
            <svg
              width="32"
              height="32"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 12 H16 Q20 12 20 16 V18"
                stroke="hsl(var(--status-ok))"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M8 20 H18"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M8 28 H16 Q20 28 20 24 V22"
                stroke="hsl(var(--status-warning))"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="20" cy="20" r="4" fill="hsl(var(--primary))" />
              <path
                d="M24 20 H32"
                stroke="hsl(var(--foreground))"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                strokeOpacity="0.5"
              />
            </svg>
          </div>
        ) : (
          <TecqLogo size="md" showSubtitle={true} />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.url);
          const button = (
            <Button
              key={item.title}
              variant="ghost"
              onClick={() => navigate(item.url)}
              className={cn(
                "w-full justify-start gap-3 h-10 px-3",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="text-sm">{item.title}</span>}
            </Button>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.title} delayDuration={0}>
                <TooltipTrigger asChild>{button}</TooltipTrigger>
                <TooltipContent side="right" className="bg-panel border-border">
                  {item.title}
                </TooltipContent>
              </Tooltip>
            );
          }

          return button;
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="px-3 py-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full justify-center text-muted-foreground hover:text-foreground"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 mr-2" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
