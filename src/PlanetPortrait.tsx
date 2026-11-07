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
 return <figure className={`atlas-portrait surface-${family}`} data-motion={reducedMotion?'reduced':'full'}>
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
     <circle cx="200" cy="145" r="100" fill={`url(#${key}-shade)`}/>
    </g>
    <circle cx="200" cy="145" r="100" fill="none" stroke="#d9f2fb" strokeOpacity=".22"/>
   </g>
   <g fill="#bbdbe5"><circle cx="50" cy="76" r="1.4"/><circle cx="334" cy="210" r="1"/><circle cx="310" cy="42" r="1.2"/></g>
  </svg>
  <figcaption><span>ORIGINAL PLANET STUDY</span><span>Illustrative · not surface geography</span></figcaption>
 </figure>;
}
