import { useState } from 'react';
import { Grid2X2, LayoutPanelLeft, LayoutPanelTop } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StreamTile } from './StreamTile';
import { cn } from '@/lib/utils';
import { StreamHealth, StreamMetrics } from '@/types/session';

type LayoutType = '2x2' | '1+3-right' | '1+3-left';

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
  onInputSelect: (position: number) => void;
  onAudioSelect: (position: number) => void;
  onInspect: (position: number) => void;
}

export function MultiviewCanvas({
  inputs,
  selectedInput,
  activeAudioInput,
  onInputSelect,
  onAudioSelect,
  onInspect,
}: MultiviewCanvasProps) {
  const [layout, setLayout] = useState<LayoutType>('2x2');

  const handleFullscreen = (position: number) => {
    const tile = document.querySelector(`[data-stream-position="${position}"]`);
    if (tile && document.fullscreenEnabled) {
      tile.requestFullscreen?.();
    }
  };

  const sortedInputs = [...inputs].sort((a, b) => a.position - b.position);
  
  // Ensure we have 4 slots
  const slots = [1, 2, 3, 4].map(pos => 
    sortedInputs.find(i => i.position === pos) || {
      id: `empty-${pos}`,
      position: pos,
      name: `Input ${pos}`,
      health: 'off' as StreamHealth,
      metrics: null,
    }
  );

  const renderGrid = () => {
    switch (layout) {
      case '2x2':
        return (
          <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full">
            {slots.map((input) => (
              <div key={input.position} data-stream-position={input.position}>
                <StreamTile
                  position={input.position}
                  name={input.name}
                  health={input.health}
                  metrics={input.metrics}
                  isAudioActive={activeAudioInput === input.position}
                  isSelected={selectedInput === input.position}
                  onSelect={() => onInputSelect(input.position)}
                  onAudioToggle={() => onAudioSelect(input.position)}
                  onInspect={() => onInspect(input.position)}
                  onFullscreen={() => handleFullscreen(input.position)}
                />
              </div>
            ))}
          </div>
        );

      case '1+3-right':
        return (
          <div className="grid grid-cols-4 gap-2 h-full">
            <div className="col-span-3" data-stream-position={slots[0].position}>
              <StreamTile
                position={slots[0].position}
                name={slots[0].name}
                health={slots[0].health}
                metrics={slots[0].metrics}
                isAudioActive={activeAudioInput === slots[0].position}
                isSelected={selectedInput === slots[0].position}
                onSelect={() => onInputSelect(slots[0].position)}
                onAudioToggle={() => onAudioSelect(slots[0].position)}
                onInspect={() => onInspect(slots[0].position)}
                onFullscreen={() => handleFullscreen(slots[0].position)}
              />
            </div>
            <div className="col-span-1 flex flex-col gap-2">
              {slots.slice(1).map((input) => (
                <div key={input.position} className="flex-1" data-stream-position={input.position}>
                  <StreamTile
                    position={input.position}
                    name={input.name}
                    health={input.health}
                    metrics={input.metrics}
                    isAudioActive={activeAudioInput === input.position}
                    isSelected={selectedInput === input.position}
                    onSelect={() => onInputSelect(input.position)}
                    onAudioToggle={() => onAudioSelect(input.position)}
                    onInspect={() => onInspect(input.position)}
                    onFullscreen={() => handleFullscreen(input.position)}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case '1+3-left':
        return (
          <div className="grid grid-cols-4 gap-2 h-full">
            <div className="col-span-1 flex flex-col gap-2">
              {slots.slice(1).map((input) => (
                <div key={input.position} className="flex-1" data-stream-position={input.position}>
                  <StreamTile
                    position={input.position}
                    name={input.name}
                    health={input.health}
                    metrics={input.metrics}
                    isAudioActive={activeAudioInput === input.position}
                    isSelected={selectedInput === input.position}
                    onSelect={() => onInputSelect(input.position)}
                    onAudioToggle={() => onAudioSelect(input.position)}
                    onInspect={() => onInspect(input.position)}
                    onFullscreen={() => handleFullscreen(input.position)}
                  />
                </div>
              ))}
            </div>
            <div className="col-span-3" data-stream-position={slots[0].position}>
              <StreamTile
                position={slots[0].position}
                name={slots[0].name}
                health={slots[0].health}
                metrics={slots[0].metrics}
                isAudioActive={activeAudioInput === slots[0].position}
                isSelected={selectedInput === slots[0].position}
                onSelect={() => onInputSelect(slots[0].position)}
                onAudioToggle={() => onAudioSelect(slots[0].position)}
                onInspect={() => onInspect(slots[0].position)}
                onFullscreen={() => handleFullscreen(slots[0].position)}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Layout switcher */}
      <div className="flex items-center gap-1 p-2 border-b border-border bg-panel">
        <span className="text-xs text-muted-foreground mr-2">Layout</span>
        <Button
          variant={layout === '2x2' ? 'secondary' : 'ghost'}
          size="icon"
          className="h-7 w-7"
          onClick={() => setLayout('2x2')}
        >
          <Grid2X2 className="w-4 h-4" />
        </Button>
        <Button
          variant={layout === '1+3-right' ? 'secondary' : 'ghost'}
          size="icon"
          className="h-7 w-7"
          onClick={() => setLayout('1+3-right')}
        >
          <LayoutPanelLeft className="w-4 h-4" />
        </Button>
        <Button
          variant={layout === '1+3-left' ? 'secondary' : 'ghost'}
          size="icon"
          className="h-7 w-7"
          onClick={() => setLayout('1+3-left')}
        >
          <LayoutPanelTop className="w-4 h-4 rotate-90" />
        </Button>
      </div>

      {/* Canvas area */}
      <div className="flex-1 p-2 bg-background">
        {renderGrid()}
      </div>
    </div>
  );
}
