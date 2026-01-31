// Session types matching database schema

export type SessionStatus = 'draft' | 'live' | 'ended';
export type SrtMode = 'caller' | 'listener';
export type AppRole = 'owner' | 'commenter' | 'viewer';
export type StreamHealth = 'ok' | 'warning' | 'error' | 'off';

export interface Session {
  id: string;
  owner_id: string;
  title: string;
  purpose: string;
  status: SessionStatus;
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SessionInput {
  id: string;
  session_id: string;
  position: number;
  name: string;
  mode: SrtMode;
  host: string | null;
  port: number | null;
  passphrase: string | null;
  latency_ms: number;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface SessionStream {
  id: string;
  input_id: string;
  webrtc_url: string | null;
  health: StreamHealth;
  created_at: string;
  updated_at: string;
}

export interface SessionMember {
  id: string;
  session_id: string;
  user_id: string;
  role: AppRole;
  joined_at: string;
  profile?: Profile;
}

export interface SessionInvite {
  id: string;
  session_id: string;
  token: string;
  role: AppRole;
  expires_at: string;
  max_uses: number | null;
  use_count: number;
  created_by: string | null;
  created_at: string;
}

export interface SessionNote {
  id: string;
  session_id: string;
  content: string;
  updated_at: string;
  updated_by: string | null;
}

export interface SessionMarker {
  id: string;
  session_id: string;
  input_id: string | null;
  timestamp_ms: number;
  label: string;
  severity: StreamHealth;
  note: string | null;
  created_by: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface StreamMetrics {
  id: string;
  input_id: string;
  video_codec: string | null;
  video_resolution: string | null;
  video_fps: number | null;
  video_bitrate_kbps: number | null;
  network_rtt_ms: number | null;
  network_packet_loss: number | null;
  network_retransmits: number | null;
  network_jitter_ms: number | null;
  audio_lufs_m: number | null;
  audio_lufs_s: number | null;
  audio_lufs_i: number | null;
  audio_peak_db: number | null;
  audio_true_peak_db: number | null;
  audio_channels: string | null;
  audio_sample_rate: number | null;
  updated_at: string;
}

export interface StreamMetricsPoint {
  id: string;
  input_id: string;
  timestamp: string;
  bitrate_kbps: number | null;
  packet_loss: number | null;
  rtt_ms: number | null;
  lufs_m: number | null;
}

// Extended types for UI
export interface SessionInputWithStream extends SessionInput {
  stream?: SessionStream;
  metrics?: StreamMetrics;
}

export interface SessionWithDetails extends Session {
  inputs: SessionInputWithStream[];
  members: SessionMember[];
  notes?: SessionNote;
  markers: SessionMarker[];
}
