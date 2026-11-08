import { useId } from 'react';
import './planet-portrait.css';

/** Original static silhouette. Neither asteroid shape nor facility layout is surveyed. */
export default function OutpostPortrait({ name }: { name: string }) {
 const id=useId().replaceAll(':','');
 return <figure className="atlas-portrait portrait-featured outpost-portrait" data-motion="reduced">
  <svg viewBox="0 0 400 320" role="img" aria-label={`Original illustrative asteroid outpost study of ${name}; not a planet or a map`}>
   <defs><linearGradient id={`${id}-rock`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ab9e88"/><stop offset=".6" stopColor="#5a6060"/><stop offset="1" stopColor="#233546"/></linearGradient></defs>
   <g fill="#b5c5cc"><circle cx="48" cy="64" r="1.1"/><circle cx="325" cy="48" r="1"/><circle cx="354" cy="178" r="1.4"/><circle cx="69" cy="243" r=".8"/></g>
   <path d="M61 170l34-43 46-16 38-22 49 16 43 10 48 43 15 39-39 27-54 9-43 19-59-22-42-14z" fill={`url(#${id}-rock)`}/>
   <path d="M96 130l39 20-13 41 37 38m21-139 5 41 49 17-13 47 20 38m30-118-14 42 38 66" fill="none" stroke="#c6b69c" strokeWidth="2" opacity=".35"/>
   <path d="M118 190l25-10 23 9-13 20-25-5M240 195l24-12 16 16-23 12" fill="#142a38" opacity=".6"/>
   <g fill="#667d87" stroke="#b3bdb5" strokeWidth="1"><path d="M138 126v-23l31-8 32 9v23z"/><path d="M207 132v-22l34-7 29 12v17z"/><path d="M172 132h54v12h-54z"/><path d="M156 102V76h6v26"/></g>
   <path d="M171 110h18m27 10h23" stroke="#d7b27a" strokeWidth="3" opacity=".8"/>
   <g fill="#64747a" opacity=".7"><path d="M47 144l10-8 12 7-7 9zM328 112l13-4 8 10-16 7zM298 258l16-7 8 13-17 4z"/></g>
  </svg>
  <figcaption><span>ORIGINAL OUTPOST STUDY</span><span>Illustrative · not a planet or mapped</span></figcaption>
 </figure>;
}
