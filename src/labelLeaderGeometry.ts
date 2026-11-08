/** Clip a source-to-label-center connector to the near edge of a screen-space label.
 * x/y describe its center relative to the source; a zero result means no exposed line. */
export function leaderEndAtLabelEdge(x: number, y: number, width: number, height: number, gap = 3): [number, number] {
  const inset = Math.min((width / 2 + gap) / Math.abs(x), (height / 2 + gap) / Math.abs(y))
  const fraction = Math.max(0, 1 - inset)
  return [x * fraction, y * fraction]
}
