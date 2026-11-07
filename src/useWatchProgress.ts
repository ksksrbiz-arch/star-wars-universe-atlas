import { useEffect, useRef, useState } from 'react';
import { CATALOG } from './catalog';
const KEY = 'galactic-atlas.watch.v1';
const MAX_BACKUP_BYTES = 256 * 1024;
const validIds = new Set(CATALOG.map(item => item.id));
export type ImportResult = { ok: boolean; message: string };
function parseProgress(raw: string) {
  const data: unknown = JSON.parse(raw);
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid backup');
  const record = data as {version?: unknown; watchedIds?: unknown};
  if (record.version !== 1 || !Array.isArray(record.watchedIds) || !record.watchedIds.every(id => typeof id === 'string')) throw new Error('Invalid backup');
  const unique = new Set<string>(record.watchedIds);
  return {ids: new Set([...unique].filter(id => validIds.has(id))), ignored: [...unique].filter(id => !validIds.has(id)).length};
}
function read() {
  try {
    const raw = localStorage.getItem(KEY);
    return {ids: raw ? parseProgress(raw).ids : new Set<string>(), warning: ''};
  } catch { return {ids: new Set<string>(), warning: 'Saved progress could not be read. You can still track titles during this visit.'}; }
}
export function useWatchProgress() {
  const [initial] = useState(read);
  const [watchedIds, setWatchedIds] = useState(initial.ids);
  const current = useRef(initial.ids);
  const unsaved = useRef(false);
  const [storageWarning, setWarning] = useState(initial.warning);
  function update(next: Set<string>) { current.current = next; setWatchedIds(next); }
  function persist(next: Set<string>) {
    update(next);
    try { localStorage.setItem(KEY, JSON.stringify({version: 1, watchedIds: [...next]})); unsaved.current = false; setWarning(''); return true; }
    catch { unsaved.current = true; setWarning('This browser could not save progress. Export it before closing this visit.'); return false; }
  }
  useEffect(() => {
    function sync(event: StorageEvent) {
      if (event.key !== KEY && event.key !== null) return;
      try { if (event.storageArea !== localStorage) return; } catch { return; }
      if (unsaved.current) return;
      // Read the latest saved value, rather than an older queued storage event.
      const saved = read();
      if (!saved.warning) { update(saved.ids); setWarning(''); }
      else setWarning('Another tab saved unreadable progress. Your current progress has been kept.');
    }
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  function latestIds() {
    const saved = read();
    return new Set(!unsaved.current && !saved.warning ? saved.ids : current.current);
  }
  function toggleWatched(id: string) {
    if (!validIds.has(id)) return;
    const next = latestIds();
    next.has(id) ? next.delete(id) : next.add(id);
    persist(next);
  }
  async function importProgress(file: File): Promise<ImportResult> {
    if (file.size > MAX_BACKUP_BYTES) return {ok: false, message: 'This file is too large. Choose an atlas JSON backup smaller than 256 KB.'};
    try {
      const parsed = parseProgress(await file.text());
      // Include changes saved while reading the file, preserving unsaved session edits.
      const next = latestIds();
      const before = next.size;
      parsed.ids.forEach(id => next.add(id));
      const savedSuccessfully = persist(next);
      const added = next.size - before;
      return {ok: true, message: `${added} watched ${added === 1 ? 'title' : 'titles'} added. Existing progress kept.${parsed.ignored ? ` ${parsed.ignored} unknown ${parsed.ignored === 1 ? 'title was' : 'titles were'} ignored.` : ''}${savedSuccessfully ? '' : ' Imported for this visit only; export a backup before closing.'}`};
    } catch { return {ok: false, message: 'This is not a valid version 1 atlas backup. Choose a JSON export containing a watchedIds list. Your progress was not changed.'}; }
  }
  function exportProgress() {
    const url = URL.createObjectURL(new Blob([JSON.stringify({version: 1, exportedAt: new Date().toISOString(), watchedIds: [...current.current]}, null, 2)], {type: 'application/json'}));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'galactic-atlas-watch-progress.json'; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return {watchedIds, toggleWatched, storageWarning, exportProgress, importProgress};
}
