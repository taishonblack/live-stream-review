import { useState, useEffect } from 'react';
import { Clock, Users, Radio } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { StreamHealth } from '@/types/session';

interface StatusChip {
  position: number;
  name: string;
  health: StreamHealth;
}

interface StatusStripProps {
  sessionTitle: string;
  isLive: boolean;
  startedAt: Date | null;
  viewerCount: number;
  statusChips: StatusChip[];
  selectedInput: number | null;
  onInputSelect: (position: number) => void;
}

export function StatusStrip({
  sessionTitle,
  isLive,
  startedAt,
  viewerCount,
  statusChips,
  selectedInput,
  onInputSelect,
}: StatusStripProps) {
  const [elapsed, setElapsed] = useState('00:00:00');

  useEffect(() => {
    if (!isLive || !startedAt) return;

    const updateElapsed = () => {
      const diff = Date.now() - startedAt.getTime();
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setElapsed(
        `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [isLive, startedAt]);

  const getHealthColor = (health: StreamHealth) => {
    switch (health) {
      case 'ok':
        return 'bg-status-ok/20 text-status-ok border-status-ok/30';
      case 'warning':
        return 'bg-status-warning/20 text-status-warning border-status-warning/30';
      case 'error':
        return 'bg-status-error/20 text-status-error border-status-error/30';
      case 'off':
        return 'bg-status-off/20 text-status-off border-status-off/30';
    }
  };

  const getHealthLabel = (health: StreamHealth) => {
    switch (health) {
      case 'ok':
        return 'OK';
      case 'warning':
        return 'WARN';
      case 'error':
        return 'ERR';
      case 'off':
        return 'OFF';
    }
  };

  return (
    <div className="h-12 bg-panel border-b border-border flex items-center justify-between px-4">
      {/* Left: Title and Live indicator */}
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-semibold text-foreground truncate max-w-[200px]">
          {sessionTitle}
        </h1>
        {isLive ? (
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-status-error/20 text-status-error border-status-error/30 animate-pulse"
            >
              <Radio className="w-3 h-3 mr-1" />
              LIVE
            </Badge>
            <span className="font-mono text-xs text-muted-foreground">{elapsed}</span>
          </div>
        ) : (
          <Badge variant="outline" className="bg-muted text-muted-foreground">
            DRAFT
          </Badge>
        )}
      </div>

      {/* Center: Input status chips */}
      <div className="flex items-center gap-2">
        {statusChips.map((chip) => (
          <button
            key={chip.position}
            onClick={() => onInputSelect(chip.position)}
            className={cn(
              'flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium transition-all',
              'border hover:border-primary/50',
              getHealthColor(chip.health),
              selectedInput === chip.position && 'ring-1 ring-primary ring-offset-1 ring-offset-background'
            )}
          >
            <span className="font-mono">{chip.position}</span>
            <span className="hidden sm:inline text-[10px] opacity-80">{getHealthLabel(chip.health)}</span>
          </button>
        ))}
      </div>

      {/* Right: Viewer count */}
      <div className="flex items-center gap-4 text-muted-foreground">
        <div className="flex items-center gap-1.5 text-xs">
          <Users className="w-3.5 h-3.5" />
          <span>{viewerCount}</span>
        </div>
      </div>
    </div>
  );
}
