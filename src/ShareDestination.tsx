import { useEffect, useState } from 'react';
import { Link } from 'lucide-react';

export default function ShareDestination({worldId, worldName}: {worldId: string; worldName: string}) {
  const [status, setStatus] = useState('');
  const [fallback, setFallback] = useState(false);
  const url = `${location.origin}${location.pathname}#galaxy/${worldId}`;
  useEffect(() => { setStatus(''); setFallback(false); }, [worldId]);
  async function copy() {
    try { await navigator.clipboard.writeText(url); setStatus(`Link to ${worldName} copied.`); }
    catch { setFallback(true); setStatus('Copy the destination link below.'); }
  }
  return <div className="destination-share">
    <button className="quiet-button" onClick={copy}><Link size={14}/> Copy destination link</button>
    <span role="status">{status}</span>
    {fallback && <input aria-label="Destination link" readOnly value={url} onFocus={event => event.currentTarget.select()}/>}
  </div>;
}
