import { useId } from 'react';
import './planet-portrait.css';

type Props = { id: string; name: string; color: string; reducedMotion: boolean };
const ice = new Set(['hoth','ilum','mygeeto']);
const city = new Set(['coruscant']);
const desert = new Set(['tatooine','geonosis','jakku','jedha']);
const green = new Set(['endor','yavin','naboo','kashyyyk','dagobah']);
/** Original resolution-independent artwork. Surface motifs are illustrative, not cartography. */
export default function PlanetPortrait({id,name,color,reducedMotion}: Props) {
 const key=useId().replaceAll(':','');
 const family=ice.has(id)?'ice':city.has(id)?'city':desert.has(id)?'desert':green.has(id)?'verdant':'atmosphere';
 const base=family==='ice'?'#c8dce5':family==='city'?'#516478':color;
 return <figure className={`atlas-portrait surface-${family} ${['tatooine','coruscant','hoth','naboo'].includes(id) ? 'portrait-featured' : ''}`} data-motion={reducedMotion?'reduced':'full'}>
  <svg viewBox="0 0 400 320" role="img" aria-label={`Original illustrative portrait of ${name}; not an official surface map`}>
   <defs>
    <radialGradient id={`${key}-base`} cx="30%" cy="25%"><stop stopColor="#fff2d6"/><stop offset=".32" stopColor={base}/><stop offset="1" stopColor="#17232e"/></radialGradient>
    <radialGradient id={`${key}-shade`} cx="24%" cy="28%" r="80%"><stop offset=".25" stopColor="#03090e" stopOpacity="0"/><stop offset=".68" stopColor="#03090e" stopOpacity=".3"/><stop offset="1" stopColor="#010306" stopOpacity=".97"/></radialGradient>
    <radialGradient id={`${key}-halo`}><stop offset=".55" stopColor={base} stopOpacity=".18"/><stop offset="1" stopColor={base} stopOpacity="0"/></radialGradient>
    <clipPath id={`${key}-disc`}><circle cx="200" cy="145" r="100"/></clipPath>
    <pattern id={`${key}-city`} width="17" height="17" patternUnits="userSpaceOnUse" patternTransform="rotate(-25)"><path d="M0 0H17V17" fill="none" stroke="#f8d797" strokeOpacity=".42" strokeWidth=".8"/><circle cx="4" cy="5" r="1" fill="#ffe5ae"/></pattern>
   </defs>
   <circle cx="200" cy="145" r="146" fill={`url(#${key}-halo)`}/>
   <g fill="none" stroke="#9dbcc5" strokeOpacity=".22"><ellipse cx="200" cy="145" rx="173" ry="52" transform="rotate(-24 200 145)"/><path d="M28 145H68M332 145H372M200 12V30M200 260V278"/></g>
   <g className="portrait-disc">
    <circle cx="200" cy="145" r="101" fill={base} opacity=".3"/>
    <circle cx="200" cy="145" r="100" fill={`url(#${key}-base)`}/>
    <g clipPath={`url(#${key}-disc)`}>
     {family==='city'?<circle cx="200" cy="145" r="100" fill={`url(#${key}-city)`}/>:<>
      {family==='desert' ? Array.from({length:8},(_,i)=><path key={i} d={`M${92+i*19} ${60+i%3*34}l32 14-12 21 24 19-25 38-17-15 6-27-26-23z`} fill={i%2?'#aa7949':'#d0a473'} opacity={.12+i%3*.04}/>) : Array.from({length:12},(_,i)=><path key={i} d={`M70 ${65+i*16} C130 ${35+i*18}, 215 ${105+i*11}, 330 ${55+i*17}`} fill="none" stroke={family==='ice'?'#effbff':family==='verdant'?'#203e32':'#d6e6e5'} strokeWidth={family==='verdant'?12:3+i%4} opacity={.16+(i%3)*.06}/>) }
      {family==='verdant'&&<path d="M145 52l35 22 8 38-24 16 12 31-31 22-20-38-22-18 9-42zM231 175l38-12 24 28-12 35-33 8-21-27z" fill="#344e35" opacity=".65"/>}
      {family==='ice'&&<path d="M117 170l36-26 22 9 28-42 39 28 40-19M153 144l-10-30 13-19M204 113l-7-34" fill="none" stroke="#769ead" strokeWidth="2" opacity=".55"/>}
     </>}
     {id==='tatooine'&&<g fill="none" stroke="#f4d5a0" opacity=".3"><path d="M111 115q35-42 83-19t95-13M102 145q30-29 76-8t120-10M111 192q62-35 113-4t61-12" strokeWidth="2"/>{[0,1,2,3,4].map(i=><ellipse key={i} cx={135+i*24} cy={95+(i%3)*38} rx={7+i%2*4} ry="4" strokeWidth="1.5"/>)}</g>}
     {id==='hoth'&&<g><path d="M103 100q29-30 67-21l29-21 39 20 40 1 24 36-46-11-33 16-28-15-35 14-39-4z" fill="#edfaff" opacity=".38"/><path d="M104 180l31-19 26 7 21-22 23 9 19-17 24 17 36-2M126 199l20-20 33 12 19-8 31 19 27-17" fill="none" stroke="#517f99" strokeWidth="1.4" opacity=".55"/><path d="M119 135q46-14 88-5t80 12" fill="none" stroke="#effaff" strokeWidth="8" opacity=".2"/></g>}
     {id==='coruscant'&&<g fill="none" stroke="#f4d39a" opacity=".48"><ellipse cx="174" cy="129" rx="48" ry="24" transform="rotate(-25 174 129)"/><ellipse cx="174" cy="129" rx="72" ry="41" transform="rotate(-25 174 129)"/>{Array.from({length:18},(_,i)=><circle key={i} cx={116+(i*37)%160} cy={68+(i*29)%145} r={i%4===0?1.8:.8} fill="#ffe5ae" stroke="none"/>)}</g>}
     {id==='naboo'&&<g><path d="M109 98l25-20 25 9 9 17 22 5-6 18-22 10-8 26-21-5-7-23-24-12zM225 68l27 9 12 22-15 19-21-4-14-20zM208 167l34-16 31 15-9 25-22 8-17-11-21 11-15-14z" fill="#537255" opacity=".65"/><path d="M141 109q24 1 20 18t-17 20M227 172q29-10 28 12" fill="none" stroke="#86bbc2" strokeWidth="4" opacity=".6"/><path d="M109 81q64-16 119 10M114 177q56 16 112-1" fill="none" stroke="#e6eece" strokeWidth="9" opacity=".12"/></g>}
     <circle cx="200" cy="145" r="100" fill={`url(#${key}-shade)`}/>
    </g>
    <circle cx="200" cy="145" r="100" fill="none" stroke="#d9f2fb" strokeOpacity=".22"/>
   </g>
   <g fill="#bbdbe5"><circle cx="50" cy="76" r="1.4"/><circle cx="334" cy="210" r="1"/><circle cx="310" cy="42" r="1.2"/></g>
  </svg>
  <figcaption><span>ORIGINAL PLANET STUDY</span><span>Illustrative · not surface geography</span></figcaption>
 </figure>;
}
