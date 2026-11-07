import { useState } from 'react';
import { CONNECTIONS } from './connections';
import { ALL_WORLDS } from './journeyWorlds';
import './related-worlds.css';

/** Separate disclosure: revealing an episode title does not reveal its other locations. */
export default function RelatedWorlds({ itemId, title, currentWorldId }: { itemId: string; title: string; currentWorldId: string }) {
 const [open, setOpen] = useState(false);
 const links = CONNECTIONS.filter(link => link.itemId === itemId && link.worldId !== currentWorldId);
 return <details className="related-worlds" open={open} onToggle={event => setOpen(event.currentTarget.open)}>
  <summary>Explore linked worlds <span className="sr-only">for {title}</span></summary>
  {open && <div>
   <p>Other sourced locations in this title. This reveals settings, not a route or visit order.</p>
   {links.length ? <ul>{links.map(link => {
    const mapped = ALL_WORLDS.some(world => world.id === link.worldId);
    return <li key={link.worldId}>
     {mapped ? <a className="related-world-link" href={`#galaxy/${link.worldId}`}>Preview {link.worldName} on map <span aria-hidden="true">↗</span></a> : <strong>{link.worldName} <small>Position not mapped</small></strong>}
     <p>{link.note}</p><a className="related-world-source" href={link.sourceUrl} target="_blank" rel="noopener noreferrer">Official source for {link.worldName} ↗</a>
    </li>;
   })}</ul> : <p>No other location is linked in this review. That does not establish the absence of other settings.</p>}
  </div>}
 </details>;
}
