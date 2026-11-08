import { useEffect, useState } from 'react';
import './transit-status.css';
import { WARP_DURATION_MS, getWarpStage } from './warpFlight';

type TransitStatusProps = {
  origin: string;
  destination: string;
  startedAt: number;
  onCancel: () => void;
  onSkip: () => void;
  reducedMotion: boolean;
};

/** Visual flight timing only: this progress does not represent canonical travel time. */
export default function TransitStatus({ origin, destination, startedAt, onCancel, onSkip, reducedMotion }: TransitStatusProps) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (reducedMotion) { setProgress(1); return; }
    let frame = 0;
    let active = true;
    const update = () => {
      if (!active) return;
      const next = Math.min(1, Math.max(0, (performance.now() - startedAt) / WARP_DURATION_MS));
      setProgress(next);
      if (next < 1) frame = requestAnimationFrame(update);
    };
    update();
    return () => { active = false; cancelAnimationFrame(frame); };
  }, [startedAt, reducedMotion]);
  const stage = { charge: 0, hyperspace: 1, arrival: 2 }[getWarpStage(progress)];
  const stages = ['Accelerating', 'Hyperspace', 'Arrival'];

  return <div className="transit-panel transit-status transit-hud" data-stage={stage}>
    <div className="transit-hud-destination" aria-hidden="true">
      <span>Destination locked</span><strong>{destination}</strong>
    </div>
    <section className="transit-hud-console" aria-label="Hyperspace transit">
      <div className="transit-hud-route"><span>{origin}</span><span aria-hidden="true">→</span><strong>{destination}</strong></div>
      <p className="transit-hud-announcement" role="status" aria-live="polite" aria-atomic="true">{stages[stage]}<span className="sr-only">: {origin} to {destination}.</span></p>
      <div className="transit-hud-track" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></div>
      <div className="transit-hud-phases" aria-hidden="true">{stages.map((label, index) => <span key={label} data-active={index === stage}>{String(index + 1).padStart(2, '0')} {label}</span>)}</div>
      <div className="transit-hud-actions"><button type="button" autoFocus onClick={onSkip}>Skip animation <span aria-hidden="true">↗</span></button><button type="button" onClick={onCancel}>Cancel</button></div>
    </section>
  </div>;
}
