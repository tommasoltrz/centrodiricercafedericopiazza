import { useMemo, useEffect } from 'react'
import * as THREE from 'three'

const WALL_T = 0.08
const WALL_COLOR = '#ffffff'
const EDGE_COLOR = '#1e293b'

export default function GroundWall({ roomWidth, roomDepth, mezzHeight, distFromSouth, leftGap, rightGap, wallColor = WALL_COLOR }) {
  const w = roomWidth - leftGap - rightGap
  const h = mezzHeight
  const z = roomDepth / 2 - distFromSouth
  const x = -roomWidth / 2 + leftGap + w / 2

  const [geo, edges] = useMemo(() => {
    const g = new THREE.BoxGeometry(w, h, WALL_T)
    return [g, new THREE.EdgesGeometry(g)]
  }, [w, h])
  useEffect(() => () => { geo.dispose(); edges.dispose() }, [geo, edges])

  return (
    <group position={[x, h / 2, z]}>
      <mesh geometry={geo}>
        <meshStandardMaterial color={wallColor} transparent opacity={0.9} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={EDGE_COLOR} />
      </lineSegments>
    </group>
  )
}
