import { useState } from 'react';
import { CONNECTIONS } from './connections';
import { CATALOG } from './catalog';
export default function WorldStories({worldId,worldName,watchedIds}:{worldId:string;worldName:string;watchedIds:ReadonlySet<string>}) {
 const [revealed,setRevealed]=useState<Set<string>>(()=>new Set());
 const [expandedWorlds,setExpandedWorlds]=useState<Set<string>>(()=>new Set());
 const ids=[...new Set(CONNECTIONS.filter(link=>link.worldId===worldId).map(link=>link.itemId))];
 const visible=ids.filter(id=>watchedIds.has(id)||revealed.has(worldId));
 return <section className="world-stories" aria-label="Linked stories"><h3>Stories at {worldName} <span>{ids.length}</span></h3>{!ids.length?<p>No title-level location evidence linked yet.</p>:<>{visible.slice(0,expandedWorlds.has(worldId)?undefined:6).map(id=><a href={`#journey/${id}`} key={id}>{CATALOG.find(item=>item.id===id)?.title}<span>Follow story →</span></a>)}{visible.length>6&&!expandedWorlds.has(worldId)&&<button onClick={()=>setExpandedWorlds(old=>new Set([...old,worldId]))}>Show {visible.length-6} more linked stories</button>}{visible.length<ids.length&&<button onClick={()=>setRevealed(old=>new Set([...old,worldId]))}>Reveal linked unwatched titles</button>}<p>Partial appearance coverage. A title link does not imply a character’s continuous route.</p></>}</section>;
}
