import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import './atlas-audio.css';

/** Original synthesized interface sounds. No recorded score or film samples. */
export default function AtlasAudio({ phase, currentId }: { phase: string; currentId: string }) {
  const [enabled, setEnabled] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const requestId = useRef(0);
  const context = useRef<AudioContext | null>(null);
  const active = useRef(false);
  const previous = useRef({ phase, currentId });
  const nodes = useRef<OscillatorNode[]>([]);
  const silence = () => { for (const node of nodes.current) { try { node.stop(); } catch {} } nodes.current = []; };
  function tone(kind: 'tap' | 'launch' | 'arrival') {
    const ctx = context.current;
    if (!active.current || !ctx || ctx.state !== 'running' || document.hidden) return;
    if (kind === 'tap' && nodes.current.length) return; // never cut off a longer launch/arrival tone
    silence();
    const time = ctx.currentTime;
    const duration = kind === 'launch' ? 1.3 : kind === 'arrival' ? .45 : .07;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(kind === 'launch' ? 75 : kind === 'arrival' ? 440 : 720, time);
    oscillator.frequency.exponentialRampToValueAtTime(kind === 'launch' ? 430 : kind === 'arrival' ? 660 : 540, time + duration);
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(kind === 'launch' ? .035 : .025, time + .012);
    gain.gain.exponentialRampToValueAtTime(.0001, time + duration);
    oscillator.connect(gain); gain.connect(ctx.destination);
    nodes.current.push(oscillator);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); nodes.current = nodes.current.filter(node => node !== oscillator); };
    oscillator.start(time); oscillator.stop(time + duration + .02);
  }
  async function toggle() {
    if (pending.current) return;
    pending.current = true; setBusy(true);
    const ticket = ++requestId.current;
    try {
      if (active.current) {
        active.current = false; setEnabled(false); silence();
        await context.current?.suspend();
      } else {
        const ctx = context.current ??= new AudioContext();
        await ctx.resume();
        if (ticket !== requestId.current || context.current !== ctx) return;
        active.current = true; setEnabled(true); setUnavailable(false); tone('arrival');
      }
    } catch {
      if (ticket === requestId.current) { active.current = false; setEnabled(false); setUnavailable(true); }
    } finally {
      if (ticket === requestId.current) { pending.current = false; setBusy(false); }
    }
  }
  useEffect(() => {
    if (phase === 'warping' && previous.current.phase !== 'warping') tone('launch');
    else if (currentId !== previous.current.currentId) tone('arrival');
    else if (previous.current.phase === 'warping' && phase !== 'warping') silence();
    previous.current = { phase, currentId };
  }, [phase, currentId]);
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const button = (event.target as Element)?.closest?.('button');
      if (button && !button.disabled && !button.closest('.atlas-audio') && !/jump|skip|cancel/i.test(button.textContent || '')) tone('tap');
    };
    const onHidden = () => { if (document.hidden) silence(); };
    document.addEventListener('click', onClick);
    document.addEventListener('visibilitychange', onHidden);
    return () => { document.removeEventListener('click', onClick); document.removeEventListener('visibilitychange', onHidden); requestId.current++; pending.current = false; active.current = false; silence(); context.current?.close().catch(() => {}); context.current = null; };
  }, []);
  return <div className="atlas-audio"><button type="button" role="switch" aria-checked={enabled} aria-label={`Sound ${enabled ? 'on' : 'off'}, interface sound`} aria-disabled={busy || undefined} onClick={toggle}>{enabled ? <Volume2 size={16} aria-hidden="true"/> : <VolumeX size={16} aria-hidden="true"/>}<span>Sound {enabled ? 'on' : 'off'}</span></button>{unavailable && <span role="status">Sound unavailable in this browser.</span>}</div>;
}
