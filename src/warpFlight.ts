/** Presentation timing only, unrelated to canonical distance or travel time. */
export const WARP_DURATION_MS = 4200
export type WarpStage = 'charge' | 'hyperspace' | 'arrival'
export const getWarpStage = (progress: number): WarpStage => progress < .18 ? 'charge' : progress < .76 ? 'hyperspace' : 'arrival'

const clamp = (n: number) => Math.max(0, Math.min(1, n))
const ease = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t) }
const mix = (a: number, b: number, t: number) => a + (b - a) * t

type Point = { x: number; y: number }
type Flight = { from: Point; origin: Point; to: Point; initialZoom: number; baseZoom: number; arrivalZoom: number }

/** A launch, broad transit arc and close approach; source coordinates never move. */
export function sampleWarpFlight(raw: number, flight: Flight) {
  const t = clamp(raw)
  const { from, origin, to, initialZoom, baseZoom, arrivalZoom } = flight
  const stage = getWarpStage(t)
  const dx = to.x - origin.x, dy = to.y - origin.y
  const length = Math.hypot(dx, dy)
  const ux = length > .01 ? dx / length : 1, uy = length > .01 ? dy / length : 0
  const pullback = baseZoom * .5
  if (stage === 'charge') {
    const approach = ease(t / .13)
    const peak = Math.max(initialZoom, baseZoom * 1.35)
    const zoom = t < .055 ? mix(initialZoom, peak, ease(t / .055)) : mix(peak, pullback, ease((t - .055) / .125))
    return { x: mix(from.x, origin.x, approach), y: mix(from.y, origin.y, approach), zoom, stage }
  }
  // The approach begins behind the destination, avoiding a camera-position cut.
  const entry = { x: to.x - ux * 2.8, y: to.y - uy * 2.8 }
  if (stage === 'hyperspace') {
    const travel = ease((t - .18) / .58)
    const arc = Math.sin(Math.PI * travel) * Math.min(6, length * .28 + 1.5)
    return { x: mix(origin.x, entry.x, travel) - uy * arc, y: mix(origin.y, entry.y, travel) + ux * arc, zoom: pullback, stage }
  }
  const approach = 1 - Math.pow(1 - clamp((t - .76) / .24), 3)
  return { x: mix(entry.x, to.x, approach), y: mix(entry.y, to.y, approach), zoom: mix(pullback, arrivalZoom, approach), stage }
}
