import { useEffect, useRef, useState } from 'react';
import { CATALOG } from './catalog';
const KEY = 'galactic-atlas.watch.v1';
const validIds = new Set(CATALOG.map(item => item.id));
function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {ids: new Set<string>(), warning: ''};
    const data = JSON.parse(raw);
    if (data.version !== 1 || !Array.isArray(data.watchedIds)) throw new Error('Invalid saved progress');
    return {ids: new Set<string>(data.watchedIds.filter((id: unknown) => typeof id === 'string' && validIds.has(id))), warning: ''};
  } catch { return {ids: new Set<string>(), warning: 'Saved progress could not be read. You can still track titles during this visit.'}; }
}
export function useWatchProgress() {
  const [initial] = useState(read);
  const [watchedIds, setWatchedIds] = useState(initial.ids);
  const [storageWarning, setWarning] = useState(initial.warning);
  const currentIds = useRef(watchedIds);
  const unsaved = useRef(false);
  useEffect(() => {
    const syncProgress = (event: StorageEvent) => {
      if (event.key !== KEY && event.key !== null) return;
      try { if (event.storageArea !== localStorage) return; } catch { return; }
      if (unsaved.current) return;
      const saved = read();
      if (!saved.warning) { currentIds.current = saved.ids; setWatchedIds(saved.ids); }
      setWarning(saved.warning);
    };
    window.addEventListener('storage', syncProgress);
    return () => window.removeEventListener('storage', syncProgress);
  }, []);
  function toggleWatched(id: string) {
    if (!validIds.has(id)) return;
    const saved = read();
    const next = new Set(!unsaved.current && !saved.warning ? saved.ids : currentIds.current);
    next.has(id) ? next.delete(id) : next.add(id);
    currentIds.current = next;
    setWatchedIds(next);
    try { localStorage.setItem(KEY, JSON.stringify({version: 1, watchedIds: [...next]})); unsaved.current = false; setWarning(''); }
    catch { unsaved.current = true; setWarning('This browser could not save progress. Export it before closing this visit.'); }
  }
  function exportProgress() {
    const url = URL.createObjectURL(new Blob([JSON.stringify({version: 1, exportedAt: new Date().toISOString(), watchedIds: [...watchedIds]}, null, 2)], {type: 'application/json'}));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'galactic-atlas-watch-progress.json'; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return {watchedIds, toggleWatched, storageWarning, exportProgress};
}
