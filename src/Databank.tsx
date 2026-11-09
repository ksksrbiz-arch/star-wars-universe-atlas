import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Database, ExternalLink, Eye, Search } from 'lucide-react';
import { CreditedImage, sourceLink, type SourceImage } from './SourceMedia';
import './databank.css';

type Entry = { id: string; provider: string; providerId: string; entityType: string; name: string; description?: string; sourceUrl: string; image?: SourceImage };
type Result = { items: Entry[]; total: number; offset: number; limit: number };
const PAGE_SIZE = 12;
const plainText = (value = '') => value.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();

export default function Databank() {
  const [open, setOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'location' | 'character'>('location');
  const [offset, setOffset] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  useEffect(() => {
    if (!open || !revealed) return;
    const controller = new AbortController();
    setStatus('loading'); setResult(null);
    const timer = setTimeout(() => {
      const params = new URLSearchParams({ type, q: query.trim(), offset: String(offset), limit: String(PAGE_SIZE) });
      void fetch(`/api/databank?${params}`, { signal: controller.signal }).then(async response => {
        if (!response.ok) throw new Error('Databank unavailable');
        const data = await response.json();
        if (!Array.isArray(data.items) || !Number.isFinite(data.total)) throw new Error('Invalid databank');
        if (!controller.signal.aborted) { setResult(data); setStatus('ready'); }
      }).catch(() => { if (!controller.signal.aborted) setStatus('error'); });
    }, query ? 250 : 0);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [open, revealed, query, type, offset]);

  return <details className="galactic-databank" open={open} onToggle={event => setOpen(event.currentTarget.open)}>
    <summary><span className="databank-emblem"><Database size={23} strokeWidth={1.3} aria-hidden="true"/></span><span><span className="eyebrow">BEYOND THE MAP</span><strong>Explore the Galactic Databank</strong><small>Worlds, places and characters from across the saga.</small></span><ArrowRight className="databank-summary-arrow" size={21} aria-hidden="true"/></summary>
    {open && <div className="databank-content">
      <p className="databank-intro">Explore source-backed reference entries. These are separate from the atlas’s verified episode connections and mapped destinations.</p>
      <label className="databank-reveal"><input type="checkbox" checked={revealed} onChange={event => setRevealed(event.target.checked)}/><Eye size={17} aria-hidden="true"/><span><strong>Reveal story imagery and details</strong><small>Entries may include spoilers from across the saga. This choice lasts while this view is open.</small></span></label>
      {revealed && <>
        <div className="databank-toolbar"><div className="databank-types" role="group" aria-label="Databank entry type">{(['location', 'character'] as const).map(value => <button key={value} aria-pressed={type === value} onClick={() => { setType(value); setOffset(0); }}>{value === 'location' ? 'Worlds & places' : 'Characters'}</button>)}</div><label className="databank-search"><Search size={16} aria-hidden="true"/><span className="sr-only">Search the Galactic Databank</span><input type="search" value={query} maxLength={100} onChange={event => { setQuery(event.target.value); setOffset(0); }} placeholder={type === 'location' ? 'Find a world or place…' : 'Find a character…'}/></label></div>
        <p className="databank-status" role="status" aria-live="polite">{status === 'loading' ? 'Searching the Databank…' : status === 'error' ? 'The Databank is temporarily unavailable. Your story library is still available below.' : result ? `${result.total.toLocaleString()} ${type === 'location' ? 'worlds and places' : 'characters'}${query ? ' matching your search' : ' in the Databank'}` : ''}</p>
        {result && <><div className="databank-grid">{result.items.map(entry => <article className="databank-card" key={entry.id}>
          {entry.image && <CreditedImage image={entry.image} alt={`${entry.name} source reference`}/>}
          <div className="databank-card-copy"><span className="databank-card-kind">{entry.entityType === 'location' ? 'WORLD / PLACE' : 'CHARACTER'}</span><h2>{entry.name}</h2>{entry.description && <p>{plainText(entry.description)}</p>}{sourceLink(entry.sourceUrl) && <a href={sourceLink(entry.sourceUrl)} target="_blank" rel="noreferrer">Read source entry <ExternalLink size={12} aria-hidden="true"/></a>}</div>
        </article>)}</div>{result.items.length === 0 && <p className="databank-empty">No matching entries. Try another name or switch the entry type.</p>}
        <nav className="databank-pagination" aria-label="Databank result pages"><button disabled={offset === 0} onClick={() => setOffset(value => Math.max(0, value - PAGE_SIZE))}><ArrowLeft size={15} aria-hidden="true"/> Previous</button><span>{result.total ? `${offset + 1}–${offset + result.items.length} of ${result.total.toLocaleString()}` : '0 results'}</span><button disabled={offset + result.items.length >= result.total} onClick={() => setOffset(value => value + PAGE_SIZE)}>Next <ArrowRight size={15} aria-hidden="true"/></button></nav></>}
        <p className="databank-attribution">Reference entries from the <a href="https://starwars-databank.vercel.app/about" target="_blank" rel="noreferrer">community Star Wars Databank</a>, based on the official Star Wars Databank. Locations here do not establish map coordinates or episode appearances.</p>
      </>}
    </div>}
  </details>;
}
