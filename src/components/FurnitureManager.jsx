import { useRef, useEffect, useCallback } from 'react'
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
  flushRef,
}) {
  const transformRef = useRef()
  const selectedGroupRef = useRef()

  const selectedItem = items.find(i => i.id === selectedId)
  const floorY = selectedItem?.floor === 'mezzanine' ? MEZZ_FLOOR_Y : 0

  // Flush: read current position/rotation from the 3D object and sync to state
  const flush = useCallback(() => {
    const obj = selectedGroupRef.current
    if (!obj || !selectedId) return
    onUpdate(selectedId, {
      position: [obj.position.x, 0, obj.position.z],
      rotation: obj.rotation.y,
    })
  }, [selectedId, onUpdate])

  // Expose flush to parent via ref
  useEffect(() => {
    if (flushRef) flushRef.current = flush
  }, [flush, flushRef])

  // Disable orbit controls while dragging, and sync on drag end
  useEffect(() => {
    const controls = transformRef.current
    if (!controls) return
    const handler = (e) => {
      if (orbitRef?.current) orbitRef.current.enabled = !e.value
      if (!e.value) flush()
    }
    controls.addEventListener('dragging-changed', handler)
    return () => controls.removeEventListener('dragging-changed', handler)
  }, [selectedId, orbitRef, flush])

  // Clamp Y to floor level during translate drag
  useEffect(() => {
    const controls = transformRef.current
    if (!controls || transformMode !== 'translate') return
    const handler = () => {
      if (selectedGroupRef.current) {
        selectedGroupRef.current.position.y = floorY
      }
    }
    controls.addEventListener('objectChange', handler)
    return () => controls.removeEventListener('objectChange', handler)
  }, [selectedId, transformMode, floorY])

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
          showY={false}
        >
          <group
            ref={selectedGroupRef}
            position={[selectedItem.position[0], floorY, selectedItem.position[2]]}
            rotation={[0, selectedItem.rotation, 0]}
          >
            <FurnitureItem
              item={selectedItem}
              isSelected={true}
              onSelect={onSelect}
            />
          </group>
        </TransformControls>
      )}
    </>
  )
}
