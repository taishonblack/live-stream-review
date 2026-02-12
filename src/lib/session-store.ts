// localStorage persistence for mock session state

const KEY = 'tecq_srt_session_v1';

export interface StoredSession {
  id: string;
  title: string;
  purpose: string;
  createdAt: number;
  inputs: StoredInput[];
  isLive: boolean;
  startedAt: number | null;
}

export interface StoredInput {
  position: number;
  name: string;
  mode: 'caller' | 'listener';
  host: string;
  port: number | null;
  passphrase: string | null;
  latency_ms: number;
  enabled: boolean;
}

export function saveSession(session: StoredSession) {
  localStorage.setItem(KEY, JSON.stringify(session));
}

export function loadSession(id?: string): StoredSession | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    const session = JSON.parse(raw) as StoredSession;
    if (id && session.id !== id) return null;
    return session;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(KEY);
}
