import { useNavigate } from "react-router-dom";
import { MonitorPlay, Plus, Users, Radio, Eye, FileText, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
            <MonitorPlay className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-wide text-foreground">
              TECQ SRT
            </span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Live Review
            </span>
          </div>
        </div>
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
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-panel border border-border text-xs font-medium text-muted-foreground">
            <Radio className="w-3 h-3 text-status-ok animate-pulse" />
            Real-time SRT Validation
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
            Live SRT review.
            <br />
            <span className="text-muted-foreground">Shared decisions.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Validate live SRT contribution streams with multiple engineers at once.
            One ingest. Real-time playback, metrics, audio levels, and shared notes.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={() => navigate("/create")}
              className="min-w-[200px] gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Review Session
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/join")}
              className="min-w-[200px] gap-2"
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
            title="Multi-stream Monitoring"
            description="View up to 4 SRT inputs simultaneously in a broadcast-grade multiview."
          />
          <FeatureCard
            icon={Activity}
            title="Real-time Metrics"
            description="Live bitrate, RTT, packet loss, audio loudness (LUFS), and peak levels."
          />
          <FeatureCard
            icon={FileText}
            title="Collaborative Notes"
            description="Shared session notes with timestamped QC markers synced across all viewers."
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          Built for broadcast engineers, streaming ops, and incident triage.
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-lg bg-panel border border-border space-y-3">
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
