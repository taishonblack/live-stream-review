import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MonitorPlay, Users, Clock, ChevronRight, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Mock session data for now - will be replaced with real data later
const mockSessions = [
  {
    id: "1",
    title: "Champions League Feed QC",
    purpose: "QC",
    status: "live",
    created_at: new Date(Date.now() - 3600000).toISOString(),
    inputs_count: 4,
  },
  {
    id: "2",
    title: "Vendor Test - AWS MediaConnect",
    purpose: "Vendor Test",
    status: "draft",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    inputs_count: 2,
  },
  {
    id: "3",
    title: "Incident #4521 - Audio Sync",
    purpose: "Incident",
    status: "ended",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    inputs_count: 1,
  },
];

const mockSharedSessions = [
  {
    id: "4",
    title: "Premier League Backup Path",
    purpose: "QC",
    status: "live",
    owner: "John Smith",
    inputs_count: 3,
  },
];

export default function Dashboard() {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session?.user) {
          navigate("/auth");
        } else {
          setUser(session.user);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      live: { label: "LIVE", className: "bg-status-ok/20 text-status-ok border-status-ok/30" },
      draft: { label: "DRAFT", className: "bg-muted text-muted-foreground border-border" },
      ended: { label: "ENDED", className: "bg-status-off/20 text-status-off border-status-off/30" },
    };
    const { label, className } = variants[status] || variants.draft;
    return (
      <Badge variant="outline" className={cn("text-[10px] font-semibold", className)}>
        {label}
      </Badge>
    );
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome back, {user?.email?.split("@")[0] || "engineer"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => navigate("/create")} className="gap-2">
              <Plus className="w-4 h-4" />
              New Session
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            icon={MonitorPlay}
            label="Active Sessions"
            value="1"
            className="text-status-ok"
          />
          <StatCard
            icon={Users}
            label="Shared With Me"
            value="1"
          />
          <StatCard
            icon={Clock}
            label="Sessions This Week"
            value="3"
          />
        </div>

        {/* My Sessions */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">My Review Sessions</h2>
          <div className="space-y-2">
            {mockSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onClick={() => navigate(`/session/${session.id}`)}
              />
            ))}
          </div>
        </section>

        {/* Shared Sessions */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Shared With Me</h2>
          <div className="space-y-2">
            {mockSharedSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                shared
                onClick={() => navigate(`/session/${session.id}`)}
              />
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="p-4 rounded-lg bg-panel border border-border">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
          <Icon className={cn("w-5 h-5", className || "text-muted-foreground")} />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}

function SessionCard({
  session,
  shared,
  onClick,
}: {
  session: {
    id: string;
    title: string;
    purpose: string;
    status: string;
    inputs_count: number;
    owner?: string;
  };
  shared?: boolean;
  onClick: () => void;
}) {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      live: { label: "LIVE", className: "bg-status-ok/20 text-status-ok border-status-ok/30" },
      draft: { label: "DRAFT", className: "bg-muted text-muted-foreground border-border" },
      ended: { label: "ENDED", className: "bg-status-off/20 text-status-off border-status-off/30" },
    };
    const { label, className } = variants[status] || variants.draft;
    return (
      <Badge variant="outline" className={cn("text-[10px] font-semibold", className)}>
        {label}
      </Badge>
    );
  };

  return (
    <button
      onClick={onClick}
      className="w-full p-4 rounded-lg bg-panel border border-border hover:border-primary/50 transition-colors text-left group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-tile">
            <MonitorPlay className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-foreground">{session.title}</h3>
              {getStatusBadge(session.status)}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {session.purpose} • {session.inputs_count} input{session.inputs_count !== 1 ? "s" : ""}
              {shared && session.owner && ` • Shared by ${session.owner}`}
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
      </div>
    </button>
  );
}
