import { useId, useMemo, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { ALL_WORLDS } from './journeyWorlds';
import './world-explorer.css';

const sortedWorlds = [...ALL_WORLDS].sort((a, b) => a.name.localeCompare(b.name));
const regions = [...new Set(ALL_WORLDS.map(world => world.region))].sort();
const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[–—]/g, '-');

export default function WorldExplorer({ selectedId, disabled, onSelect }: {
  selectedId: string;
  disabled: boolean;
  onSelect: (id: string) => void;
}) {
  const id = useId();
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('');
  const worlds = useMemo(() => {
    const terms = normalize(query.trim()).split(/\s+/).filter(Boolean);
    return sortedWorlds.filter(world => (!region || world.region === region) && terms.every(term =>
      normalize(`${world.name} ${world.grid} ${world.region}`).includes(term)));
  }, [query, region]);
  const selectedInResults = worlds.some(world => world.id === selectedId);
  const filtered = Boolean(query || region);

  return <section className="world-explorer" aria-label="World search">
    <div className="world-explorer-heading"><span><SlidersHorizontal size={14}/> DESTINATION SEARCH</span>
      <span id={`${id}-count`} role="status">{worlds.length} of {ALL_WORLDS.length} worlds</span>
    </div>
    <div className="world-explorer-fields">
      <label className="world-explorer-search" htmlFor={`${id}-query`}><span>Search worlds</span>
        <div><Search size={16} aria-hidden="true"/><input id={`${id}-query`} type="search" value={query} disabled={disabled}
          onChange={event => setQuery(event.target.value)} placeholder="Name, grid or region" autoComplete="off" aria-describedby={`${id}-count`}/></div>
      </label>
      <label htmlFor={`${id}-region`}><span>Region</span><select id={`${id}-region`} value={region} disabled={disabled}
        onChange={event => setRegion(event.target.value)}><option value="">All regions</option>{regions.map(name => <option key={name}>{name}</option>)}</select></label>
      <label className="world-explorer-destination" htmlFor={`${id}-world`}><span>Choose destination</span>
        <select id={`${id}-world`} aria-label="Find a mapped world" value={selectedInResults ? selectedId : ''}
          disabled={disabled || !worlds.length} onChange={event => { if (event.target.value) onSelect(event.target.value); }}>
          {!selectedInResults && <option value="" disabled>{worlds.length ? 'Select a matching world' : 'No matching worlds'}</option>}
          {worlds.map(world => <option key={world.id} value={world.id}>{world.name} · {world.grid}</option>)}
        </select>
      </label>
      <button className="world-explorer-reset" disabled={disabled || !filtered} onClick={() => {setQuery(''); setRegion('');}} aria-label="Reset world filters"><X size={15}/> Reset</button>
    </div>
    {!worlds.length && <p className="world-explorer-empty">No mapped worlds match these filters. Try a different name or choose All regions.</p>}
    {worlds.length > 0 && filtered && !selectedInResults && <p className="world-explorer-empty">Your selected destination is outside these results. Choose a match to preview it.</p>}
  </section>;
}
