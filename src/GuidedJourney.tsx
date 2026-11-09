import { useRef, useState } from 'react';
import { CATALOG, SERIES } from './catalog';
import { STORY_SEQUENCES } from './chronology';
import './guided-journey.css';
import { useSpoilerPreference } from './spoilerPreference';

export default function GuidedJourney({ watchedIds }: { watchedIds: ReadonlySet<string> }) {
 const { hideSpoilers } = useSpoilerPreference();
 const [open, setOpen] = useState(false);
 const [sequenceId, setSequenceId] = useState('ot');
 const [step, setStep] = useState(1);
 const [mode, setMode] = useState<'first' | 'resume'>('first');
 const summary = useRef<HTMLElement>(null);
 const heading = useRef<HTMLHeadingElement>(null);
 const sequence = STORY_SEQUENCES.find(entry => entry.id === sequenceId) ?? STORY_SEQUENCES[0];
 const nextUnwatched = sequence?.itemIds.find(id => !watchedIds.has(id));
 const targetId = mode === 'resume' && nextUnwatched ? nextUnwatched : sequence?.itemIds[0];
 const target = targetId ? CATALOG.find(item => item.id === targetId) : undefined;
 function restart() { setStep(1); setMode('first'); setSequenceId(STORY_SEQUENCES.some(entry => entry.id === 'ot') ? 'ot' : STORY_SEQUENCES[0]?.id ?? ''); }
 function dismiss() { setOpen(false); restart(); summary.current?.focus(); }
 return <details className="guided-journey" open={open} onToggle={event => setOpen(event.currentTarget.open)}>
  <summary ref={summary}>New here? Start a guided journey <span aria-hidden="true">↗</span></summary>
  <section aria-label="Guided journey">
   <div className="guided-heading"><h2 ref={heading} tabIndex={-1}>{step === 1 ? '1 · Choose your story' : '2 · Pick your starting point'}</h2><button onClick={dismiss}>Dismiss guide</button></div>
   {!sequence ? <p className="guided-order">No story collections are available yet.</p> : step === 1 ? <>
    <p>{hideSpoilers ? 'Choose a collection. You control when its locations are revealed.' : 'Choose a collection and explore its sourced locations.'}</p>
    <label>Journey collection<select value={sequenceId} onChange={event => {setSequenceId(event.target.value); setMode('first');}}>{STORY_SEQUENCES.map(entry => <option key={entry.id} value={entry.id}>{SERIES.find(series => series.id === entry.id)?.title || entry.title}</option>)}</select></label>
    <p className="guided-order">{sequence.title}. {sequence.itemIds.length ? `${sequence.itemIds.length} chapters.` : 'No chapters are available in this collection yet.'} This is a viewing sequence, not a character’s travel route.</p>
    <button className="guided-primary" disabled={!sequence.itemIds.length} onClick={() => {setStep(2); heading.current?.focus();}}>Choose starting point →</button>
   </> : <>
    <label>Starting point<select value={mode} onChange={event => setMode(event.target.value as 'first' | 'resume')}><option value="first">{nextUnwatched ? 'First chapter in story order' : 'Revisit the first chapter — collection complete'}</option><option value="resume" disabled={!nextUnwatched}>First unwatched chapter{!nextUnwatched ? ' — collection complete' : ''}</option></select></label>
    {target ? <p className="guided-start">You’ll open <strong>{target.title}</strong>.</p> : <p className="guided-start" role="status">This collection has no available chapters yet. Restart the guide to choose another.</p>}
    <ol><li>{hideSpoilers ? <>Open the chapter and choose <strong>Reveal locations</strong> when you’re ready. Watched chapters already show their links.</> : <>Open the chapter to see its sourced location links.</>}</li><li>Select a mapped location to preview it, then choose <strong>Jump</strong>. Unmapped locations remain readable.</li><li>Use <strong>Skip animation</strong> or <strong>Cancel</strong> at any time during travel.</li></ol>
    <p>Your watch progress stays unchanged until you mark a title watched.</p>
    <div className="guided-actions">{target && <a className="guided-primary" href={`#journey/${target.id}`}>Open chapter →</a>}<button onClick={() => {restart(); heading.current?.focus();}}>Restart guide</button></div>
   </>}
  </section>
 </details>;
}
