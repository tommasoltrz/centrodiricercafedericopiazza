import { useRef, useEffect, useMemo, useCallback } from 'react'
import * as THREE from 'three'
import { TransformControls } from '@react-three/drei'
import FurnitureItem from './FurnitureItem'

const MEZZ_FLOOR_Y = 3.2

export default function FurnitureManager({
  items,
  selectedIds,
  transformMode,
  onSelect,
  onUpdate,
  orbitRef,
}) {
  const transformRef = useRef()
  const pivotGroup = useMemo(() => new THREE.Group(), [])

  // Snapshot of each selected item's position/rotation at drag start
  const startState = useRef({})
  // Pivot origin at drag start
  const pivotOrigin = useRef({ x: 0, y: 0, z: 0, ry: 0 })

  const selectedItems = items.filter(i => selectedIds.includes(i.id))
  const hasSelection = selectedIds.length > 0

  // Compute centroid of selected items (for pivot placement)
  const centroid = useMemo(() => {
    if (!selectedItems.length) return { x: 0, y: 0, z: 0 }
    const sum = selectedItems.reduce((acc, item) => {
      const fy = item.floor === 'mezzanine' ? MEZZ_FLOOR_Y : 0
      return {
        x: acc.x + item.position[0],
        y: acc.y + item.position[1] + fy,
        z: acc.z + item.position[2],
      }
    }, { x: 0, y: 0, z: 0 })
    const n = selectedItems.length
    return { x: sum.x / n, y: sum.y / n, z: sum.z / n }
  }, [selectedItems])

  // Position pivot at centroid and snapshot start positions
  useEffect(() => {
    if (!hasSelection) return
    pivotGroup.position.set(centroid.x, centroid.y, centroid.z)
    pivotGroup.rotation.set(0, 0, 0)
    pivotOrigin.current = { x: centroid.x, y: centroid.y, z: centroid.z, ry: 0 }

    const snap = {}
    for (const item of selectedItems) {
      const fy = item.floor === 'mezzanine' ? MEZZ_FLOOR_Y : 0
      snap[item.id] = {
        x: item.position[0],
        y: item.position[1] + fy,
        z: item.position[2],
        ry: item.rotation,
      }
    }
    startState.current = snap
  }, [selectedIds.join(','), items]) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync all selected items to state
  const syncAllToState = useCallback(() => {
    if (!hasSelection) return
    const px = pivotGroup.position.x
    const py = pivotGroup.position.y
    const pz = pivotGroup.position.z
    const pry = pivotGroup.rotation.y

    const ox = pivotOrigin.current.x
    const oy = pivotOrigin.current.y
    const oz = pivotOrigin.current.z

    const dx = px - ox
    const dy = py - oy
    const dz = pz - oz

    for (const id of selectedIds) {
      const snap = startState.current[id]
      if (!snap) continue
      const item = items.find(i => i.id === id)
      if (!item) continue
      const fy = item.floor === 'mezzanine' ? MEZZ_FLOOR_Y : 0

      if (transformMode === 'rotate' && selectedIds.length > 1) {
        // Rotate each item's position around the pivot
        const relX = snap.x - ox
        const relZ = snap.z - oz
        const cos = Math.cos(pry)
        const sin = Math.sin(pry)
        const newX = ox + relX * cos - relZ * sin
        const newZ = oz + relX * sin + relZ * cos
        onUpdate(id, {
          position: [newX, snap.y - fy, newZ],
          rotation: snap.ry + pry,
        })
      } else if (transformMode === 'rotate') {
        onUpdate(id, { rotation: snap.ry + pry })
      } else {
        onUpdate(id, {
          position: [snap.x + dx, snap.y + dy - fy, snap.z + dz],
        })
      }
    }
  }, [selectedIds, items, transformMode, onUpdate, hasSelection, pivotGroup])

  // Disable orbit while dragging; sync on drag end
  useEffect(() => {
    const controls = transformRef.current
    if (!controls) return
    const handler = (e) => {
      if (orbitRef?.current) orbitRef.current.enabled = !e.value
      if (!e.value) syncAllToState()
    }
    controls.addEventListener('dragging-changed', handler)
    return () => controls.removeEventListener('dragging-changed', handler)
  }, [selectedIds.join(','), orbitRef, syncAllToState]) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync before deselection
  useEffect(() => {
    return () => syncAllToState()
  }, [syncAllToState])

  return (
    <>
      {/* Non-selected items */}
      {items.map(item => {
        if (selectedIds.includes(item.id)) return null
        return (
          <FurnitureItem
            key={item.id}
            item={item}
            isSelected={false}
            onSelect={onSelect}
          />
        )
      })}

      {/* TransformControls on pivot */}
      {hasSelection && (
        <TransformControls
          ref={transformRef}
          mode={transformMode}
          translationSnap={0.05}
          rotationSnap={Math.PI / 12}
          object={pivotGroup}
        />
      )}

      {/* Pivot group with selected items rendered at world positions */}
      <primitive object={pivotGroup}>
        {selectedItems.map(item => {
          const fy = item.floor === 'mezzanine' ? MEZZ_FLOOR_Y : 0
          return (
            <group
              key={item.id}
              position={[
                item.position[0] - centroid.x,
                item.position[1] + fy - centroid.y,
                item.position[2] - centroid.z,
              ]}
              rotation={[0, item.rotation, 0]}
            >
              <FurnitureItem
                item={item}
                isSelected={true}
                onSelect={onSelect}
              />
            </group>
          )
        })}
      </primitive>
    </>
  )
}
