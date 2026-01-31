// Mock data generators for simulating real-time metrics

import { StreamHealth, StreamMetrics, StreamMetricsPoint } from "@/types/session";

// Generate realistic varying values
function jitter(base: number, variance: number): number {
  return Math.round(base + (Math.random() - 0.5) * 2 * variance);
}

function jitterFloat(base: number, variance: number, decimals: number = 1): number {
  const value = base + (Math.random() - 0.5) * 2 * variance;
  return parseFloat(value.toFixed(decimals));
}

// Generate mock stream metrics
export function generateMockMetrics(inputId: string, health: StreamHealth): StreamMetrics {
  const isHealthy = health === 'ok';
  const isWarning = health === 'warning';
  const isOff = health === 'off';

  if (isOff) {
    return {
      id: crypto.randomUUID(),
      input_id: inputId,
      video_codec: null,
      video_resolution: null,
      video_fps: null,
      video_bitrate_kbps: null,
      network_rtt_ms: null,
      network_packet_loss: null,
      network_retransmits: null,
      network_jitter_ms: null,
      audio_lufs_m: null,
      audio_lufs_s: null,
      audio_lufs_i: null,
      audio_peak_db: null,
      audio_true_peak_db: null,
      audio_channels: null,
      audio_sample_rate: null,
      updated_at: new Date().toISOString(),
    };
  }

  return {
    id: crypto.randomUUID(),
    input_id: inputId,
    video_codec: 'H.264',
    video_resolution: '1920x1080',
    video_fps: jitterFloat(59.94, 0.5, 2),
    video_bitrate_kbps: jitter(isHealthy ? 8000 : 4500, isHealthy ? 500 : 2000),
    network_rtt_ms: jitter(isHealthy ? 25 : 120, isHealthy ? 5 : 50),
    network_packet_loss: jitterFloat(isHealthy ? 0.1 : (isWarning ? 2.5 : 8), isHealthy ? 0.1 : 1.5),
    network_retransmits: jitter(isHealthy ? 2 : 25, isHealthy ? 2 : 15),
    network_jitter_ms: jitter(isHealthy ? 3 : 15, isHealthy ? 1 : 5),
    audio_lufs_m: jitterFloat(-23, 4),
    audio_lufs_s: jitterFloat(-24, 2),
    audio_lufs_i: jitterFloat(-24, 1),
    audio_peak_db: jitterFloat(isWarning ? -0.5 : -6, 2),
    audio_true_peak_db: jitterFloat(isWarning ? 0.5 : -5, 1.5),
    audio_channels: '2.0 (Stereo)',
    audio_sample_rate: 48000,
    updated_at: new Date().toISOString(),
  };
}

// Generate time-series points for charts
export function generateMockMetricsHistory(
  inputId: string,
  health: StreamHealth,
  durationSeconds: number = 60
): StreamMetricsPoint[] {
  const points: StreamMetricsPoint[] = [];
  const now = Date.now();
  const isHealthy = health === 'ok';
  const isOff = health === 'off';

  if (isOff) return [];

  for (let i = durationSeconds; i >= 0; i--) {
    const timestamp = new Date(now - i * 1000).toISOString();
    points.push({
      id: crypto.randomUUID(),
      input_id: inputId,
      timestamp,
      bitrate_kbps: jitter(isHealthy ? 8000 : 5000, isHealthy ? 300 : 1500),
      packet_loss: jitterFloat(isHealthy ? 0.1 : 3, isHealthy ? 0.1 : 2),
      rtt_ms: jitter(isHealthy ? 25 : 100, isHealthy ? 5 : 40),
      lufs_m: jitterFloat(-23, 5),
    });
  }

  return points;
}

// Mock input configurations for demo
export const mockInputConfigs = [
  { position: 1, name: 'Primary Feed', mode: 'caller' as const, health: 'ok' as StreamHealth },
  { position: 2, name: 'Backup Path', mode: 'listener' as const, health: 'warning' as StreamHealth },
  { position: 3, name: 'Commentary', mode: 'caller' as const, health: 'ok' as StreamHealth },
  { position: 4, name: 'Graphics', mode: 'caller' as const, health: 'off' as StreamHealth },
];

// Simulate health status changes
export function simulateHealthChange(currentHealth: StreamHealth): StreamHealth {
  const rand = Math.random();
  
  if (currentHealth === 'off') {
    return rand < 0.02 ? 'ok' : 'off';
  }
  
  if (currentHealth === 'ok') {
    if (rand < 0.02) return 'warning';
    if (rand < 0.005) return 'error';
    return 'ok';
  }
  
  if (currentHealth === 'warning') {
    if (rand < 0.1) return 'ok';
    if (rand < 0.02) return 'error';
    return 'warning';
  }
  
  // error state
  if (rand < 0.05) return 'warning';
  if (rand < 0.01) return 'ok';
  return 'error';
}
