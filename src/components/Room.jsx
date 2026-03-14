import { useMemo, useEffect } from 'react'
import * as THREE from 'three'
import { Html } from '@react-three/drei'

const WALL_T = 0.08
const WALL_COLOR = '#ffffff'
const EDGE_COLOR = '#1e293b'

function useDispose(geos) {
  useEffect(() => () => geos.forEach(g => g?.dispose()), geos)
}

// Wall with door and window holes cut out (used for north wall)
function WallWithOpenings({ w, h, d, position,
  doorW, doorH, doorX,
  winW, winH, winSill, winX,
  color = WALL_COLOR, opacity = 0.18,
}) {
  const [geo, edgesGeo] = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-w / 2, 0)
    shape.lineTo( w / 2, 0)
    shape.lineTo( w / 2, h)
    shape.lineTo(-w / 2, h)
    shape.closePath()

    const door = new THREE.Path()
    door.moveTo(doorX - doorW / 2, 0)
    door.lineTo(doorX + doorW / 2, 0)
    door.lineTo(doorX + doorW / 2, doorH)
    door.lineTo(doorX - doorW / 2, doorH)
    door.closePath()
    shape.holes.push(door)

    const win = new THREE.Path()
    win.moveTo(winX - winW / 2, winSill)
    win.lineTo(winX + winW / 2, winSill)
    win.lineTo(winX + winW / 2, winSill + winH)
    win.lineTo(winX - winW / 2, winSill + winH)
    win.closePath()
    shape.holes.push(win)

    const g = new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: false })
    return [g, new THREE.EdgesGeometry(g)]
  }, [w, h, d, doorW, doorH, doorX, winW, winH, winSill, winX])
  useDispose([geo, edgesGeo])

  return (
    <group position={[position[0], position[1], position[2] - d / 2]}>
      <mesh geometry={geo}>
        <meshStandardMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <lineSegments geometry={edgesGeo}>
        <lineBasicMaterial color={EDGE_COLOR} />
      </lineSegments>
    </group>
  )
}

// Flat rectangular wall (for front/back)
function RectWall({ w, h, d, position, color = WALL_COLOR, opacity = 0.18, depthWrite = false }) {
  const [boxGeo, edgesGeo] = useMemo(() => {
    const box = new THREE.BoxGeometry(w, h, d)
    return [box, new THREE.EdgesGeometry(box)]
  }, [w, h, d])
  useDispose([boxGeo, edgesGeo])

  return (
    <group position={position}>
      <mesh geometry={boxGeo}>
        <meshStandardMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} depthWrite={depthWrite} />
      </mesh>
      <lineSegments geometry={edgesGeo}>
        <lineBasicMaterial color={EDGE_COLOR} />
      </lineSegments>
    </group>
  )
}

// Trapezoidal side wall (varying height along Z)
// highH at z = +depth/2 (south / front), lowH at z = -depth/2 (north / back)
function TrapWall({ depth, lowH, highH, position, color = WALL_COLOR, opacity = 0.18 }) {
  const [geo, edgesGeo] = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      0, 0,      depth / 2,   // 0 south-bottom
      0, 0,     -depth / 2,   // 1 north-bottom
      0, highH,  depth / 2,   // 2 south-top  (tall end)
      0, lowH,  -depth / 2,   // 3 north-top  (low end)
    ]), 3))
    g.setIndex([0, 1, 2, 1, 3, 2])
    g.computeVertexNormals()
    return [g, new THREE.EdgesGeometry(g)]
  }, [depth, lowH, highH])
  useDispose([geo, edgesGeo])

  return (
    <group position={position}>
      <mesh geometry={geo}>
        <meshStandardMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <lineSegments geometry={edgesGeo}>
        <lineBasicMaterial color={EDGE_COLOR} />
      </lineSegments>
    </group>
  )
}

// Y on the sloped roof at a given Z
function roofY(z, depth, lowH, highH) {
  return lowH + (highH - lowH) * (z + depth / 2) / depth
}

// One sloped rectangular quad (X range × Z range)
function RoofQuad({ x0, x1, z0, z1, depth, lowH, highH, color, opacity }) {
  const y0 = roofY(z0, depth, lowH, highH)
  const y1 = roofY(z1, depth, lowH, highH)
  const [geo, edgesGeo] = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      x0, y0, z0,  x1, y0, z0,
      x0, y1, z1,  x1, y1, z1,
    ]), 3))
    g.setIndex([0, 2, 1, 1, 2, 3])
    g.computeVertexNormals()
    return [g, new THREE.EdgesGeometry(g)]
  }, [x0, x1, z0, z1, y0, y1])
  useDispose([geo, edgesGeo])
  return (
    <group>
      <mesh geometry={geo}>
        <meshStandardMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <lineSegments geometry={edgesGeo}>
        <lineBasicMaterial color={EDGE_COLOR} />
      </lineSegments>
    </group>
  )
}

function SlopedRoof({ width, depth, lowH, highH, color = WALL_COLOR, opacity = 0.18,
  skylightW = 4.4, skylightD = 2.2, skylightGap = 3.0, skylightCZ = 0,
}) {
  const hw = width / 2, hd = depth / 2

  // Skylight X extents (centered)
  const sx0 = -skylightW / 2, sx1 = skylightW / 2
  // North skylight Z extents
  const s1z0 = skylightCZ - skylightGap / 2 - skylightD
  const s1z1 = skylightCZ - skylightGap / 2
  // South skylight Z extents
  const s2z0 = skylightCZ + skylightGap / 2
  const s2z1 = skylightCZ + skylightGap / 2 + skylightD

  const q = (x0, x1, z0, z1) => ({ x0, x1, z0, z1 })
  const pieces = [
    q(-hw, hw,  -hd,   s1z0),  // north strip (full width, north of both skylights)
    q(-hw, hw,   s2z1,  hd),   // south strip (full width, south of both skylights)
    q(-hw, sx0,  s1z0,  s2z1), // west strip (spans full skylight Z range)
    q(sx1,  hw,  s1z0,  s2z1), // east strip (spans full skylight Z range)
    q(sx0,  sx1, s1z1,  s2z0), // gap between the two skylights
  ]

  return (
    <group>
      {pieces.map((p, i) => (
        <RoofQuad key={i} {...p} depth={depth} lowH={lowH} highH={highH} color={color} opacity={opacity} />
      ))}
    </group>
  )
}

function Label({ position, text }) {
  return (
    <Html position={position} center>
      <div style={{
        background: 'rgba(30, 41, 59, 0.82)',
        color: '#f1f5f9',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'system-ui, sans-serif',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        userSelect: 'none',
        lineHeight: '1.6',
      }}>
        {text}
      </div>
    </Html>
  )
}

export default function Room({ roomWidth, roomDepth, roofLowHeight, roofHighHeight, showRoof, showEastWall = true, showWestWall = true, showNorthWall = true, showSouthWall = true, showMeasurements,
  doorW = 1.0, doorH = 2.2, doorX = -1.0,
  winW  = 1.2, winH  = 1.2, winSill = 0.9, winX = 1.5,
  wallColor = WALL_COLOR, wallOpacity = 0.18,
  skylightW, skylightD, skylightGap, skylightCZ,
}) {
  const hw = roomWidth / 2
  const hd = roomDepth / 2

  return (
    <group>
      {/* Floor */}
      <RectWall w={roomWidth} h={0.05} d={roomDepth} position={[0, -0.025, 0]} color='#888888' opacity={1} depthWrite={true} />

      {/* South wall (front, tall end — mezzanine side) */}
      {showSouthWall && <RectWall w={roomWidth} h={roofHighHeight} d={WALL_T} position={[0, roofHighHeight / 2, hd]} color={wallColor} opacity={wallOpacity} />}

      {/* North wall (back, low end) — with door and window */}
      {showNorthWall && (
        <WallWithOpenings
          w={roomWidth} h={roofLowHeight} d={WALL_T} position={[0, 0, -hd]}
          doorW={doorW} doorH={doorH} doorX={doorX}
          winW={winW}   winH={winH}   winSill={winSill} winX={winX}
          color={wallColor} opacity={wallOpacity}
        />
      )}

      {/* East wall (trapezoidal) */}
      {showEastWall && <TrapWall depth={roomDepth} lowH={roofLowHeight} highH={roofHighHeight} position={[hw, 0, 0]} color={wallColor} opacity={wallOpacity} />}

      {/* West wall (trapezoidal) */}
      {showWestWall && <TrapWall depth={roomDepth} lowH={roofLowHeight} highH={roofHighHeight} position={[-hw, 0, 0]} color={wallColor} opacity={wallOpacity} />}

      {/* Sloped roof */}
      {showRoof && (
        <SlopedRoof width={roomWidth} depth={roomDepth} lowH={roofLowHeight} highH={roofHighHeight} color={wallColor} opacity={wallOpacity * 0.7}
          skylightW={skylightW} skylightD={skylightD} skylightGap={skylightGap} skylightCZ={skylightCZ} />
      )}

      {/* Measurement labels */}
      {showMeasurements && (
        <>
          <Label position={[0, 0.3, hd + 0.5]}        text={`W: ${roomWidth.toFixed(1)} m`} />
          <Label position={[hw + 0.5, 0.3, 0]}         text={`D: ${roomDepth.toFixed(1)} m`} />
          <Label position={[hw + 0.5, roofHighHeight, hd]}  text={`↑ ${roofHighHeight.toFixed(1)} m`} />
          <Label position={[hw + 0.5, roofLowHeight,  -hd]} text={`↑ ${roofLowHeight.toFixed(1)} m`} />
        </>
      )}
    </group>
  )
}
