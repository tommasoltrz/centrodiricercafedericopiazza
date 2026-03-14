import { useMemo, useEffect } from 'react'
import * as THREE from 'three'

const WALL_T = 0.08
const WALL_COLOR = '#ffffff'
const EDGE_COLOR = '#475569'
const SLAB_T = 0.2  // must match Mezzanine.jsx

function PartitionWall({ w, h, d, position, color = WALL_COLOR }) {
  const [boxGeo, edgesGeo] = useMemo(() => {
    const box = new THREE.BoxGeometry(w, h, d)
    return [box, new THREE.EdgesGeometry(box)]
  }, [w, h, d])

  useEffect(() => () => { boxGeo.dispose(); edgesGeo.dispose() }, [boxGeo, edgesGeo])

  return (
    <group position={position}>
      <mesh geometry={boxGeo}>
        <meshBasicMaterial color={color} transparent opacity={0.9} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <lineSegments geometry={edgesGeo}>
        <lineBasicMaterial color={EDGE_COLOR} />
      </lineSegments>
    </group>
  )
}

// Bathroom sits in the bottom-right (south-east) corner of the mezzanine.
// "Bottom" = south wall (+Z), "Right" = east wall (+X).
// Only the two interior partition walls are drawn (north + west sides).
export default function Bathroom({ roomWidth, roomDepth, mezzHeight, bathWidth, bathDepth, wallHeight, wallColor = WALL_COLOR }) {
  const floorY = mezzHeight + SLAB_T        // top surface of mezzanine slab
  const wallCY = floorY + wallHeight / 2    // wall center Y

  const eastX  =  roomWidth / 2
  const southZ =  roomDepth / 2

  // Interior north wall: runs along X, at z = southZ - bathDepth
  const northWallZ = southZ - bathDepth
  const northWallX = eastX - bathWidth / 2  // centered over the bathroom width

  // Interior west wall: runs along Z, at x = eastX - bathWidth
  const westWallX = eastX - bathWidth
  const westWallZ = southZ - bathDepth / 2  // centered over the bathroom depth

  return (
    <group>
      {/* North partition wall */}
      <PartitionWall
        w={bathWidth} h={wallHeight} d={WALL_T}
        position={[northWallX, wallCY, northWallZ]} color={wallColor}
      />
      <PartitionWall
        w={WALL_T} h={wallHeight} d={bathDepth}
        position={[westWallX, wallCY, westWallZ]} color={wallColor}
      />
    </group>
  )
}
