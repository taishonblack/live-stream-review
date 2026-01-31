import { StreamMetrics, StreamMetricsPoint } from '@/types/session';
import { cn } from '@/lib/utils';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

interface StreamDetailsTabProps {
  inputName: string;
  metrics: StreamMetrics | null;
  history: StreamMetricsPoint[];
}

export function StreamDetailsTab({ inputName, metrics, history }: StreamDetailsTabProps) {
  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No stream data available
      </div>
    );
  }

  const last60 = history.slice(-60);

  const MetricRow = ({ label, value, unit, warn }: { label: string; value: string | number | null; unit?: string; warn?: boolean }) => (
    <div className="flex items-center justify-between py-1.5 border-b border-border/50">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={cn('text-xs font-mono', warn ? 'text-status-warning' : 'text-foreground')}>
        {value ?? '--'}{unit && value !== null ? ` ${unit}` : ''}
      </span>
    </div>
  );

  const Sparkline = ({ data, dataKey, color, domain }: { data: any[]; dataKey: string; color: string; domain?: [number, number] }) => (
    <div className="h-8 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <YAxis domain={domain || ['auto', 'auto']} hide />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={1}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="p-4 space-y-6 overflow-auto h-full">
      {/* Input name header */}
      <div className="pb-2 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">{inputName}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Stream Details</p>
      </div>

      {/* Video section */}
      <section>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Video
        </h4>
        <div className="bg-tile rounded-lg p-3">
          <MetricRow label="Codec" value={metrics.video_codec} />
          <MetricRow label="Resolution" value={metrics.video_resolution} />
          <MetricRow label="Frame Rate" value={metrics.video_fps?.toFixed(2)} unit="fps" />
          <MetricRow 
            label="Bitrate" 
            value={metrics.video_bitrate_kbps ? (metrics.video_bitrate_kbps / 1000).toFixed(2) : null} 
            unit="Mbps" 
          />
          {last60.length > 0 && (
            <div className="mt-2 pt-2 border-t border-border/30">
              <span className="text-[10px] text-muted-foreground">Bitrate (60s)</span>
              <Sparkline 
                data={last60.map(p => ({ value: p.bitrate_kbps }))} 
                dataKey="value" 
                color="hsl(var(--primary))" 
              />
            </div>
          )}
        </div>
      </section>

      {/* Network section */}
      <section>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Network
        </h4>
        <div className="bg-tile rounded-lg p-3">
          <MetricRow label="RTT" value={metrics.network_rtt_ms} unit="ms" warn={metrics.network_rtt_ms !== null && metrics.network_rtt_ms > 100} />
          <MetricRow 
            label="Packet Loss" 
            value={metrics.network_packet_loss?.toFixed(2)} 
            unit="%" 
            warn={metrics.network_packet_loss !== null && metrics.network_packet_loss > 1}
          />
          <MetricRow label="Retransmits" value={metrics.network_retransmits} warn={metrics.network_retransmits !== null && metrics.network_retransmits > 10} />
          <MetricRow label="Jitter" value={metrics.network_jitter_ms} unit="ms" warn={metrics.network_jitter_ms !== null && metrics.network_jitter_ms > 10} />
          {last60.length > 0 && (
            <>
              <div className="mt-2 pt-2 border-t border-border/30">
                <span className="text-[10px] text-muted-foreground">RTT (60s)</span>
                <Sparkline 
                  data={last60.map(p => ({ value: p.rtt_ms }))} 
                  dataKey="value" 
                  color="hsl(var(--status-warning))" 
                />
              </div>
              <div className="mt-2">
                <span className="text-[10px] text-muted-foreground">Packet Loss (60s)</span>
                <Sparkline 
                  data={last60.map(p => ({ value: p.packet_loss }))} 
                  dataKey="value" 
                  color="hsl(var(--status-error))" 
                  domain={[0, 5]}
                />
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
