import { useMemo } from 'react'

const RISER_HEIGHT = 0.18
const STAIR_COLOR = '#7c3a0e'

// Stairs run parallel to the south wall (along X), climbing westward.
// Positioned at the mezzanine's north edge so they're not under the slab.
export default function Stairs({ roomWidth, roomDepth, mezzHeight, stairsWidth, leftClearance, rightClearance }) {
  const SLAB_T = 0.2
  const topY = mezzHeight + SLAB_T
  const steps = Math.ceil(topY / RISER_HEIGHT)

  // Horizontal run: full room width minus the two clearances, shifted 1m east
  const startX    =  roomWidth / 2 - rightClearance - 1   // east end (bottom step)
  const endX      = -roomWidth / 2 + leftClearance  - 1   // west end (top step)
  const totalRun  = startX - endX
  const treadDepth = totalRun / steps

  // Z: against the south wall
  const cz = roomDepth / 2 - stairsWidth / 2

  const stepBoxes = useMemo(() => Array.from({ length: steps }, (_, i) => ({
    key: i,
    position: [
      startX - (i + 0.5) * treadDepth,   // climbing west
      (i + 1) * RISER_HEIGHT - RISER_HEIGHT / 2,
      cz,
    ],
    w: treadDepth,
    h: RISER_HEIGHT,
    d: stairsWidth,
  })), [steps, startX, treadDepth, cz, stairsWidth])

  return (
    <group>
      {stepBoxes.map(({ key, position, w, h, d }) => (
        <mesh key={key} position={position}>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color={STAIR_COLOR} />
        </mesh>
      ))}
    </group>
  )
}
