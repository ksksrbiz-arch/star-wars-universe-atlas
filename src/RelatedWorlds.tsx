import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CONNECTIONS } from './connections';
import { ALL_WORLDS } from './journeyWorlds';
import './related-worlds.css';
import { useSpoilerPreference } from './spoilerPreference';

/** Linked locations start open; optional spoiler protection keeps a separate disclosure. */
export default function RelatedWorlds({ itemId, title, currentWorldId }: { itemId: string; title: string; currentWorldId: string }) {
 const { hideSpoilers } = useSpoilerPreference();
 const [disclosure, setDisclosure] = useState({ hideSpoilers, open: !hideSpoilers });
 const open = disclosure.hideSpoilers === hideSpoilers ? disclosure.open : !hideSpoilers;
 const links = CONNECTIONS.filter(link => link.itemId === itemId && link.worldId !== currentWorldId);
 return <details className="related-worlds" open={open} onToggle={event => setDisclosure({ hideSpoilers, open: event.currentTarget.open })}>
  <summary>Explore linked worlds <span className="sr-only">for {title}</span></summary>
  {open && <div>
   <p>Other sourced locations in this title. These links do not establish a route or visit order.</p>
   {links.length ? <ul>{links.map(link => {
    const mapped = ALL_WORLDS.some(world => world.id === link.worldId);
    return <li key={link.worldId}>
     {mapped ? <a className="related-world-link" href={`#galaxy/${link.worldId}`}>Preview {link.worldName} on map <ArrowUpRight size={13} aria-hidden="true"/></a> : <strong>{link.worldName} <small>Position not mapped</small></strong>}
     <p>{link.note}</p><a className="related-world-source" href={link.sourceUrl} target="_blank" rel="noopener noreferrer">Official source for {link.worldName} <ArrowUpRight size={13} aria-hidden="true"/></a>
    </li>;
   })}</ul> : <p>No other location is linked in this review. That does not establish the absence of other settings.</p>}
  </div>}
 </details>;
}
