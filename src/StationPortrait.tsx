import { useId } from 'react';
import './planet-portrait.css';

/** Original static illustration. Ring shape is sourced; proportions and plate layout are invented. */
export default function StationPortrait({ name }: { name: string }) {
 const key = useId().replaceAll(':', '');
 return <figure className="atlas-portrait portrait-featured station-portrait" data-motion="reduced">
  <svg viewBox="0 0 400 320" role="img" aria-label={`Original illustrative ring station study of ${name}; not to scale or a galaxy map`}>
   <defs>
    <radialGradient id={`${key}-star`}><stop stopColor="#fff8d8"/><stop offset=".25" stopColor="#ffe6ac"/><stop offset=".35" stopColor="#e3ac5a" stopOpacity=".6"/><stop offset="1" stopColor="#e3ac5a" stopOpacity="0"/></radialGradient>
    <linearGradient id={`${key}-ring`} x1="0" x2="1" y2="1"><stop stopColor="#b6cbd1"/><stop offset=".45" stopColor="#526d80"/><stop offset="1" stopColor="#a9c1ca"/></linearGradient>
   </defs>
   <g fill="#a9c5d3"><circle cx="45" cy="63" r="1.2"/><circle cx="340" cy="82" r="1"/><circle cx="76" cy="235" r="1.4"/><circle cx="330" cy="249" r="1"/></g>
   <g transform="rotate(-23 200 145)">
    <ellipse cx="200" cy="145" rx="156" ry="72" fill="none" stroke={`url(#${key}-ring)`} strokeWidth="14"/>
    <ellipse cx="200" cy="145" rx="149" ry="65" fill="none" stroke="#e6ce8c" strokeWidth="2" opacity=".65"/>
    <ellipse cx="200" cy="145" rx="163" ry="79" fill="none" stroke="#416174" strokeWidth="1"/>
    {Array.from({length:28},(_,i)=>{const angle=i*Math.PI/14;const x=200+156*Math.cos(angle);const y=145+72*Math.sin(angle);return <path key={i} d={`M${x-2} ${y-3}l4 6`} stroke={i%3?'#233d4e':'#f0d8a1'} strokeWidth="2"/>;})}
    <circle cx="200" cy="145" r="77" fill={`url(#${key}-star)`}/>
    <circle cx="200" cy="145" r="14" fill="#fff0c7"/>
    <path d="M72 180Q200 242 328 180" fill="none" stroke="#172c3d" strokeWidth="7" strokeDasharray="32 18"/>
    <path d="M71 185Q200 247 329 185" fill="none" stroke="#8aa6b6" strokeWidth="2" opacity=".7"/>
   </g>
  </svg>
  <figcaption><span>ORIGINAL STATION STUDY</span><span>Illustrative · not to scale or mapped</span></figcaption>
 </figure>;
}
