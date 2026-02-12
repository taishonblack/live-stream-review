import { useState, useCallback, useSyncExternalStore } from 'react';
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

export function usePreferences() {
  const prefs = useSyncExternalStore(subscribe, getSnapshot);
  const setPref = useCallback(<K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    update({ [key]: value });
  }, []);
  return { prefs, setPref };
}
