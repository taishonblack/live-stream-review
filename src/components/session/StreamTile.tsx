import { useState } from 'react';
import { Volume2, VolumeX, Maximize, Info, Wifi, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { StreamHealth, StreamMetrics } from '@/types/session';

interface StreamTileProps {
  position: number;
  name: string;
  health: StreamHealth;
  metrics: StreamMetrics | null;
  isAudioActive: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onAudioToggle: () => void;
  onInspect: () => void;
  onFullscreen: () => void;
  onEdit?: () => void;
}

export function StreamTile({
  position,
  name,
  health,
  metrics,
  isAudioActive,
  isSelected,
  onSelect,
  onAudioToggle,
  onInspect,
  onFullscreen,
  onEdit,
}: StreamTileProps) {
  const isOff = health === 'off';

  const getHealthBadge = () => {
    const variants: Record<StreamHealth, { label: string; className: string }> = {
      ok: { label: 'LIVE', className: 'bg-status-ok/20 text-status-ok border-status-ok/30' },
      warning: { label: 'WARN', className: 'bg-status-warning/20 text-status-warning border-status-warning/30' },
      error: { label: 'ERROR', className: 'bg-status-error/20 text-status-error border-status-error/30' },
      off: { label: 'OFF', className: 'bg-status-off/20 text-status-off border-status-off/30' },
    };
    const { label, className } = variants[health];
    return (
      <Badge variant="outline" className={cn('text-[10px] font-semibold', className)}>
        {label}
      </Badge>
    );
  };

  return (
    <div
      onClick={onSelect}
      data-stream-position={position}
      className={cn(
        'relative bg-tile rounded-lg overflow-hidden cursor-pointer transition-all group tile-station',
        'border-2',
        isSelected ? 'border-primary' : 'border-border hover:border-primary/30',
        isOff && 'opacity-60'
      )}
    >
      {/* Video placeholder / content area */}
      <div className="aspect-video bg-background/50 flex items-center justify-center relative">
        {isOff ? (
          <div className="text-center text-muted-foreground">
            <Wifi className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <span className="text-xs">No Signal</span>
          </div>
        ) : (
          <>
            <div className="w-full h-full absolute inset-0 bg-gradient-to-br from-tile to-background/80" />
            <span className="relative text-xs font-mono">Stream {position}</span>
            
            {/* Animated metro line border for live streams */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none"
              preserveAspectRatio="none"
            >
              <rect
                x="2"
                y="2"
                width="calc(100% - 4px)"
                height="calc(100% - 4px)"
                fill="none"
                stroke={health === 'ok' ? 'hsl(var(--status-ok))' : health === 'warning' ? 'hsl(var(--status-warning))' : 'transparent'}
                strokeWidth="1"
                rx="6"
                className="metro-line-animated"
                opacity="0.3"
              />
            </svg>
          </>
        )}
      </div>

      {/* Top overlay: Name and status */}
      <div className="absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black/70 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Station marker */}
            <span 
              className={cn(
                "w-3 h-3 rounded-full border-2 border-current",
                health === 'ok' && "text-status-ok bg-status-ok/30",
                health === 'warning' && "text-status-warning bg-status-warning/30",
                health === 'error' && "text-status-error bg-status-error/30",
                health === 'off' && "text-status-off bg-status-off/30"
              )}
            />
            <span className="font-mono text-xs text-white/80 bg-black/40 px-1.5 py-0.5 rounded">
              {position}
            </span>
            <span className="text-xs font-medium text-white truncate max-w-[120px]">{name}</span>
          </div>
          {getHealthBadge()}
        </div>
      </div>

      {/* Bottom overlay: Metrics */}
      {!isOff && metrics && (
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
          <div className="flex items-center justify-between text-[10px] font-mono text-white/80">
            <span>{metrics.video_bitrate_kbps ? `${(metrics.video_bitrate_kbps / 1000).toFixed(1)} Mbps` : '--'}</span>
            <span className={cn(
              metrics.network_packet_loss && metrics.network_packet_loss > 1 ? 'text-status-warning' : ''
            )}>
              {metrics.network_packet_loss !== null ? `${metrics.network_packet_loss.toFixed(1)}% loss` : '--'}
            </span>
          </div>
        </div>
      )}

      {/* Control buttons (show on hover) */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 bg-black/50 hover:bg-black/70 text-white station-glow"
          onClick={(e) => {
            e.stopPropagation();
            onAudioToggle();
          }}
        >
          {isAudioActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 bg-black/50 hover:bg-black/70 text-white station-glow"
          onClick={(e) => {
            e.stopPropagation();
            onInspect();
          }}
        >
          <Info className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 bg-black/50 hover:bg-black/70 text-white station-glow"
          onClick={(e) => {
            e.stopPropagation();
            onFullscreen();
          }}
        >
          <Maximize className="w-3.5 h-3.5" />
        </Button>
        {onEdit && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 bg-black/50 hover:bg-black/70 text-white station-glow"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>

      {/* Audio indicator */}
      {isAudioActive && !isOff && (
        <div className="absolute bottom-2 left-2">
          <div className="flex items-center gap-1 bg-primary/90 text-primary-foreground px-1.5 py-0.5 rounded text-[10px]">
            <Volume2 className="w-3 h-3" />
            <span>Audio</span>
          </div>
        </div>
      )}
    </div>
  );
}
