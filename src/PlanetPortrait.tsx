import { useId } from 'react';
import './planet-portrait.css';

type Props = { id: string; name: string; color: string; reducedMotion: boolean };
const ice = new Set(['hoth','ilum','mygeeto','stygeon-prime','krownest']);
const city = new Set(['coruscant']);
const desert = new Set(['tatooine','geonosis','jakku','jedha','seelos']);
const green = new Set(['endor','yavin','naboo','kashyyyk','dagobah','scarif','lahmu','lothal','dathomir']);
const rocky = new Set(['eadu','mustafar','utapau','kessel','atollon','malachor','ryloth']);
/** Original resolution-independent artwork. Surface motifs are illustrative, not cartography. */
export default function PlanetPortrait({id,name,color,reducedMotion}: Props) {
 const key=useId().replaceAll(':','');
 const family=ice.has(id)?'ice':city.has(id)?'city':desert.has(id)?'desert':green.has(id)?'verdant':rocky.has(id)?'rocky':'atmosphere';
 const base=id==='dathomir'?'#a84c52':id==='ryloth'?'#bfa17b':id==='atollon'?'#bf9775':id==='malachor'?'#5f596b':id==='seelos'?'#cec7ab':id==='lothal'?'#b4a66a':id==='kessel'?'#aa8657':family==='ice'?'#c8dce5':family==='city'?'#516478':id==='kamino'?'#4d829a':id==='geonosis'?'#b38152':id==='utapau'?'#a69b79':id==='kashyyyk'?'#668970':id==='scarif'?'#5fafa7':id==='eadu'?'#536c80':id==='lahmu'?'#71806a':id==='mustafar'?'#5e3028':color;
 return <figure className={`atlas-portrait surface-${family} ${['tatooine','coruscant','hoth','naboo','scarif','jedha','eadu','lahmu','mustafar','yavin','kamino','geonosis','utapau','kashyyyk','lothal','kessel','stygeon-prime','atollon','malachor','seelos','dathomir','ryloth','krownest'].includes(id) ? 'portrait-featured' : ''}`} data-motion={reducedMotion?'reduced':'full'}>
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
   {id==='geonosis'&&<g transform="rotate(-22 200 145)" fill="none"><ellipse cx="200" cy="145" rx="160" ry="41" stroke="#bd9975" strokeWidth="11" opacity=".38"/><ellipse cx="200" cy="145" rx="174" ry="46" stroke="#b89066" strokeWidth="2" opacity=".35"/></g>}
   <g className="portrait-disc">
    <circle cx="200" cy="145" r="101" fill={base} opacity=".3"/>
    <circle cx="200" cy="145" r="100" fill={`url(#${key}-base)`}/>
    <g clipPath={`url(#${key}-disc)`}>
     {family==='city'?<circle cx="200" cy="145" r="100" fill={`url(#${key}-city)`}/>:<>
      {(family==='desert'||family==='rocky') ? Array.from({length:8},(_,i)=><path key={i} d={`M${92+i*19} ${60+i%3*34}l32 14-12 21 24 19-25 38-17-15 6-27-26-23z`} fill={i%2?'#aa7949':'#d0a473'} opacity={.12+i%3*.04}/>) : Array.from({length:12},(_,i)=><path key={i} d={`M70 ${65+i*16} C130 ${35+i*18}, 215 ${105+i*11}, 330 ${55+i*17}`} fill="none" stroke={family==='ice'?'#effbff':family==='verdant'?'#203e32':'#d6e6e5'} strokeWidth={family==='verdant'?12:3+i%4} opacity={.16+(i%3)*.06}/>) }
      {family==='verdant'&&<path d="M145 52l35 22 8 38-24 16 12 31-31 22-20-38-22-18 9-42zM231 175l38-12 24 28-12 35-33 8-21-27z" fill="#344e35" opacity=".65"/>}
      {family==='ice'&&<path d="M117 170l36-26 22 9 28-42 39 28 40-19M153 144l-10-30 13-19M204 113l-7-34" fill="none" stroke="#769ead" strokeWidth="2" opacity=".55"/>}
     </>}
     {id==='dathomir'&&<g fill="none" stroke="#3e2633" strokeWidth="7" opacity=".65"><path d="M132 202q21-58-13-99m20 65 24-33m-31 15-25-15M202 220q-23-70 4-135m-14 73 29-27m-25 3-23-23M265 202q-19-53 7-98m-16 54-27-20"/><g fill="#c07b80" strokeWidth="1"><ellipse cx="121" cy="113" rx="9" ry="15"/><ellipse cx="208" cy="98" rx="8" ry="13"/><ellipse cx="267" cy="117" rx="10" ry="16"/></g></g>}
     {id==='ryloth'&&<g><path d="M97 169l20-28h39l10 18h24l12-39h45l14 36 43 16v64H94z" fill="#8b654c" opacity=".65"/><path d="M114 145h41m48-20h41M103 185l65 4m36-32h56" stroke="#e6c39b" strokeWidth="4" opacity=".7"/><path d="M112 214q34-31 70-12t91-12l-17 45H120z" fill="#677152" opacity=".6"/></g>}
     {id==='krownest'&&<g><path d="M96 176l37-64 21 27 35-57 31 57 27-29 54 71z" fill="#edf1ed" opacity=".65"/><path d="M134 115l-5 52 26-25m34-57-7 75 37-20" fill="#7c96a5" opacity=".65"/><path d="M156 187h90v-29l-37-12-53 14z" fill="#506f7c" stroke="#d7e7e7" strokeWidth="2" opacity=".75"/><path d="M180 155v30m26-37v37m20-31v31" stroke="#b0d6d9" strokeWidth="2" opacity=".7"/></g>}
     {id==='atollon'&&<g fill="#795946" stroke="#c7a984" strokeWidth="2" opacity=".7"><path d="M106 164l19-50 13 13 7-39 16 67 17-28 7 53zM202 179l10-71 14 30 8-48 20 60 12-22 19 58z"/><path d="M118 192q65-18 152 6" fill="none"/></g>}
     {id==='malachor'&&<g><path d="M92 168l43-44 39 25 36-52 38 45 63 10v93H90z" fill="#292736" opacity=".7"/><path d="M155 187h90l-10-11h-70zm15-17h60l-10-12h-40zm15-18h30l-15-23z" fill="#9f8791" opacity=".7"/><path d="M113 113l42-11m64-20 39 12M115 213l57-9m51 13 37-9" stroke="#bca6bd" opacity=".3" strokeWidth="2"/></g>}
     {id==='seelos'&&<g><path d="M93 148l26-27 16 13 31-38 31 37 24-24 31 27 28-36 33 48z" fill="#607b98" opacity=".7"/><path d="M95 165q94-25 213 1v85H92z" fill="#dfd7b5" opacity=".55"/><path d="M105 180q88-14 191 0M123 202q83-13 154-1M146 220l94-2" fill="none" stroke="#f4edcf" strokeWidth="3" opacity=".6"/></g>}
     {id==='lothal'&&<g><path d="M104 104l33-27 42 10-9 30-39 7zM179 87l40-17 43 19-14 33-38-4zM118 137l40-11 29 19-17 31-45-7zM190 136l43-9 47 25-13 28-47-4zM139 185l37-2 30 24-20 25-42-12z" fill="#65744a" opacity=".55"/><path d="M105 115l51-5m34-9 53 4m-107 44 32 10m56-9 34 10m-112 39 37 8" stroke="#d1bb74" strokeWidth="4" opacity=".55"/><g fill="#ced3b0" opacity=".6"><rect x="205" y="109" width="7" height="8"/><rect x="214" y="101" width="6" height="15"/><rect x="222" y="106" width="8" height="12"/></g></g>}
     {id==='kessel'&&<g><path d="M108 90l38 23-12 29 29 25-15 39M173 59l22 36-13 24 37 29-8 40 28 33M227 78l-10 31 36 22-5 36 34 21" fill="none" stroke="#483f31" strokeWidth="10" opacity=".6"/><path d="M111 92l32 22-11 23m67 14 17 8-7 25M230 81l-10 26 29 25" fill="none" stroke="#ddba70" strokeWidth="2" opacity=".65"/><path d="M96 116q55-29 105-7t105-3M108 183q63-27 115-3t75-14" fill="none" stroke="#e3cd85" strokeWidth="16" opacity=".15"/></g>}
     {id==='stygeon-prime'&&<g><path d="M101 168l31-63 19 26 28-56 24 55 20-27 23 41 24-36 31 62z" fill="#4b6578" opacity=".6"/><path d="M118 134l14-29 10 15m25-18 12-27 14 31m66 20 11-18 11 21" fill="none" stroke="#f1f5ed" strokeWidth="6" opacity=".75"/><path d="M106 183q74-23 172 4M116 93q67-20 130 1" fill="none" stroke="#e2eff2" strokeWidth="8" opacity=".2"/></g>}
     {id==='kamino'&&<g><path d="M94 103q48-33 98-7t111-8M93 150q55-24 102-3t111-16M109 190q56-28 107-9t75-9" fill="none" stroke="#d1e5e8" strokeWidth="15" opacity=".32"/><path d="M103 118q47-23 88-4t106-6M108 164q52-20 105-1" fill="none" stroke="#ecf4f1" strokeWidth="3" opacity=".42"/><path d="M120 85q57-18 117 3M127 206q48-13 99-3" fill="none" stroke="#153c59" strokeWidth="9" opacity=".3"/></g>}
     {id==='geonosis'&&<g fill="none" stroke="#e6bf8e" opacity=".5"><path d="M113 108l27-28 18 23 16-15 22 31 17-14 30 20 28-14M111 165l29-32 22 26 19-14 19 27 23-20 31 24 31-16" strokeWidth="3"/><path d="M140 80l-8 40m42-32-7 40m56 24 9 36" strokeWidth="1.2"/></g>}
     {id==='utapau'&&<g>{[[144,97,22],[214,83,13],[190,145,29],[250,168,17],[142,191,19],[221,218,12]].map(([x,y,r],i)=><g key={i}><ellipse cx={x} cy={y} rx={r} ry={r*.6} fill="#37423d" opacity=".72"/><ellipse cx={x} cy={y} rx={r+3} ry={r*.6+3} fill="none" stroke="#e0cba1" strokeWidth="2" opacity=".5"/><path d={`M${x-r*.6} ${y+2}q${r*.6} ${r*.4} ${r*1.2} 0`} fill="none" stroke="#83a5a1" opacity=".4"/></g>)}</g>}
     {id==='kashyyyk'&&<g>{Array.from({length:28},(_,i)=><ellipse key={i} cx={110+(i*31)%173} cy={62+(i*43)%165} rx={9+i%4*3} ry={7+i%3*4} fill={i%3?'#244c39':'#8ba67a'} opacity={i%3?'.4':'.35'}/>)}<path d="M105 129q28-22 49 0t35 8M224 183q33-18 61-8" fill="none" stroke="#7ca7b3" strokeWidth="5" opacity=".42"/></g>}
     {id==='tatooine'&&<g fill="none" stroke="#f4d5a0" opacity=".3"><path d="M111 115q35-42 83-19t95-13M102 145q30-29 76-8t120-10M111 192q62-35 113-4t61-12" strokeWidth="2"/>{[0,1,2,3,4].map(i=><ellipse key={i} cx={135+i*24} cy={95+(i%3)*38} rx={7+i%2*4} ry="4" strokeWidth="1.5"/>)}</g>}
     {id==='hoth'&&<g><path d="M103 100q29-30 67-21l29-21 39 20 40 1 24 36-46-11-33 16-28-15-35 14-39-4z" fill="#edfaff" opacity=".38"/><path d="M104 180l31-19 26 7 21-22 23 9 19-17 24 17 36-2M126 199l20-20 33 12 19-8 31 19 27-17" fill="none" stroke="#517f99" strokeWidth="1.4" opacity=".55"/><path d="M119 135q46-14 88-5t80 12" fill="none" stroke="#effaff" strokeWidth="8" opacity=".2"/></g>}
     {id==='coruscant'&&<g fill="none" stroke="#f4d39a" opacity=".48"><ellipse cx="174" cy="129" rx="48" ry="24" transform="rotate(-25 174 129)"/><ellipse cx="174" cy="129" rx="72" ry="41" transform="rotate(-25 174 129)"/>{Array.from({length:18},(_,i)=><circle key={i} cx={116+(i*37)%160} cy={68+(i*29)%145} r={i%4===0?1.8:.8} fill="#ffe5ae" stroke="none"/>)}</g>}
     {id==='naboo'&&<g><path d="M109 98l25-20 25 9 9 17 22 5-6 18-22 10-8 26-21-5-7-23-24-12zM225 68l27 9 12 22-15 19-21-4-14-20zM208 167l34-16 31 15-9 25-22 8-17-11-21 11-15-14z" fill="#537255" opacity=".65"/><path d="M141 109q24 1 20 18t-17 20M227 172q29-10 28 12" fill="none" stroke="#86bbc2" strokeWidth="4" opacity=".6"/><path d="M109 81q64-16 119 10M114 177q56 16 112-1" fill="none" stroke="#e6eece" strokeWidth="9" opacity=".12"/></g>}
     {id==='scarif'&&<g><path d="M103 94q17-13 34-4l9 13-8 9-24 1zM171 65l21-7 18 12-6 16-20 5-15-10zM205 154l33-15 32 13 8 16-15 13-30-5-24 11-13-14zM142 192l21-14 15 8-3 17-20 7z" fill="#d4d4a6" opacity=".75"/><path d="M111 96l23 2M180 70l14 4M218 161l29-8 16 9" fill="none" stroke="#476f4f" strokeWidth="6" opacity=".7"/></g>}
     {id==='jedha'&&<g fill="none" stroke="#d7ccc0" opacity=".4"><path d="M110 98l23-21 26 13 20-14 29 19 27-12 40 20M103 139l27-16 32 13 24-19 31 23 32-18 43 16" strokeWidth="3"/><path d="M133 77l7 16m39-17-9 28m65-21 7 25" strokeWidth="1"/></g>}
     {id==='eadu'&&<g><path d="M95 168l29-55 18 19 26-43 22 40 19-16 25 30 22-28 40 50" fill="#273c49" opacity=".65"/><path d="M103 104q44-26 94-3t91-4M98 153q55-23 112-3t83-14" fill="none" stroke="#c4d7df" strokeWidth="13" opacity=".27"/></g>}
     {id==='lahmu'&&<g><path d="M111 82l37-13 20 22-12 28 25 24-14 31-27-12-23 14-18-32zM228 116l40-9 30 26-17 38-32-6-18 23-15-32z" fill="#303d32" opacity=".6"/><path d="M108 129q25-7 47 9M230 146l31-8" fill="none" stroke="#a5aa75" strokeWidth="7" opacity=".45"/></g>}
     {id==='mustafar'&&<g fill="none"><path d="M111 64l33 30-9 31 31 23-10 44 22 29M172 52l18 33 31 15-9 34 35 18-11 37 28 29M138 124l-29 17m57 7 25-17m30-31 28-13m-2 65 29-10" stroke="#d86628" strokeWidth="6" opacity=".65"/><path d="M111 64l33 30-9 31 31 23-10 44 22 29M172 52l18 33 31 15-9 34 35 18-11 37 28 29" stroke="#ffd071" strokeWidth="1.6" opacity=".8"/></g>}
     {id==='yavin'&&<g fill="#47724b" opacity=".55"><path d="M103 85l37-17 30 20-12 28 17 19-26 36-21-8-22 17-15-38zM225 77l28 12 15 26-14 26 13 29-31 25-24-21 6-31-19-25z"/></g>}
     <circle cx="200" cy="145" r="100" fill={`url(#${key}-shade)`}/>
    </g>
    <circle cx="200" cy="145" r="100" fill="none" stroke="#d9f2fb" strokeOpacity=".22"/>
   </g>
   {id==='geonosis'&&<g transform="rotate(-22 200 145)" fill="none"><path d="M40 145a160 41 0 0 0 320 0" stroke="#bd9975" strokeWidth="11" opacity=".52"/><path d="M26 145a174 46 0 0 0 348 0" stroke="#dac09b" strokeWidth="2" opacity=".36"/></g>}
   <g fill="#bbdbe5"><circle cx="50" cy="76" r="1.4"/><circle cx="334" cy="210" r="1"/><circle cx="310" cy="42" r="1.2"/></g>
  </svg>
  <figcaption><span>ORIGINAL PLANET STUDY</span><span>Illustrative · not surface geography</span></figcaption>
 </figure>;
}
