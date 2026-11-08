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
  const unknown = [...unique].filter(id => !validIds.has(id));
  return {ids: new Set([...unique].filter(id => validIds.has(id))), unknown, ignored: unknown.length};
}
const UNREADABLE = 'Saved progress could not be read (it may be damaged or written by a newer version of the atlas). It has not been changed. If you mark a title, the unreadable data is first copied to a backup in this browser and a new list is started.';
// Reads saved progress. `ok` is false when a blob exists but cannot be understood, in which case nothing is loaded.
function read() {
  let raw: string | null;
  try { raw = localStorage.getItem(KEY); }
  catch { return {ids: new Set<string>(), unknown: [] as string[], ok: false, warning: 'Saved progress could not be read. You can still track titles during this visit.'}; }
  if (!raw) return {ids: new Set<string>(), unknown: [] as string[], ok: true, warning: ''};
  try {
    const parsed = parseProgress(raw);
    return {ids: parsed.ids, unknown: parsed.unknown, ok: true, warning: ''};
  } catch { return {ids: new Set<string>(), unknown: [] as string[], ok: false, warning: UNREADABLE}; }
}
// Copies an unreadable saved blob to a free backup key before it may be overwritten. Returns the key used, '' if nothing to back up, or null on failure.
function backupUnreadable(): string | null {
  let raw: string | null;
  try { raw = localStorage.getItem(KEY); } catch { return ''; }
  if (!raw) return '';
  try { parseProgress(raw); return ''; } catch { /* unreadable: back it up */ }
  try {
    for (let n = 0; n < 20; n++) {
      const slot = n === 0 ? `${KEY}.backup` : `${KEY}.backup.${n + 1}`;
      const existing = localStorage.getItem(slot);
      if (existing === raw) return slot;
      if (existing === null) { localStorage.setItem(slot, raw); return slot; }
    }
    return null;
  } catch { return null; }
}
export function useWatchProgress() {
  const [initial] = useState(read);
  const [watchedIds, setWatchedIds] = useState(initial.ids);
  const current = useRef(initial.ids);
  const unsaved = useRef(false);
  const foreign = useRef<Set<string>>(new Set(initial.unknown));
  const [storageWarning, setWarning] = useState(initial.warning);
  function update(next: Set<string>) { current.current = next; setWatchedIds(next); }
  function persist(next: Set<string>) {
    update(next);
    const backupKey = backupUnreadable();
    if (backupKey === null) { unsaved.current = true; setWarning('Saved progress that this version cannot read could not be backed up, so it was left untouched. Your changes are kept for this visit only; export them before closing.'); return false; }
    try {
      // Keep ids this catalog does not know (saved by another version) so a write never deletes them.
      const latest = read();
      if (latest.ok) foreign.current = new Set(latest.unknown); // mirror storage so other tabs' removals are not undone
      localStorage.setItem(KEY, JSON.stringify({version: 1, watchedIds: [...next, ...[...foreign.current].filter(id => !next.has(id))]}));
      unsaved.current = false;
      setWarning(backupKey ? `Earlier saved progress could not be read. A copy was kept in this browser's storage under "${backupKey}".` : '');
      return true;
    }
    catch { unsaved.current = true; setWarning('This browser could not save progress. Export it before closing this visit.'); return false; }
  }
  useEffect(() => {
    function sync(event: StorageEvent) {
      if (event.key !== KEY && event.key !== null) return;
      try { if (event.storageArea !== localStorage) return; } catch { return; }
      if (unsaved.current) return;
      // Read the latest saved value, rather than an older queued storage event.
      const saved = read();
      if (saved.ok) { foreign.current = new Set(saved.unknown); update(saved.ids); setWarning(''); }
      else setWarning(saved.warning === UNREADABLE ? 'Another tab saved progress this version cannot read. It has not been changed. Progress shown here is kept in this tab; marking a title will first back up the unreadable data.' : saved.warning);
    }
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  function latestIds() {
    const saved = read();
    return new Set(!unsaved.current && saved.ok ? saved.ids : current.current);
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
    const url = URL.createObjectURL(new Blob([JSON.stringify({version: 1, exportedAt: new Date().toISOString(), watchedIds: [...current.current, ...foreign.current]}, null, 2)], {type: 'application/json'}));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'galactic-atlas-watch-progress.json'; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return {watchedIds, toggleWatched, storageWarning, exportProgress, importProgress};
}
