import { useState } from 'react';
import { StreamMetricsPoint, SessionMarker, StreamHealth } from '@/types/session';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, ReferenceLine } from 'recharts';

type TimeWindow = '30s' | '2m' | '10m';

interface QualityTimelineTabProps {
  inputName: string;
  history: StreamMetricsPoint[];
  markers: SessionMarker[];
  onMarkerClick?: (marker: SessionMarker) => void;
}

export function QualityTimelineTab({ inputName, history, markers, onMarkerClick }: QualityTimelineTabProps) {
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('2m');

  const getWindowSeconds = (window: TimeWindow) => {
    switch (window) {
      case '30s': return 30;
      case '2m': return 120;
      case '10m': return 600;
    }
  };

  const windowData = history.slice(-getWindowSeconds(timeWindow));

  if (windowData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No timeline data available
      </div>
    );
  }

  const MiniChart = ({ 
    data, 
    dataKey, 
    label, 
    color,
    domain,
    formatValue,
  }: { 
    data: any[]; 
    dataKey: string; 
    label: string; 
    color: string;
    domain?: [number, number];
    formatValue?: (v: number) => string;
  }) => {
    const lastValue = data[data.length - 1]?.[dataKey];
    
    return (
      <div className="bg-tile rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">{label}</span>
          <span className="text-xs font-mono text-foreground">
            {lastValue !== null && lastValue !== undefined 
              ? (formatValue ? formatValue(lastValue) : lastValue.toFixed(1))
              : '--'}
          </span>
        </div>
        <div className="h-12">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <YAxis domain={domain || ['auto', 'auto']} hide />
              <XAxis dataKey="timestamp" hide />
              <ReferenceLine x={data[data.length - 1]?.timestamp} stroke="hsl(var(--primary))" strokeDasharray="2 2" />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const chartData = windowData.map(p => ({
    timestamp: new Date(p.timestamp).getTime(),
    bitrate_kbps: p.bitrate_kbps,
    packet_loss: p.packet_loss,
    rtt_ms: p.rtt_ms,
    lufs_m: p.lufs_m,
  }));

  return (
    <div className="p-4 space-y-4 overflow-auto h-full">
      {/* Header with time window selector */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{inputName}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Quality Timeline</p>
        </div>
        <div className="flex gap-1">
          {(['30s', '2m', '10m'] as TimeWindow[]).map((window) => (
            <Button
              key={window}
              variant={timeWindow === window ? 'secondary' : 'ghost'}
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => setTimeWindow(window)}
            >
              {window}
            </Button>
          ))}
        </div>
      </div>

      {/* Stacked mini-charts */}
      <div className="space-y-3">
        <MiniChart
          data={chartData}
          dataKey="bitrate_kbps"
          label="Bitrate"
          color="hsl(var(--primary))"
          formatValue={(v) => `${(v / 1000).toFixed(1)} Mbps`}
        />
        <MiniChart
          data={chartData}
          dataKey="packet_loss"
          label="Packet Loss"
          color="hsl(var(--status-error))"
          domain={[0, 5]}
          formatValue={(v) => `${v.toFixed(2)}%`}
        />
        <MiniChart
          data={chartData}
          dataKey="rtt_ms"
          label="RTT"
          color="hsl(var(--status-warning))"
          formatValue={(v) => `${Math.round(v)} ms`}
        />
        <MiniChart
          data={chartData}
          dataKey="lufs_m"
          label="LUFS-M"
          color="hsl(var(--status-ok))"
          domain={[-40, 0]}
          formatValue={(v) => `${v.toFixed(1)} LUFS`}
        />
      </div>

      {/* QC Markers */}
      {markers.length > 0 && (
        <section>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            QC Markers
          </h4>
          <div className="space-y-1">
            {markers.slice(-5).map((marker) => (
              <button
                key={marker.id}
                onClick={() => onMarkerClick?.(marker)}
                className={cn(
                  'w-full text-left p-2 rounded bg-tile hover:bg-tile/80 transition-colors',
                  'border-l-2',
                  marker.severity === 'warning' && 'border-status-warning',
                  marker.severity === 'error' && 'border-status-error',
                  marker.severity === 'ok' && 'border-status-ok'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">{marker.label}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {formatTimestamp(marker.timestamp_ms)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function formatTimestamp(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
