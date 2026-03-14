import { useMemo, useEffect } from 'react'
import * as THREE from 'three'
import { Html } from '@react-three/drei'

const SLAB_T = 0.2
const SLAB_COLOR = '#7c3a0e'
const RAILING_COLOR = '#ffffff'
const POST_SIZE = 0.06
const RAILING_H = 1.0
const RAIL_D = 0.04

function SlabPiece({ w, d, position, color = SLAB_COLOR }) {
  const [geo, edges] = useMemo(() => {
    const g = new THREE.BoxGeometry(w, SLAB_T, d)
    return [g, new THREE.EdgesGeometry(g)]
  }, [w, d])
  useEffect(() => () => { geo.dispose(); edges.dispose() }, [geo, edges])
  return (
    <group position={position}>
      <mesh geometry={geo}><meshStandardMaterial color={color} /></mesh>
      <lineSegments geometry={edges}><lineBasicMaterial color="#92400e" /></lineSegments>
    </group>
  )
}

function RailEdge({ start, end, baseY, color = RAILING_COLOR }) {
  const [sx, sz] = start, [ex, ez] = end
  const dx = ex - sx, dz = ez - sz
  const len = Math.sqrt(dx * dx + dz * dz)
  const angle = -Math.atan2(dz, dx)
  const mx = (sx + ex) / 2, mz = (sz + ez) / 2
  const posts = [[sx, sz], [mx, mz], [ex, ez]]
  return (
    <group>
      {[baseY + RAILING_H - RAIL_D / 2, baseY + RAILING_H * 0.5].map((ry, i) => (
        <mesh key={i} position={[mx, ry, mz]} rotation={[0, angle, 0]}>
          <boxGeometry args={[len, RAIL_D, RAIL_D]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
      {posts.map(([px, pz], i) => (
        <mesh key={i} position={[px, baseY + RAILING_H / 2, pz]}>
          <boxGeometry args={[POST_SIZE, RAILING_H, POST_SIZE]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </group>
  )
}

export default function Mezzanine({
  roomWidth, roomDepth,
  mezzDepth, mezzHeight, mezzWall,
  showRailings, showMeasurements,
  holeWidth = 0, holeDepth = 0, holeOffset = 0,
  railColor = RAILING_COLOR, mezzColor = SLAB_COLOR,
}) {
  const effWidth = (mezzWall === 'E' || mezzWall === 'W') ? roomDepth : roomWidth
  const effDepth = Math.min(mezzDepth, roomDepth - 0.1)
  const slabY = mezzHeight + SLAB_T / 2
  const baseY = mezzHeight + SLAB_T
  const hw = roomWidth / 2, hd = roomDepth / 2

  let slabW, slabD, cx, cz
  switch (mezzWall) {
    case 'N': slabW = effWidth; slabD = effDepth; cx = 0;        cz = -hd + effDepth / 2; break
    case 'S': slabW = effWidth; slabD = effDepth; cx = 0;        cz =  hd - effDepth / 2; break
    case 'E': slabW = effDepth; slabD = effWidth; cx =  hw - effDepth / 2; cz = 0;        break
    case 'W': slabW = effDepth; slabD = effWidth; cx = -hw + effDepth / 2; cz = 0;        break
    default:  slabW = effWidth; slabD = effDepth; cx = 0;        cz = -hd + effDepth / 2
  }

  const hasHole = holeWidth > 0 && holeDepth > 0 && mezzWall === 'S'

  // Slab pieces around the stairwell hole.
  // Hole sits at X offset `holeOffset` from the left edge, has width `holeWidth` and depth `holeDepth`.
  // This produces 3 pieces:
  //   Left  – landing strip, full depth, left of hole
  //   Mid   – area above/north of the hole (same X as hole, but north portion)
  //   Right – full-depth strip to the right of the hole (bathroom side)
  const slabPieces = useMemo(() => {
    if (!hasHole) return [{ w: slabW, d: slabD, pos: [cx, slabY, cz] }]

    const leftEdge  = cx - slabW / 2                 // world X of slab left edge
    const holeLeft  = leftEdge + holeOffset           // world X: left edge of hole
    const holeRight = holeLeft + holeWidth            // world X: right edge of hole

    const leftW  = holeOffset                         // landing strip width
    const midW   = holeWidth                          // over-hole strip width
    const rightW = slabW - holeOffset - holeWidth     // bathroom-side strip width

    return [
      // Left landing — full depth
      leftW > 0 && {
        w: leftW, d: slabD,
        pos: [leftEdge + leftW / 2, slabY, cz],
      },
      // Mid — north of hole only (depth minus hole)
      { w: midW, d: slabD - holeDepth, pos: [holeLeft + midW / 2, slabY, cz - holeDepth / 2] },
      // Right — full depth (bathroom side)
      rightW > 0 && {
        w: rightW, d: slabD,
        pos: [holeRight + rightW / 2, slabY, cz],
      },
    ].filter(Boolean)
  }, [hasHole, slabW, slabD, cx, cz, slabY, holeWidth, holeDepth, holeOffset])

  const openEdges = useMemo(() => {
    const x0 = cx - slabW / 2, x1 = cx + slabW / 2
    const z0 = cz - slabD / 2, z1 = cz + slabD / 2
    switch (mezzWall) {
      case 'N': return [{ start: [x0, z1], end: [x1, z1] }]
      case 'S': {
        const holeLeft  = x0 + holeOffset
        const holeRight = holeLeft + holeWidth
        return [
          // Front edge railing — full width, shifted inward so posts sit fully on the slab
          { start: [x0, z0 + POST_SIZE / 2], end: [x1, z0 + POST_SIZE / 2] },
          // North edge of stairwell hole — shifted inward so posts sit fully on the slab
          { start: [holeLeft, z1 - holeDepth - POST_SIZE / 2], end: [holeRight, z1 - holeDepth - POST_SIZE / 2] },
        ]
      }
      case 'E': return [{ start: [x0, z0], end: [x0, z1] }]
      case 'W': return [{ start: [x1, z0], end: [x1, z1] }]
      default:  return []
    }
  }, [mezzWall, slabW, slabD, cx, cz, holeOffset, holeWidth])

  return (
    <group>
      {slabPieces.map((p, i) => (
        <SlabPiece key={i} w={p.w} d={p.d} position={p.pos} color={mezzColor} />
      ))}

      {showRailings && openEdges.map((edge, i) => (
        <RailEdge key={i} start={edge.start} end={edge.end} baseY={baseY} color={railColor} />
      ))}

      {showMeasurements && (
        <Html position={[cx, baseY + 0.15, cz]} center>
          <div style={{
            background: 'rgba(180, 83, 9, 0.85)', color: '#fef3c7',
            padding: '2px 8px', borderRadius: '4px', fontSize: '11px',
            fontFamily: 'system-ui, sans-serif', whiteSpace: 'nowrap',
            pointerEvents: 'none', userSelect: 'none', lineHeight: '1.6',
          }}>
            {effDepth.toFixed(1)} m deep · ↑{mezzHeight.toFixed(1)} m
          </div>
        </Html>
      )}
    </group>
  )
}
