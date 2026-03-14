import { useRef, useEffect, useMemo, useCallback } from 'react'
import * as THREE from 'three'
import { TransformControls } from '@react-three/drei'
import FurnitureItem from './FurnitureItem'

const MEZZ_FLOOR_Y = 3.2

export default function FurnitureManager({
  items,
  selectedId,
  transformMode,
  onSelect,
  onUpdate,
  orbitRef,
}) {
  const transformRef = useRef()
  // A manually-created THREE.Group that R3F won't reconcile position on
  const wrapperGroup = useMemo(() => new THREE.Group(), [])
  const lastPos = useRef({ x: 0, y: 0, z: 0, ry: 0 })

  const selectedItem = items.find(i => i.id === selectedId)
  const floorY = selectedItem?.floor === 'mezzanine' ? MEZZ_FLOOR_Y : 0

  // Sync wrapper group to item state (selection change + panel edits)
  useEffect(() => {
    if (!selectedItem) return
    const y = selectedItem.position[1] + floorY
    wrapperGroup.position.set(selectedItem.position[0], y, selectedItem.position[2])
    wrapperGroup.rotation.set(0, selectedItem.rotation, 0)
    lastPos.current = {
      x: selectedItem.position[0],
      y: selectedItem.position[1],
      z: selectedItem.position[2],
      ry: selectedItem.rotation,
    }
  }, [selectedId, selectedItem?.rotation, selectedItem?.floor, wrapperGroup, floorY])

  // Write latest transform into state
  const syncToState = useCallback(() => {
    if (!selectedId) return
    const p = lastPos.current
    onUpdate(selectedId, {
      position: [p.x, p.y, p.z],
      rotation: p.ry,
    })
  }, [selectedId, onUpdate])

  // Track position in a ref on every objectChange (no state update = no re-render)
  useEffect(() => {
    const controls = transformRef.current
    if (!controls) return
    const handler = () => {
      lastPos.current = {
        x: wrapperGroup.position.x,
        y: wrapperGroup.position.y - floorY,
        z: wrapperGroup.position.z,
        ry: wrapperGroup.rotation.y,
      }
    }
    controls.addEventListener('objectChange', handler)
    return () => controls.removeEventListener('objectChange', handler)
  }, [selectedId, transformMode, floorY, wrapperGroup])

  // Disable orbit while dragging; sync to state on drag end
  useEffect(() => {
    const controls = transformRef.current
    if (!controls) return
    const handler = (e) => {
      if (orbitRef?.current) orbitRef.current.enabled = !e.value
      // Sync to state when drag ends
      if (!e.value) syncToState()
    }
    controls.addEventListener('dragging-changed', handler)
    return () => controls.removeEventListener('dragging-changed', handler)
  }, [selectedId, orbitRef, syncToState])

  // Sync to state before unmounting (deselection)
  useEffect(() => {
    return () => syncToState()
  }, [syncToState])

  return (
    <>
      {items.map(item => {
        if (item.id === selectedId) return null
        return (
          <FurnitureItem
            key={item.id}
            item={item}
            isSelected={false}
            onSelect={onSelect}
          />
        )
      })}

      {selectedItem && (
        <TransformControls
          ref={transformRef}
          mode={transformMode}
          translationSnap={0.05}
          rotationSnap={Math.PI / 12}
          object={wrapperGroup}
        />
      )}

      {/* Wrapper group is a <primitive> so R3F won't reset its position */}
      <primitive object={wrapperGroup}>
        {selectedItem && (
          <FurnitureItem
            item={selectedItem}
            isSelected={true}
            onSelect={onSelect}
          />
        )}
      </primitive>
    </>
  )
}
