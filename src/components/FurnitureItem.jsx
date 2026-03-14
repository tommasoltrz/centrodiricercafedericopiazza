import { useRef, useMemo, Suspense } from 'react'
import { useGLTF } from '@react-three/drei'
import { PARAMETRIC_PRESETS } from '../data/furnitureCatalog'

const MEZZ_FLOOR_Y = 3.2

// ── GLTF model sub-component ──────────────────────────────────
function ModelMesh({ path }) {
  const { scene } = useGLTF(path)
  const cloned = useMemo(() => scene.clone(true), [scene])
  return <primitive object={cloned} />
}

// ── Single furniture item ─────────────────────────────────────
// When `isSelected`, position/rotation is managed by TransformControls
// in FurnitureManager, so we render at the origin to avoid doubling.
export default function FurnitureItem({ item, isSelected, onSelect }) {
  const groupRef = useRef()
  const floorY = item.floor === 'mezzanine' ? MEZZ_FLOOR_Y : 0

  return (
    <group
      ref={groupRef}
      position={isSelected ? [0, 0, 0] : [item.position[0], item.position[1] + floorY, item.position[2]]}
      rotation={isSelected ? [0, 0, 0] : [0, item.rotation, 0]}
      onClick={e => { e.stopPropagation(); onSelect(item.id) }}
      onPointerOver={() => { document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { document.body.style.cursor = 'default' }}
    >
      {item.type === 'model' ? (
        <Suspense fallback={
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[0.5, 1, 0.5]} />
            <meshStandardMaterial color="#666" wireframe />
          </mesh>
        }>
          <group scale={item.scale}>
            <ModelMesh path={item.modelPath} />
          </group>
        </Suspense>
      ) : (
        <ParametricMesh item={item} />
      )}

      {/* Selection wireframe highlight */}
      {isSelected && (
        <SelectionBox item={item} />
      )}
    </group>
  )
}

// ── Parametric geometry from parts ────────────────────────────
function ParametricMesh({ item }) {
  const preset = PARAMETRIC_PRESETS[item.preset]
  if (!preset) return null
  const parts = preset.parts(item.width, item.height, item.depth)

  return (
    <>
      {parts.map((part, i) => (
        part.shape === 'cylinder' ? (
          <mesh key={i} position={part.offset}>
            <cylinderGeometry args={[part.radius, part.radius, part.height, 24]} />
            <meshStandardMaterial color={part.color || item.color} />
          </mesh>
        ) : (
          <mesh key={i} position={part.offset}>
            <boxGeometry args={part.size} />
            <meshStandardMaterial color={part.color || item.color} />
          </mesh>
        )
      ))}
    </>
  )
}

// ── Selection bounding box ────────────────────────────────────
function SelectionBox({ item }) {
  const w = item.type === 'model' ? item.scale : item.width
  const h = item.type === 'model' ? item.scale : item.height
  const d = item.type === 'model' ? item.scale : item.depth

  return (
    <mesh position={[0, h / 2, 0]}>
      <boxGeometry args={[w + 0.06, h + 0.06, d + 0.06]} />
      <meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.5} />
    </mesh>
  )
}
