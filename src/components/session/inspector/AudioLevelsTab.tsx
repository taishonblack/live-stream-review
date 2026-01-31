import { StreamMetrics } from '@/types/session';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AudioLevelsTabProps {
  inputName: string;
  metrics: StreamMetrics | null;
}

export function AudioLevelsTab({ inputName, metrics }: AudioLevelsTabProps) {
  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No audio data available
      </div>
    );
  }

  const isHot = metrics.audio_peak_db !== null && metrics.audio_peak_db > -1;
  const isLow = metrics.audio_lufs_i !== null && (metrics.audio_lufs_i < -28 || metrics.audio_lufs_i > -20);
  const truePeakWarn = metrics.audio_true_peak_db !== null && metrics.audio_true_peak_db > 0;

  // Simple meter visualization
  const LevelMeter = ({ value, min, max, label, warn }: { value: number | null; min: number; max: number; label: string; warn?: boolean }) => {
    const percentage = value !== null ? Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100)) : 0;
    
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{label}</span>
          <span className={cn('text-xs font-mono', warn ? 'text-status-warning' : 'text-foreground')}>
            {value !== null ? value.toFixed(1) : '--'} LUFS
          </span>
        </div>
        <div className="h-2 bg-background rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full transition-all duration-150',
              warn ? 'bg-status-warning' : 'bg-primary'
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-6 overflow-auto h-full">
      {/* Header */}
      <div className="pb-2 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{inputName}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Audio Levels</p>
        </div>
        <div className="flex gap-1">
          {isHot && (
            <Badge variant="outline" className="bg-status-error/20 text-status-error border-status-error/30 text-[10px]">
              HOT
            </Badge>
          )}
          {isLow && (
            <Badge variant="outline" className="bg-status-warning/20 text-status-warning border-status-warning/30 text-[10px]">
              LOW
            </Badge>
          )}
        </div>
      </div>

      {/* Loudness meters */}
      <section>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Loudness
        </h4>
        <div className="bg-tile rounded-lg p-4 space-y-4">
          <LevelMeter label="LUFS-M (Momentary)" value={metrics.audio_lufs_m} min={-40} max={0} />
          <LevelMeter label="LUFS-S (Short-term)" value={metrics.audio_lufs_s} min={-40} max={0} />
          <LevelMeter label="LUFS-I (Integrated)" value={metrics.audio_lufs_i} min={-40} max={0} warn={isLow} />
        </div>
      </section>

      {/* Peak levels */}
      <section>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Peak Levels
        </h4>
        <div className="bg-tile rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between py-1.5 border-b border-border/50">
            <span className="text-xs text-muted-foreground">Peak</span>
            <span className={cn('text-xs font-mono', isHot ? 'text-status-error' : 'text-foreground')}>
              {metrics.audio_peak_db !== null ? `${metrics.audio_peak_db.toFixed(1)} dB` : '--'}
            </span>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-xs text-muted-foreground">True Peak</span>
            <span className={cn('text-xs font-mono', truePeakWarn ? 'text-status-error' : 'text-foreground')}>
              {metrics.audio_true_peak_db !== null ? `${metrics.audio_true_peak_db.toFixed(1)} dBTP` : '--'}
            </span>
          </div>
        </div>
      </section>

      {/* Audio format */}
      <section>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Format
        </h4>
        <div className="bg-tile rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between py-1.5 border-b border-border/50">
            <span className="text-xs text-muted-foreground">Channels</span>
            <span className="text-xs font-mono text-foreground">{metrics.audio_channels || '--'}</span>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-xs text-muted-foreground">Sample Rate</span>
            <span className="text-xs font-mono text-foreground">
              {metrics.audio_sample_rate ? `${metrics.audio_sample_rate / 1000} kHz` : '--'}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
