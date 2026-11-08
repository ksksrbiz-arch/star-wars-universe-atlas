import { episodeRange, episodeAliases } from './catalogPresentation';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowUpRight, BookOpen, MapPin, Search, X } from 'lucide-react';
import { ALL_WORLDS } from './journeyWorlds';
import { CATALOG, SERIES } from './catalog';
import { CONNECTIONS } from './connections';
import { STORY_SEQUENCES } from './chronology';
import { getLocation } from './locations';
import LocationDossier from './LocationDossier';
import './atlas-search.css';

type SearchEntry = { id: string; name: string; kind: 'World' | 'Location' | 'Movie' | 'Episode' | 'Collection'; detail: string; keywords: string; href?: string; locationId?: string };
const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[’']/g, '').toLowerCase();
const collections = new Map<string, string>(SERIES.map(series => [series.id, series.title]));
const mapped = new Set(ALL_WORLDS.map(world => world.id));
const locations = new Map<string, string>(CONNECTIONS.filter(link => !mapped.has(link.worldId)).map(link => [link.worldId, link.worldName]));
const entries: SearchEntry[] = [
  ...ALL_WORLDS.map(world => ({ id: `world:${world.id}`, name: world.name, kind: 'World' as const, detail: `Mapped · ${world.grid} · ${world.region}`, keywords: `${world.name} ${world.grid} ${world.region}`, href: `#galaxy/${world.id}` })),
  ...[...locations].map(([id, name]) => ({ id: `location:${id}`, name, kind: 'Location' as const, detail: 'No map placement · view location file', keywords: name, locationId: id })),
  ...CATALOG.map(item => ({ id: `title:${item.id}`, name: item.title, kind: item.kind === 'film' ? 'Movie' as const : 'Episode' as const, detail: `${collections.get(item.seriesId) ?? item.seriesId}${item.kind === 'episode' ? ` · S${String(item.season).padStart(2, '0')}E${episodeRange(item, true)}` : ''}`, keywords: `${item.title} ${collections.get(item.seriesId) ?? ''} ${item.id} ${item.kind === 'episode' ? episodeAliases(item) : ''}`, href: `#journey/${item.id}` })),
  ...STORY_SEQUENCES.filter(sequence => sequence.itemIds.length).map(sequence => ({ id: `collection:${sequence.id}`, name: collections.get(sequence.id) ?? sequence.title, kind: 'Collection' as const, detail: `${sequence.itemIds.length} chapters · open story journey`, keywords: `${sequence.title} ${collections.get(sequence.id) ?? ''}`, href: `#journey/${sequence.itemIds[0]}` })),
];
const RESULT_LIMIT = 12;

/** Search exposes identities, never episode/location joins or watch-state changes. */
export default function AtlasSearch({ onNavigate, onOpen, reducedMotion }: { onNavigate: (href: string) => void; onOpen: () => void; reducedMotion: boolean }) {
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(-1);
  const [inspection, setInspection] = useState<SearchEntry | null>(null);
  const matches = useMemo(() => {
    const normalized = normalize(query.trim());
    if (!normalized) return [];
    const terms = normalized.split(/\s+/);
    const rank = (entry: SearchEntry) => normalize(entry.name) === normalized ? 0 : normalize(entry.name).startsWith(normalized) ? 1 : 2;
    return entries.filter(entry => terms.every(term => normalize(entry.keywords).includes(term))).sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name) || a.kind.localeCompare(b.kind));
  }, [query]);
  const visible = matches.slice(0, RESULT_LIMIT);
  const backdropDown = useRef(false);
  const close = (restoreFocus = true) => { dialog.current?.close(); setOpen(false); setInspection(null); if (restoreFocus) trigger.current?.focus({ preventScroll: true });
    else if (document.activeElement === trigger.current) trigger.current?.blur(); /* dialog.close() natively restores focus; release it so navigation owns focus */ };
  const show = () => { onOpen(); setOpen(true); setQuery(''); setActive(-1); setInspection(null); if (dialog.current && !dialog.current.open) dialog.current.showModal(); input.current?.focus(); };
  const select = (entry: SearchEntry) => {
    if (entry.locationId) { setInspection(entry); setActive(-1); return; }
    close(false);
    if (entry.href) onNavigate(entry.href);
  };
  useEffect(() => {
    if (!open) return;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => { document.documentElement.style.overflow = previous; };
  }, [open]);
  useEffect(() => { if (active >= 0) document.getElementById(`${id}-result-${active}`)?.scrollIntoView({ block: 'nearest' }); }, [active, id]);
  useEffect(() => { if (inspection) dialog.current?.querySelector<HTMLButtonElement>('.atlas-search-back')?.focus(); }, [inspection]);
  const back = () => { setInspection(null); requestAnimationFrame(() => input.current?.focus()); };

  return <>
    <button ref={trigger} className="atlas-search-trigger" aria-label="Search the atlas" aria-haspopup="dialog" aria-expanded={open} aria-controls={`${id}-dialog`} onClick={show}><Search size={18}/><span>Search atlas</span></button>
    <dialog ref={dialog} id={`${id}-dialog`} className="atlas-search-dialog" aria-labelledby={`${id}-heading`} onCancel={event => { event.preventDefault(); close(); }} onPointerDown={event => { backdropDown.current = event.target === event.currentTarget; }} onKeyDown={event => {
      if (event.key !== 'Tab') return;
      const focusable = [...event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), a[href], summary, [tabindex="0"]')].filter(element => element.getClientRects().length > 0);
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }} onClick={event => { const down = backdropDown.current; backdropDown.current = false; if (down && event.target === event.currentTarget) close(); }}>
      <div className="atlas-search-shell">
        <div className="atlas-search-heading"><div><span>GALACTIC INDEX</span><h2 id={`${id}-heading`}>Search the atlas</h2></div><button className="atlas-search-close" aria-label="Close atlas search" onClick={() => close()}><X size={20}/></button></div>
        {inspection ? <div className="atlas-search-inspection"><button className="atlas-search-back" onClick={back}><ArrowLeft size={16}/> Back to results</button>{inspection.locationId && getLocation(inspection.locationId) ? <LocationDossier id={inspection.locationId} reducedMotion={reducedMotion}/> : <section aria-label={`${inspection.name} location details`}><span className="atlas-search-type">LOCATION FILE</span><h3>{inspection.name}</h3><p>No supported map placement is available in this atlas. Location type and coordinates are not inferred.</p><p>Your current galaxy location and watch progress are unchanged. Episode associations remain hidden here.</p></section>}</div> : <>
          <label className="atlas-search-label" htmlFor={`${id}-input`}>World, location, movie, episode or collection</label>
          <div className="atlas-search-field"><Search size={19} aria-hidden="true"/><input ref={input} id={`${id}-input`} role="combobox" aria-autocomplete="list" aria-expanded={Boolean(query.trim())} aria-controls={`${id}-results`} aria-activedescendant={active >= 0 && visible[active] ? `${id}-result-${active}` : undefined} aria-describedby={`${id}-help ${id}-status`} autoComplete="off" spellCheck={false} placeholder="Try Lothal, Kassa or Andor S01E02" value={query} onChange={event => { setQuery(event.target.value); setActive(-1); }} onKeyDown={event => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); if (visible.length) setActive(previous => event.key === 'ArrowDown' ? (previous + 1) % visible.length : (previous <= 0 ? visible.length - 1 : previous - 1)); }
            else if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229 && visible.length) { event.preventDefault(); select(visible[Math.max(0, active)]); }
          }}/></div>
          <p id={`${id}-help`} className="atlas-search-help">Location names may reveal settings. Search does not reveal episode-location connections or change watch progress.</p>
          <p id={`${id}-status`} className="atlas-search-status" role="status" aria-live="polite">{query.trim() ? `${matches.length} ${matches.length === 1 ? 'result' : 'results'}${matches.length > RESULT_LIMIT ? ` · first ${RESULT_LIMIT} shown; refine your search` : ''}` : 'Search across the curated atlas. Use arrow keys to browse results and Enter to open.'}</p>
          <ul id={`${id}-results`} role="listbox" tabIndex={-1} aria-label="Atlas search results" className="atlas-search-results" hidden={!query.trim()}>{visible.map((entry, index) => <li id={`${id}-result-${index}`} key={entry.id} role="option" aria-selected={active === index} onPointerMove={() => setActive(index)} onMouseDown={event => event.preventDefault()} onClick={() => select(entry)}><span className="atlas-search-result-icon" aria-hidden="true">{entry.kind === 'World' || entry.kind === 'Location' ? <MapPin size={18}/> : <BookOpen size={18}/>}</span><span className="atlas-search-result-copy"><span className="atlas-search-type">{entry.kind}</span><strong>{entry.name}</strong><small>{entry.detail}</small></span><ArrowUpRight size={16} aria-hidden="true"/></li>)}</ul>
          {query.trim() && !matches.length && <p className="atlas-search-empty">No matches in this catalog. Try a title, location name, collection or episode code.</p>}
        </>}
      </div>
    </dialog>
  </>;
}
