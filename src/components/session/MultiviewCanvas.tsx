import { useCallback, useEffect, useState } from 'react';
import { Grid2X2, Square, Columns2, LayoutPanelLeft, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StreamTile } from './StreamTile';
import { cn } from '@/lib/utils';
import { StreamHealth, StreamMetrics, ViewMode } from '@/types/session';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface StreamInput {
  id: string;
  position: number;
  name: string;
  health: StreamHealth;
  metrics: StreamMetrics | null;
}

interface MultiviewCanvasProps {
  inputs: StreamInput[];
  selectedInput: number | null;
  activeAudioInput: number | null;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  fullscreenInput: number | null;
  onFullscreenChange: (position: number | null) => void;
  onInputSelect: (position: number) => void;
  onAudioSelect: (position: number) => void;
  onInspect: (position: number) => void;
  onEditLine?: (position: number) => void;
}

export function MultiviewCanvas({
  inputs,
  selectedInput,
  activeAudioInput,
  viewMode,
  onViewModeChange,
  fullscreenInput,
  onFullscreenChange,
  onInputSelect,
  onAudioSelect,
  onInspect,
  onEditLine,
}: MultiviewCanvasProps) {

  // Esc to exit fullscreen
  useEffect(() => {
    if (!fullscreenInput) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onFullscreenChange(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fullscreenInput, onFullscreenChange]);

  const sortedInputs = [...inputs].sort((a, b) => a.position - b.position);

  const slots = [1, 2, 3, 4].map(pos =>
    sortedInputs.find(i => i.position === pos) || {
      id: `empty-${pos}`,
      position: pos,
      name: `Input ${pos}`,
      health: 'off' as StreamHealth,
      metrics: null,
    }
  );

  // Determine visible slots based on view mode
  const visibleSlots = (() => {
    const primary = selectedInput ? slots.find(s => s.position === selectedInput) : slots[0];
    switch (viewMode) {
      case '1':
        return primary ? [primary] : [slots[0]];
      case '2':
        return slots.slice(0, 2);
      case '3': {
        // Primary large + 2 others
        const others = slots.filter(s => s.position !== (primary?.position ?? 1)).slice(0, 2);
        return primary ? [primary, ...others] : slots.slice(0, 3);
      }
      case '4':
      default:
        return slots;
    }
  })();

  const tileProps = (input: typeof slots[0]) => ({
    position: input.position,
    name: input.name,
    health: input.health,
    metrics: input.metrics,
    isAudioActive: activeAudioInput === input.position,
    isSelected: selectedInput === input.position,
    onSelect: () => onInputSelect(input.position),
    onAudioToggle: () => onAudioSelect(input.position),
    onInspect: () => onInspect(input.position),
    onFullscreen: () => onFullscreenChange(input.position),
    onEdit: onEditLine ? () => onEditLine(input.position) : undefined,
  });

  // Fullscreen overlay
  if (fullscreenInput) {
    const fsInput = slots.find(s => s.position === fullscreenInput);
    if (!fsInput) return null;
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col">
        {/* Minimal exit bar */}
        <div className="absolute top-3 right-3 z-10">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 bg-panel/80 backdrop-blur-sm border border-border text-muted-foreground hover:text-foreground"
            onClick={() => onFullscreenChange(null)}
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span className="text-xs">Exit (Esc)</span>
          </Button>
        </div>
        <div className="flex-1">
          <StreamTile {...tileProps(fsInput)} />
        </div>
      </div>
    );
  }

  const modeButtons: { mode: ViewMode; icon: typeof Grid2X2; label: string }[] = [
    { mode: '1', icon: Square, label: '1-up' },
    { mode: '2', icon: Columns2, label: '2-up' },
    { mode: '3', icon: LayoutPanelLeft, label: '1+2' },
    { mode: '4', icon: Grid2X2, label: '2×2' },
  ];

  const renderGrid = () => {
    switch (viewMode) {
      case '1':
        return (
          <div className="h-full" data-stream-position={visibleSlots[0]?.position}>
            <StreamTile {...tileProps(visibleSlots[0])} />
          </div>
        );

      case '2':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-full">
            {visibleSlots.map((input) => (
              <div key={input.position} data-stream-position={input.position}>
                <StreamTile {...tileProps(input)} />
              </div>
            ))}
          </div>
        );

      case '3': {
        const [primary, ...others] = visibleSlots;
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 h-full">
            <div className="lg:col-span-2 h-full" data-stream-position={primary.position}>
              <StreamTile {...tileProps(primary)} />
            </div>
            <div className="flex flex-col gap-2">
              {others.map((input) => (
                <div key={input.position} className="flex-1" data-stream-position={input.position}>
                  <StreamTile {...tileProps(input)} />
                </div>
              ))}
            </div>
          </div>
        );
      }

      case '4':
      default:
        return (
          <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full">
            {visibleSlots.map((input) => (
              <div key={input.position} data-stream-position={input.position}>
                <StreamTile {...tileProps(input)} />
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* View mode selector */}
      <div className="flex items-center gap-1 p-2 border-b border-border bg-panel">
        <span className="text-xs text-muted-foreground mr-2 font-mono">View</span>
        {modeButtons.map(({ mode, icon: Icon, label }) => (
          <Tooltip key={mode} delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant={viewMode === mode ? 'secondary' : 'ghost'}
                size="icon"
                className="h-7 w-7"
                onClick={() => onViewModeChange(mode)}
              >
                <Icon className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-panel border-border">
              {label}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      {/* Canvas area */}
      <div className="flex-1 p-2 bg-background">
        {renderGrid()}
      </div>
    </div>
  );
}
