const PREFS_KEY = 'tecq-preferences';

export type ThemeMode = 'dark' | 'light';

export interface Preferences {
  showMetroBackground: boolean;
  showSignalTopology: boolean;
  theme: ThemeMode;
}

const defaults: Preferences = {
  showMetroBackground: true,
  showSignalTopology: true,
  theme: 'dark',
};

export function loadPreferences(): Preferences {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) return { ...defaults, ...JSON.parse(raw) };
  } catch {}
  return { ...defaults };
}

export function savePreferences(prefs: Preferences): void {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}
