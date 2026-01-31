import { useState, useEffect, useCallback } from 'react';
import { StreamHealth, StreamMetrics, StreamMetricsPoint } from '@/types/session';
import { generateMockMetrics, generateMockMetricsHistory, simulateHealthChange } from '@/lib/mock-data';

interface InputState {
  id: string;
  health: StreamHealth;
  metrics: StreamMetrics;
  history: StreamMetricsPoint[];
}

interface UseSessionMetricsOptions {
  inputIds: string[];
  initialHealth?: Record<string, StreamHealth>;
  enabled?: boolean;
}

export function useSessionMetrics({
  inputIds,
  initialHealth = {},
  enabled = true,
}: UseSessionMetricsOptions) {
  const [inputStates, setInputStates] = useState<Map<string, InputState>>(new Map());

  // Initialize states
  useEffect(() => {
    if (!enabled || inputIds.length === 0) return;

    const initial = new Map<string, InputState>();
    inputIds.forEach((id, index) => {
      const health = initialHealth[id] || (['ok', 'warning', 'ok', 'off'][index] as StreamHealth);
      initial.set(id, {
        id,
        health,
        metrics: generateMockMetrics(id, health),
        history: generateMockMetricsHistory(id, health, 60),
      });
    });
    setInputStates(initial);
  }, [inputIds.join(','), enabled]);

  // Update metrics every second
  useEffect(() => {
    if (!enabled || inputStates.size === 0) return;

    const interval = setInterval(() => {
      setInputStates((prev) => {
        const next = new Map(prev);
        
        next.forEach((state, id) => {
          // Occasionally change health status
          const newHealth = simulateHealthChange(state.health);
          const newMetrics = generateMockMetrics(id, newHealth);
          
          // Add new point to history, keep last 600 points (10 min)
          const newPoint: StreamMetricsPoint = {
            id: crypto.randomUUID(),
            input_id: id,
            timestamp: new Date().toISOString(),
            bitrate_kbps: newMetrics.video_bitrate_kbps,
            packet_loss: newMetrics.network_packet_loss,
            rtt_ms: newMetrics.network_rtt_ms,
            lufs_m: newMetrics.audio_lufs_m,
          };
          
          const history = [...state.history.slice(-599), newPoint];
          
          next.set(id, {
            ...state,
            health: newHealth,
            metrics: newMetrics,
            history,
          });
        });
        
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [enabled, inputStates.size]);

  const getInputState = useCallback(
    (inputId: string) => inputStates.get(inputId),
    [inputStates]
  );

  const getAllStates = useCallback(() => Array.from(inputStates.values()), [inputStates]);

  return {
    inputStates,
    getInputState,
    getAllStates,
  };
}
