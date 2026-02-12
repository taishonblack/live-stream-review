import { useCallback, useSyncExternalStore, useEffect } from 'react';
import { loadPreferences, savePreferences, type Preferences } from '@/lib/preferences';

let listeners: (() => void)[] = [];
let snapshot = loadPreferences();

function subscribe(cb: () => void) {
  listeners.push(cb);
  return () => { listeners = listeners.filter(l => l !== cb); };
}

function getSnapshot() {
  return snapshot;
}

function update(patch: Partial<Preferences>) {
  snapshot = { ...snapshot, ...patch };
  savePreferences(snapshot);
  listeners.forEach(l => l());
}

function applyThemeClass(theme: string) {
  const root = document.documentElement;
  if (theme === 'light') {
    root.classList.add('light');
  } else {
    root.classList.remove('light');
  }
}

// Apply on load
applyThemeClass(snapshot.theme);

export function usePreferences() {
  const prefs = useSyncExternalStore(subscribe, getSnapshot);

  useEffect(() => {
    applyThemeClass(prefs.theme);
  }, [prefs.theme]);

  const setPref = useCallback(<K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    update({ [key]: value });
  }, []);
  return { prefs, setPref };
}
