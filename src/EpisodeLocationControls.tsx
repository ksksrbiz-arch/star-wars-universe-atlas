import type { KeyboardEvent } from 'react';
import type { World } from './data';

export default function EpisodeLocationControls({ worlds, unmappedCount, disabled, mapUnavailable, onFit, onSelect }: {
  worlds: World[]; unmappedCount: number; disabled: boolean; mapUnavailable: boolean;
  onFit: () => void; onSelect: (id: string) => void;
}) {
  function navigate(event: KeyboardEvent<HTMLDivElement>) {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    const buttons = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')];
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (index < 0 || !buttons.length) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
    buttons[next].focus();
  }
  return <aside className="episode-map-key" aria-label="Episode location highlights">
    <strong>{worlds.length} mapped locations highlighted</strong>
    <p>Violet rings identify sourced locations for this chapter. They do not show a route or visit order. {unmappedCount > 0 && `${unmappedCount} linked locations have no supported map position.`}</p>
    <button className="episode-fit" disabled={disabled || mapUnavailable || !worlds.length} onClick={onFit}>Fit episode locations</button>
    <p id="episode-keyboard-help">Use Left/Right or Home/End to move between location buttons; Enter previews a world. This list is not a travel sequence.</p>
    <div role="group" aria-label="Highlighted episode worlds" aria-describedby="episode-keyboard-help" onKeyDown={navigate}>{worlds.map(world => <button key={world.id} disabled={disabled} onClick={() => onSelect(world.id)}>{world.name}</button>)}</div>
  </aside>;
}
