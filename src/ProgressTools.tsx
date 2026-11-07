import { useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import type { ImportResult } from './useWatchProgress';
import './progress-tools.css';
export default function ProgressTools({exportProgress, importProgress}: {exportProgress: () => void; importProgress: (file: File) => Promise<ImportResult>}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  return <section className="progress-tools" aria-label="Watch progress backups">
    <div><h2>Take your progress with you</h2><p>Export a backup or merge one from another browser. Imports keep your existing watched titles. Progress stays on this device and syncs between open tabs.</p></div>
    <div className="progress-tools-actions"><button className="backup-button" onClick={exportProgress}><Download size={16}/> Export watch progress</button><button className="backup-button" disabled={busy} onClick={() => input.current?.click()}><Upload size={16}/>{busy ? 'Importing…' : 'Import watch progress'}</button></div>
    <input ref={input} className="progress-file-input" type="file" accept=".json,application/json" aria-label="Choose watch progress backup" tabIndex={-1} onChange={async event => {
      const file = event.target.files?.[0]; event.target.value = '';
      if (!file) return;
      setBusy(true); setResult(null);
      try { setResult(await importProgress(file)); }
      catch { setResult({ok: false, message: 'The file could not be read. Your progress was not changed.'}); }
      finally { setBusy(false); }
    }}/>
    <p className={`progress-import-result ${result?.ok === false ? 'is-error' : ''}`} role="status" aria-live="polite">{result?.message}</p>
  </section>;
}
