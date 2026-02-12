import { useLocation, useNavigate } from "react-router-dom";
import { MonitorPlay, Plus, Link2, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Sessions", url: "/dashboard", icon: MonitorPlay },
  { title: "Create", url: "/create", icon: Plus },
  { title: "Join", url: "/join", icon: Link2 },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-sidebar/95 backdrop-blur-sm">
      <div className="mx-auto grid max-w-lg grid-cols-4 gap-1 px-2 py-2 pb-[calc(env(safe-area-inset-bottom,8px)+8px)]">
        {navItems.map((item) => {
          const active = location.pathname === item.url;
          return (
            <button
              key={item.title}
              onClick={() => navigate(item.url)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-md py-2 transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[11px] font-medium leading-none">{item.title}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
