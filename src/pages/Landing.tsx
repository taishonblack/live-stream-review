import { useNavigate } from "react-router-dom";
import { Plus, Users, Eye, FileText, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TecqLogo } from "@/components/brand/TecqLogo";
import { MetroHeroLines } from "@/components/brand/MetroHeroLines";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen metro-bg flex flex-col relative overflow-hidden">
      {/* Metro hero lines background */}
      <MetroHeroLines className="opacity-60" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-border bg-panel/80 backdrop-blur-sm">
        <TecqLogo size="md" />
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => navigate("/auth")}
            className="text-muted-foreground hover:text-foreground"
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-panel/80 backdrop-blur-sm border border-border text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-status-ok animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="w-2 h-2 rounded-full bg-status-warning" />
            </span>
            Real-time Signal Validation
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
            Live SRT review.
            <br />
            <span className="text-muted-foreground">Shared decisions.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Validate live SRT contribution paths in real time.
            Inspect signal health, audio levels, and network behavior — together.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={() => navigate("/create")}
              className="min-w-[200px] gap-2 station-glow"
            >
              <Plus className="w-4 h-4" />
              Create Review Session
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/join")}
              className="min-w-[200px] gap-2 border-border hover:border-primary/50 station-glow"
            >
              <Users className="w-4 h-4" />
              Join Session
            </Button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <FeatureCard
            icon={Eye}
            lineColor="status-ok"
            title="Multi-stream Monitoring"
            description="View up to 4 SRT inputs simultaneously in a broadcast-grade multiview."
          />
          <FeatureCard
            icon={Activity}
            lineColor="primary"
            title="Real-time Metrics"
            description="Live bitrate, RTT, packet loss, audio loudness (LUFS), and peak levels."
          />
          <FeatureCard
            icon={FileText}
            lineColor="status-warning"
            title="Collaborative Notes"
            description="Shared session notes with timestamped QC markers synced across all viewers."
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 border-t border-border bg-panel/50 backdrop-blur-sm text-center">
        <p className="text-xs text-muted-foreground">
          Built for broadcast engineers, streaming ops, and incident triage.
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  lineColor,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  lineColor: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative p-6 rounded-lg bg-panel/80 backdrop-blur-sm border border-border space-y-3 overflow-hidden group">
      {/* Metro line accent */}
      <div 
        className={`absolute left-0 top-0 bottom-0 w-1 bg-${lineColor} opacity-50 group-hover:opacity-100 transition-opacity`}
        style={{ backgroundColor: `hsl(var(--${lineColor}))` }}
      />
      
      {/* Station marker */}
      <div 
        className="absolute left-0 top-6 w-3 h-3 rounded-full -translate-x-1/2"
        style={{ backgroundColor: `hsl(var(--${lineColor}))` }}
      />

      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-tile ml-2">
        <Icon className="w-5 h-5 text-foreground" />
      </div>
      <h3 className="text-sm font-semibold text-foreground ml-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed ml-2">{description}</p>
    </div>
  );
}