import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import './galaxy-labels.css'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import type { World } from './data'
import WarpEffect from './WarpEffect'
import GalaxyAtmosphere, { type GalaxyQuality } from './GalaxyAtmosphere'
import GalacticGeography from './GalacticGeography'
import { GALACTIC_REGION_LABELS } from './galacticRegions'
import HyperspaceRoutes from './HyperspaceLayer'
import { HYPERSPACE_ROUTE_LABELS } from './hyperspaceRoutes'

/** Small screen-aligned label bridge. Drei Html synchronously unmounts its DOM
 * root during React's effect cleanup, which warns during StrictMode replay.
 * Detach immediately, then dispose that root after the current React commit. */
function Html({ children, position, style, zIndexRange = [12, 1], minZoom = 0 }: {
  children: ReactNode; position?: [number, number, number]; style?: CSSProperties;
  center?: boolean; zIndexRange?: [number, number]; minZoom?: number;
}) {
  const { gl } = useThree()
  const group = useRef<THREE.Group>(null)
  const element = useRef<HTMLDivElement | null>(null)
  const root = useRef<Root | null>(null)
  const point = useMemo(() => new THREE.Vector3(), [])
  useEffect(() => {
    const container = document.createElement('div')
    container.dataset.mapHtml = 'true'
    Object.assign(container.style, { position: 'absolute', top: '0', left: '0', pointerEvents: 'none', visibility: 'hidden' })
    gl.domElement.parentElement?.appendChild(container)
    const domRoot = createRoot(container)
    element.current = container
    root.current = domRoot
    return () => {
      container.remove()
      if (root.current === domRoot) { root.current = null; element.current = null }
      queueMicrotask(() => domRoot.unmount())
    }
  }, [gl])
  useEffect(() => {
    root.current?.render(<div style={{ transform: 'translate(-50%, -50%)', pointerEvents: 'auto', ...style }}>{children}</div>)
  })
  useFrame(({ camera, size }) => {
    if (!group.current || !element.current) return
    group.current.getWorldPosition(point)
    point.project(camera)
    const visible = point.z >= -1 && point.z <= 1 && (camera as THREE.OrthographicCamera).zoom >= minZoom
    element.current.style.visibility = visible ? 'visible' : 'hidden'
    element.current.style.zIndex = String(zIndexRange[0])
    element.current.style.transform = `translate3d(${(point.x + 1) * size.width / 2}px,${(1 - point.y) * size.height / 2}px,0)`
  })
  return <group ref={group} position={position} />
}

export type MapCommand = {
  id: number
  action: 'zoomIn' | 'zoomOut' | 'panLeft' | 'panRight' | 'panUp' | 'panDown'
}

type Props = {
  command?: MapCommand | null
  regionsVisible?: boolean
  routesVisible?: boolean
  gridVisible?: boolean
  quality?: GalaxyQuality
  highlightedIds?: ReadonlySet<string>
  worlds: World[]
  selectedId: string
  targetId: string | null
  phase: 'idle' | 'warping'
  reducedMotion: boolean
  onSelect: (id: string) => void
  onArrive: () => void
  resetKey: number
  fitKey?: number
  /** Display-only connection from committed destination to a preview; not a hyperspace route. */
  previewId?: string
}

function Background({ quality, reducedMotion, gridVisible = true }: { quality?: GalaxyQuality; reducedMotion: boolean; gridVisible?: boolean }) {
  const stars = useMemo(() => {
    const p = new Float32Array(1800 * 3)
    let s = 1729
    const rand = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 }
    for (let i = 0; i < 1800; i++) {
      p[i * 3] = (rand() - .5) * 66
      p[i * 3 + 1] = (rand() - .5) * 50
      p[i * 3 + 2] = -1 + rand() * .15
    }
    return p
  }, [])
  const rings = useMemo(() => {
    const out: number[] = []
    for (let x = -10.5; x <= 10.5; x += 1) out.push(x, -10.5, -.6, x, 10.5, -.6)
    for (let y = -10.5; y <= 10.5; y += 1) out.push(-10.5, y, -.6, 10.5, y, -.6)
    return new Float32Array(out)
  }, [])
  return <>
    <mesh position={[0, 0, -3]}>
      <planeGeometry args={[78, 64]} />
      <meshBasicMaterial color="#03090e" />
    </mesh>
    <GalaxyAtmosphere quality={quality} reducedMotion={reducedMotion} />
    <points>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[stars, 3]} /></bufferGeometry>
      <pointsMaterial color="#b6cbd6" size={1.15} sizeAttenuation={false} transparent opacity={.60} depthWrite={false} />
    </points>
    <lineSegments visible={gridVisible}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[rings, 3]} /></bufferGeometry>
      <lineBasicMaterial color="#91adbd" transparent opacity={.065} depthWrite={false} />
    </lineSegments>
  </>
}

function ReferenceGridLabels() {
  return <>{Array.from({length:21}, (_,i)=><group key={i}>
    <Html position={[i-10,10.85,0]} style={{pointerEvents:'none'}}><span className="grid-map-label">{String.fromCharCode(65+i)}</span></Html>
    <Html position={[10.85,10-i,0]} style={{pointerEvents:'none'}}><span className="grid-map-label">{i+1}</span></Html>
  </group>)}</>
}

const labelOffsets: Record<string, [number, number]> = {
  hoth: [-72, 12], bespin: [-20, -18], dagobah: [30, 12],
  alderaan: [38, 20], coruscant: [-88, -12], mandalore: [-37, 6], yavin: [30, -12],
}

const leaderLayouts = new WeakMap<HTMLCanvasElement, Map<string, (dx: number, dy: number, visible: boolean) => void>>()
function LabelLeader({ worldId, offset, minZoom = 0, active = false }: { worldId: string; offset: [number, number]; minZoom?: number; active?: boolean }) {
  const { camera, gl } = useThree()
  const hudOffset = useRef<[number, number]>([0,0])
  const labelVisible = useRef(false)
  const positions = useMemo(() => new Float32Array([0, 0, .01, 0, 0, .01]), [])
  const geometry = useRef<THREE.BufferGeometry>(null)
  const leader = useRef<THREE.LineSegments>(null)
  const update = () => {
    if (leader.current) leader.current.visible = labelVisible.current && (camera as THREE.OrthographicCamera).zoom >= minZoom
    const x = (offset[0] + hudOffset.current[0]) / (camera as THREE.OrthographicCamera).zoom
    const y = -.39 - (offset[1] + hudOffset.current[1]) / (camera as THREE.OrthographicCamera).zoom
    if (positions[3] === Math.fround(x) && positions[4] === Math.fround(y)) return
    positions[3] = x; positions[4] = y
    if (geometry.current) { geometry.current.attributes.position.needsUpdate = true; geometry.current.computeBoundingSphere() }
  }
  useEffect(() => {
    let registry = leaderLayouts.get(gl.domElement)
    if (!registry) { registry = new Map(); leaderLayouts.set(gl.domElement, registry) }
    const apply = (dx: number, dy: number, visible: boolean) => { hudOffset.current = [dx,dy]; labelVisible.current = visible; update() }
    registry.set(worldId, apply)
    return () => { if (registry.get(worldId) === apply) registry.delete(worldId) }
  }, [gl, worldId, offset, camera])
  useFrame(update)
  return <lineSegments ref={leader}>
    <bufferGeometry ref={geometry}><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
    <lineBasicMaterial color={active ? '#e1f8ff' : '#6e929f'} transparent opacity={active ? .95 : .22} depthWrite={false} />
  </lineSegments>
}

const featuredWorlds = new Set(['tatooine','alderaan','yavin','coruscant','hoth','bespin','dagobah','mandalore'])
const haloVertex = `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`
const haloFragment = `varying vec2 vUv;uniform vec3 tint;void main(){float r=length(vUv-.5)*2.;float glow=exp(-r*r*5.)*(1.-smoothstep(.72,1.,r));gl_FragColor=vec4(tint,glow*.35);}`

/** Only optional zoom-level labels yield to overlaps. Current, preview and chapter
 * labels stay present; every destination also remains available in the finder. */
function LabelDeclutter() {
  const {gl,size,camera,invalidate} = useThree()
  useEffect(() => {
    let active = true
    const reflow = () => { if (active) invalidate() }
    document.fonts.ready.then(reflow)
    document.fonts.addEventListener('loadingdone', reflow)
    return () => { active = false; document.fonts.removeEventListener('loadingdone', reflow) }
  }, [invalidate])
  useFrame(() => {
    const root = gl.domElement.parentElement
    if (!root) return
    const bounds = gl.domElement.getBoundingClientRect()
    const priority = (label: HTMLButtonElement) => label === document.activeElement ? 5 : label.classList.contains('is-current') ? 4 : Number(label.dataset.labelPriority)
    const labels = [...root.querySelectorAll<HTMLButtonElement>('.world-map-label')]
      .sort((a,b) => priority(b)-priority(a) || b.offsetWidth-a.offsetWidth || (a.textContent ?? '').localeCompare(b.textContent ?? ''))
    const denseStory = size.width <= 400 && labels.filter(label => Number(label.dataset.labelPriority) === 2).length >= 6
    const stage = gl.domElement.closest('.map-stage')
    const protectedRects = [...(stage?.querySelectorAll<HTMLElement>('.map-tools,.map-pan-controls,.galaxy-symbol-key,.map-jump-bar,.current-location,.mini-map') ?? [])]
      .map(element => element.getBoundingClientRect()).filter(rect => rect.width > 0 && rect.height > 0)
    const overlapsRect = (a: DOMRect, b: DOMRect) => a.left < b.right+5 && a.right > b.left-5 && a.top < b.bottom+5 && a.bottom > b.top-5
    const inside = (rect: DOMRect) => rect.left >= bounds.left+5 && rect.right <= bounds.right-5 && rect.top >= bounds.top+5 && rect.bottom <= bounds.bottom-5
    const occupied: DOMRect[] = []
    for (const label of labels) {
      const container = label.closest<HTMLElement>('[data-map-html]')
      if (!container || container.style.visibility !== 'visible') {
        leaderLayouts.get(gl.domElement)?.get(label.dataset.worldId ?? '')?.(0,0,false)
        continue
      }
      label.style.translate = 'none'
      let rect = label.getBoundingClientRect()
      const essential = Number(label.dataset.labelPriority)>0 || label === document.activeElement
      // Clamp labels for on-screen priority markers, never move their source dots.
      const anchor = container.getBoundingClientRect()
      const onScreen = anchor.left >= bounds.left && anchor.left <= bounds.right && anchor.top >= bounds.top && anchor.top <= bounds.bottom
      let dx = 0, dy = 0
      if (essential && onScreen) {
        dx = Math.max(bounds.left+5-rect.left, Math.min(0,bounds.right-5-rect.right))
        dy = Math.max(bounds.top+5-rect.top, Math.min(0,bounds.bottom-5-rect.bottom))
        if (dx || dy) { label.style.translate = `${dx}px ${dy}px`; rect = new DOMRect(rect.x+dx,rect.y+dy,rect.width,rect.height) }
      }
      // Move only the label; its leader follows the displacement to the unchanged source dot.
      // Keep the traced source ring visible beside its label, including at overview zoom.
      const sourceClearance = label === document.activeElement
        ? [new DOMRect(anchor.left-14, anchor.top-.39*(camera as THREE.OrthographicCamera).zoom-14, 28, 28)] : []
      const obstacles = [...protectedRects,...occupied,...sourceClearance]
      const packStory = denseStory && priority(label) === 2
      if (essential && onScreen && (packStory || obstacles.some(other => overlapsRect(rect, other)))) {
        // Edge candidates handle adjacent labels; a small bounded search handles tight clusters.
        const nearby = [1,2,3].flatMap(step => [-1,0,1].flatMap(x => [-1,0,1].filter(y => x || y).map(y =>
          new DOMRect(rect.x+x*step*(rect.width+6),rect.y+y*step*(rect.height+6),rect.width,rect.height))))
        const clearCandidates = (items: DOMRect[]) => items.filter(candidate => inside(candidate) && !obstacles.some(other => overlapsRect(candidate,other)))
          .sort((a,b) => packStory ? a.y-b.y || a.x-b.x : Math.hypot(a.x-rect.x,a.y-rect.y)-Math.hypot(b.x-rect.x,b.y-rect.y))
        let candidates = clearCandidates([...obstacles.flatMap(other => [
          new DOMRect(other.left-rect.width-6,rect.y,rect.width,rect.height),
          new DOMRect(other.right+6,rect.y,rect.width,rect.height),
          new DOMRect(rect.x,other.top-rect.height-6,rect.width,rect.height),
          new DOMRect(rect.x,other.bottom+6,rect.width,rect.height),
        ]), ...nearby])
        if (packStory || !candidates.length) {
          const xs = [bounds.left+6, bounds.right-rect.width-6, ...obstacles.flatMap(other => [other.left-rect.width-6, other.right+6])]
          const ys = [bounds.top+6, bounds.bottom-rect.height-6, ...obstacles.flatMap(other => [other.top-rect.height-6, other.bottom+6])]
          candidates = clearCandidates(xs.flatMap(x => ys.map(y => new DOMRect(x,y,rect.width,rect.height))))
        }
        if (!candidates.length) candidates = clearCandidates(Array.from({length: 32}, (_, row) => Array.from({length: 20}, (_, col) => new DOMRect(bounds.left+6+col*(bounds.width-rect.width-12)/19, bounds.top+6+row*(bounds.height-rect.height-12)/31, rect.width, rect.height))).flat())
        if (candidates[0]) { const next = candidates[0]; dx += next.x-rect.x; dy += next.y-rect.y; rect = next; label.style.translate = `${dx}px ${dy}px` }
      }
      label.dataset.labelClamped = String(Boolean(dx || dy))
      const clipped = rect.left < bounds.left+4 || rect.right > bounds.right-4 || rect.top < bounds.top+4 || rect.bottom > bounds.bottom-4
      const overlaps = occupied.some(other => rect.left < other.right+4 && rect.right > other.left-4 && rect.top < other.bottom+4 && rect.bottom > other.top-4)
      const hidden = !essential && (clipped || overlaps || protectedRects.some(other => overlapsRect(rect,other)))
      label.dataset.decluttered = String(hidden)
      leaderLayouts.get(gl.domElement)?.get(label.dataset.worldId ?? '')?.(dx,dy,!hidden)
      if (!hidden) occupied.push(rect)
    }
  })
  // Keep resize in the component lifecycle without creating a continuous loop.
  return <group name={`map-label-layout-${size.width}-${size.height}`} />
}

/** Fixed-screen acquisition marks distinguish a committed location from a preview.
 * Updated only on demanded frames; these are interface marks, not geography. */
function LocationReticle({ color }: { color: string }) {
  const group = useRef<THREE.Group>(null)
  const points = useMemo(() => new Float32Array([
    -18,-8,0,-18,-18,0, -18,-18,0,-8,-18,0,
    18,-8,0,18,-18,0, 18,-18,0,8,-18,0,
    -18,8,0,-18,18,0, -18,18,0,-8,18,0,
    18,8,0,18,18,0, 18,18,0,8,18,0,
  ]), [])
  useFrame(({camera}) => { group.current?.scale.setScalar(1 / (camera as THREE.OrthographicCamera).zoom) })
  return <group ref={group} position={[0,0,.025]} name="committed-location-reticle">
    <lineSegments raycast={() => undefined}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[points,3]}/></bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={.72} depthWrite={false}/>
    </lineSegments>
  </group>
}

/** Screen-space story beacon stays legible at galaxy overview scale.
 * It marks an independently sourced appearance, never a route or an event order. */
function StoryBeacon() {
  const group = useRef<THREE.Group>(null)
  useFrame(({camera}) => { group.current?.scale.setScalar(1 / (camera as THREE.OrthographicCamera).zoom) })
  return <group ref={group} position={[0,0,.035]} name="sourced-story-beacon">
    <mesh raycast={() => undefined}>
      <ringGeometry args={[14.5, 15.5, 48]}/>
      <meshBasicMaterial color="#c49aff" transparent opacity={.75} depthWrite={false}/>
    </mesh>
    <mesh raycast={() => undefined}>
      <ringGeometry args={[6, 7.5, 4]}/>
      <meshBasicMaterial color="#e3c6ff" transparent opacity={.95} depthWrite={false}/>
    </mesh>
  </group>
}

/** Interaction-only ring identifies the source dot of a displaced name. */
function LabelSourceFocus() {
  const ring = useRef<THREE.Mesh>(null)
  useFrame(({camera}) => { ring.current?.scale.setScalar(1 / (camera as THREE.OrthographicCamera).zoom) })
  return <mesh ref={ring} position={[0,0,.05]} raycast={() => undefined}>
    <ringGeometry args={[10,11.5,48]}/>
    <meshBasicMaterial color="#e1f8ff" transparent opacity={.95} depthWrite={false}/>
  </mesh>
}

function WorldMarker({ world, highlighted, selected, previewed, disabled, onSelect, sharedOffset }: { sharedOffset?: [number, number]; world: World; highlighted: boolean; selected: boolean; previewed: boolean; disabled: boolean; onSelect: Props['onSelect'] }) {
  const drag = useRef({ x: 0, y: 0, moved: false })
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const tracingSource = !disabled && (hovered || focused)
  const { size, invalidate } = useThree()
  const color = selected ? '#ffd49b' : previewed ? '#c4edf5' : highlighted ? '#dbb9ff' : '#91b9c8'
  const offset = sharedOffset ?? labelOffsets[world.id] ?? [0, 0]
  const priority = selected || previewed ? 3 : highlighted ? 2 : featuredWorlds.has(world.id) ? 1 : 0
  const haloUniforms = useMemo(() => ({tint: {value: new THREE.Color(color)}}), [color])
  const minZoom = priority > 0 ? 0 : Math.max(24, Math.min(55, size.width / 9))
  return <group position={[world.x * 10, world.y * 10, .1]}>
    <LabelLeader worldId={world.id} offset={offset} minZoom={minZoom} active={tracingSource} />
    {tracingSource && <LabelSourceFocus/>}
    {(selected || previewed || highlighted) && <mesh position={[0,0,-.015]} raycast={()=>undefined}>
      <circleGeometry args={[highlighted ? .56 : .46,48]}/>
      <shaderMaterial vertexShader={haloVertex} fragmentShader={haloFragment} uniforms={haloUniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false}/>
    </mesh>}
    <mesh><circleGeometry args={[selected ? .115 : .068, 24]} /><meshBasicMaterial color={color} /></mesh>
    {highlighted && <StoryBeacon/>}
    {selected && <>
      <LocationReticle color={color}/>
      <mesh><ringGeometry args={[.23, .242, 64]} /><meshBasicMaterial color="#dbad72" transparent opacity={.8} /></mesh>
      <mesh><ringGeometry args={[.33, .338, 64]} /><meshBasicMaterial color="#dbad72" transparent opacity={.24} /></mesh>
    </>}
    {previewed && !selected && <mesh><ringGeometry args={[.2, .215, 48]} /><meshBasicMaterial color="#a3d9e6" transparent opacity={.8} /></mesh>}
    <Html center position={[0, -.39, .2]} zIndexRange={[12, 1]} minZoom={minZoom}>
      <button className={`world-map-label${selected ? ' is-current' : ''}${previewed ? ' is-preview' : ''}${highlighted ? ' is-episode' : ''}`} data-source-focus={tracingSource} data-label-priority={priority} data-world-id={world.id} data-episode-location={highlighted ? world.id : undefined} title={`${world.name} · source grid ${world.grid}${highlighted ? ' · Sourced chapter location; no visit order implied' : ''}`} disabled={disabled}
        onFocus={() => { setFocused(true); invalidate() }} onBlur={() => { setFocused(false); invalidate() }}
        onPointerEnter={(e) => { if (e.pointerType !== 'touch') setHovered(true) }} onPointerLeave={() => setHovered(false)}
        onPointerDown={(e) => { drag.current = { x: e.clientX, y: e.clientY, moved: false }; e.currentTarget.setPointerCapture(e.pointerId) }}
        onPointerMove={(e) => { if (e.buttons && Math.hypot(e.clientX - drag.current.x, e.clientY - drag.current.y) > 6) drag.current.moved = true }}
        onPointerCancel={() => { drag.current.moved = true }}
        onClick={(e) => { e.stopPropagation(); if (e.detail === 0 || !drag.current.moved) onSelect(world.id) }} aria-label={`Explore ${world.name}`} aria-pressed={selected}
        style={{ color, cursor: disabled ? 'default' : 'pointer', fontSize: selected || highlighted ? 12 : 11, fontWeight: selected || highlighted ? 600 : 500, padding: '12px 10px', minHeight: 44, transform: `translate(${offset[0]}px, ${offset[1]}px)`, textShadow: '0 2px 8px #000, 0 0 5px #000', letterSpacing: '.035em', whiteSpace: 'nowrap', fontFamily: 'inherit', opacity: disabled ? .35 : 1, transition: 'opacity 180ms' }}>
        <span className="map-label-symbol" aria-hidden="true">{selected ? '●' : previewed ? '◇' : highlighted ? '◆' : '·'}</span><span>{world.name}</span>{(selected || previewed) && <span className="map-label-grid" aria-hidden="true">{world.grid}</span>}
      </button>
    </Html>
  </group>
}

function PreviewConnection({ from, to }: { from: World; to: World }) {
  const line = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(from.x * 10, from.y * 10, .05),
      new THREE.Vector3(to.x * 10, to.y * 10, .05),
    ])
    const result = new THREE.Line(geometry, new THREE.LineDashedMaterial({ color: '#94bfc9', dashSize: .18, gapSize: .15, transparent: true, opacity: .5, depthWrite: false }))
    result.computeLineDistances()
    return result
  }, [from.x, from.y, to.x, to.y])
  useEffect(() => () => { line.geometry.dispose(); (line.material as THREE.Material).dispose() }, [line])
  return <primitive object={line} />
}

function Scene(props: Props) {
  const { camera, size, invalidate } = useThree()
  const controls = useRef<OrbitControlsImpl>(null)
  const cameraO = camera as THREE.OrthographicCamera
  const baseZoom = Math.max(12, Math.min(size.width / 29, size.height / 23))
  const [limits, setLimits] = useState([baseZoom * .65, baseZoom * 4])
  const animation = useRef<{ started: number; from: THREE.Vector3; to: THREE.Vector3; zoom: number; targetId: string; done: boolean } | null>(null)
  const fitted = useRef({ key: props.fitKey ?? 0, ids: '', active: false });
  const highlightedKey = [...(props.highlightedIds ?? [])].sort().join('|');
  const previousSelected = useRef(props.selectedId)
  const previousFraming = useRef<{ zoom: number; resetKey: number } | null>(null)
  const onArrive = useRef(props.onArrive)
  onArrive.current = props.onArrive
  const warpProgress = useRef(0)
  const lastCommand = useRef<number | null>(null)

  useEffect(() => {
    const previous = previousFraming.current
    const reset = !previous || previous.resetKey !== props.resetKey
    cameraO.zoom = reset ? baseZoom : cameraO.zoom * baseZoom / previous.zoom
    if (reset) {
      fitted.current.active = false
      animation.current = null
      cameraO.position.set(0, 0, 22)
      controls.current?.target.set(0, 0, 0)
    }
    cameraO.updateProjectionMatrix()
    controls.current?.update()
    setLimits([baseZoom * .65, baseZoom * 4])
    previousFraming.current = { zoom: baseZoom, resetKey: props.resetKey }
    invalidate()
  }, [baseZoom, props.resetKey, cameraO, invalidate])

  useEffect(() => {
    const requested = (props.fitKey ?? 0) !== fitted.current.key
    if (requested) fitted.current = { key: props.fitKey ?? 0, ids: highlightedKey, active: true }
    if (fitted.current.ids !== highlightedKey || props.phase !== 'idle') fitted.current.active = false
    if (!fitted.current.active) return
    const worlds = props.worlds.filter(world => props.highlightedIds?.has(world.id))
    if (!worlds.length) return
    const xs = worlds.map(world => world.x * 10), ys = worlds.map(world => world.y * 10)
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys)
    // Pixel padding accommodates the screen-aligned labels; source positions never move.
    const usableWidth = Math.max(64, size.width - Math.min(260, size.width * .65))
    const usableHeight = Math.max(64, size.height - 180)
    const zoom = Math.max(1, Math.min(baseZoom * 4, usableWidth / Math.max(1, maxX - minX), usableHeight / Math.max(1, maxY - minY)))
    cameraO.position.set((minX + maxX) / 2, (minY + maxY) / 2, 22)
    cameraO.zoom = zoom
    controls.current?.target.set(cameraO.position.x, cameraO.position.y, 0)
    setLimits([Math.min(baseZoom * .65, zoom), baseZoom * 4])
    cameraO.updateProjectionMatrix()
    controls.current?.update()
    invalidate()
  }, [props.fitKey, highlightedKey, props.phase, size.width, size.height, baseZoom, cameraO, invalidate])

  useEffect(() => {
    const command = props.command
    if (!command || command.id === lastCommand.current) return
    // Consume even during travel: a disabled/stale command must not replay on arrival.
    lastCommand.current = command.id
    if (props.phase !== 'idle') return
    fitted.current.active = false
    if (command.action === 'zoomIn' || command.action === 'zoomOut') {
      cameraO.zoom = THREE.MathUtils.clamp(cameraO.zoom * (command.action === 'zoomIn' ? 1.25 : .8), limits[0], limits[1])
      cameraO.updateProjectionMatrix()
    } else {
      const dx = command.action === 'panLeft' ? -1 : command.action === 'panRight' ? 1 : 0
      const dy = command.action === 'panDown' ? -1 : command.action === 'panUp' ? 1 : 0
      const x = THREE.MathUtils.clamp(cameraO.position.x + dx * size.width / cameraO.zoom * .2, -15, 15)
      const y = THREE.MathUtils.clamp(cameraO.position.y + dy * size.height / cameraO.zoom * .2, -15, 15)
      controls.current?.target.add(new THREE.Vector3(x - cameraO.position.x, y - cameraO.position.y, 0))
      cameraO.position.x = x
      cameraO.position.y = y
    }
    controls.current?.update()
    invalidate()
  }, [props.command, props.phase, cameraO, size.width, size.height, limits, invalidate])

  useEffect(() => {
    const world = props.worlds.find(w => w.id === props.targetId)
    if (props.phase !== 'warping' || !world) {
      const a = animation.current
      if (a && !a.done) {
        const skipped = props.selectedId === a.targetId
        camera.position.copy(skipped ? a.to : a.from)
        cameraO.zoom = skipped ? Math.min(baseZoom * 1.48, limits[1]) : a.zoom
        controls.current?.target.set(camera.position.x, camera.position.y, 0)
        cameraO.updateProjectionMatrix()
        controls.current?.update()
        invalidate()
      }
      animation.current = null
      warpProgress.current = 0
      return
    }
    warpProgress.current = 0
    animation.current = { started: performance.now(), from: camera.position.clone(), to: new THREE.Vector3(world.x * 10, world.y * 10, 22), zoom: cameraO.zoom, targetId: world.id, done: false }
    invalidate()
  }, [props.phase, props.targetId, props.worlds, camera, cameraO, invalidate])

  useEffect(() => {
    if (props.phase !== 'idle' || previousSelected.current === props.selectedId) return
    previousSelected.current = props.selectedId
    const world = props.worlds.find(w => w.id === props.selectedId)
    if (!world) return
    camera.position.set(world.x * 10, world.y * 10, 22)
    controls.current?.target.set(world.x * 10, world.y * 10, 0)
    controls.current?.update()
    invalidate()
  }, [props.selectedId, props.phase, props.worlds, camera, invalidate])

  useFrame(() => {
    const a = animation.current
    if (!a || a.done) return
    const duration = props.reducedMotion ? 180 : 2000
    const t = Math.min(1, (performance.now() - a.started) / duration)
    warpProgress.current = t
    const eased = t * t * (3 - 2 * t)
    camera.position.lerpVectors(a.from, a.to, eased)
    const target = controls.current?.target
    if (target) { target.x = camera.position.x; target.y = camera.position.y; target.z = 0 }
    cameraO.zoom = THREE.MathUtils.lerp(a.zoom, Math.min(baseZoom * 1.48, limits[1]), eased)
    cameraO.updateProjectionMatrix()
    controls.current?.update()
    if (t === 1) { a.done = true; onArrive.current() }
    else invalidate()
  })

  const episodeOffsets = new Map<string, [number, number]>()
  const highlighted = props.worlds.filter(world => props.highlightedIds?.has(world.id)).sort((a, b) => a.name.localeCompare(b.name))
  const pending = new Set(highlighted.map(world => world.id))
  for (const start of highlighted) {
    if (!pending.delete(start.id)) continue
    const cluster = [start]
    for (let i = 0; i < cluster.length; i++) for (const other of highlighted) {
      if (pending.has(other.id) && Math.hypot(other.x - cluster[i].x, other.y - cluster[i].y) < .18) {
        pending.delete(other.id); cluster.push(other)
      }
    }
    cluster.sort((a, b) => a.name.localeCompare(b.name))
    if (cluster.length > 1) cluster.forEach((world, index) => episodeOffsets.set(world.id, [0, (index - (cluster.length - 1) / 2) * 52]))
  }
  const from = props.worlds.find(w => w.id === props.selectedId)
  const preview = props.worlds.find(w => w.id === props.previewId)
  return <>
    <Background quality={props.quality} reducedMotion={props.reducedMotion} gridVisible={props.gridVisible} />
    <GalacticGeography visible={props.regionsVisible}/>
    <HyperspaceRoutes visible={props.routesVisible}/>
    {props.routesVisible && HYPERSPACE_ROUTE_LABELS.map(label=><Html key={label.id} position={label.position} minZoom={size.width < 600 ? 24 : 0} style={{pointerEvents:'none'}} zIndexRange={[4,1]}><span className="route-map-label">{label.name}</span></Html>)}
    {props.regionsVisible && GALACTIC_REGION_LABELS.map(label=><Html key={label.id} position={label.position} minZoom={size.width < 600 && !['core','outer-rim'].includes(label.id) ? 24 : 0} style={{pointerEvents:'none'}} zIndexRange={[3,1]}><span className="region-map-label" style={{borderLeft:`2px solid ${label.color}`}}>{label.name}</span></Html>)}
    {props.gridVisible && <ReferenceGridLabels/>}
    {from && preview && from.id !== preview.id && (from.x !== preview.x || from.y !== preview.y) && <PreviewConnection from={from} to={preview} />}
    {props.worlds.map(w => <WorldMarker key={w.id} sharedOffset={episodeOffsets.get(w.id) ?? (() => {const siblings = props.worlds.filter(other => other.grid === w.grid && (['tatooine','alderaan','yavin','coruscant','hoth','bespin','dagobah','mandalore'].includes(other.id) || other.id === props.selectedId || other.id === props.previewId || props.highlightedIds?.has(other.id))); return siblings.length > 1 && !siblings.every(other => ['hoth','bespin'].includes(other.id)) ? [0, (siblings.findIndex(other => other.id === w.id) - (siblings.length-1)/2)*52] as [number,number] : undefined;})()} world={w} highlighted={props.highlightedIds?.has(w.id) ?? false} selected={w.id === props.selectedId} previewed={w.id === props.previewId} disabled={props.phase === 'warping'} onSelect={props.onSelect} />)}
    <LabelDeclutter />
    <WarpEffect progressRef={warpProgress} active={props.phase === 'warping'} reducedMotion={props.reducedMotion} quality={props.quality} />
    <OrbitControls onStart={() => {fitted.current.active = false}} ref={controls} makeDefault enableRotate={false} enableDamping dampingFactor={.12} enablePan={props.phase === 'idle'} enableZoom={props.phase === 'idle'} minZoom={limits[0]} maxZoom={limits[1]} zoomSpeed={.7} panSpeed={.8} screenSpacePanning mouseButtons={{ LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN }} touches={{ ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_PAN }} />
  </>
}

export default function Galaxy(props: Props) {
  const storyCount = props.worlds.filter(world => props.highlightedIds?.has(world.id)).length
  const hasPreview = Boolean(props.previewId && props.previewId !== props.selectedId)
  return <div style={{ position: 'absolute', inset: 0, background: '#050c12', isolation: 'isolate' }} aria-label="Interactive schematic galaxy map">
    <Canvas orthographic camera={{ position: [0, 0, 22], zoom: 32, near: .1, far: 100 }} dpr={props.quality === 'cinematic' && !props.reducedMotion ? [1, 2] : [1, 1.5]} frameloop="demand" gl={{ antialias: true, alpha: false, powerPreference: 'default' }} fallback={<div style={{ padding: 32, color: '#d7e4e8' }}>The galaxy view needs WebGL. Choose a world using the destination list.</div>}>
      <Scene {...props} />
    </Canvas>
    <aside className="galaxy-symbol-key" aria-label="Map symbols" data-story-count={storyCount} data-travelling={props.phase === 'warping'}>
      <span><i className="symbol-current" aria-hidden="true">●</i> Current location</span>
      {hasPreview && <span><i className="symbol-preview" aria-hidden="true">◇</i> Preview only</span>}
      {storyCount > 0 && <><span><i className="symbol-story" aria-hidden="true">◆</i> {storyCount} story {storyCount === 1 ? 'marker' : 'markers'}</span><small>Appearances, not a route</small></>}
    </aside>
    <div aria-hidden="true" style={{ pointerEvents: 'none', position: 'absolute', inset: 0, boxShadow: 'inset 0 0 130px 35px rgba(1,6,11,.55)' }} />
  </div>
}
