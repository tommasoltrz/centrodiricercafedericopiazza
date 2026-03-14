import { useRef, useEffect } from 'react'
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
  const selectedGroupRef = useRef()
  const isDragging = useRef(false)

  const selectedItem = items.find(i => i.id === selectedId)
  const floorY = selectedItem?.floor === 'mezzanine' ? MEZZ_FLOOR_Y : 0

  // Disable orbit controls while dragging, and sync state on drag end
  useEffect(() => {
    const controls = transformRef.current
    if (!controls) return

    const handler = (e) => {
      if (orbitRef?.current) orbitRef.current.enabled = !e.value
      isDragging.current = e.value

      // Sync position/rotation to React state when drag ends
      if (!e.value && selectedItem && selectedGroupRef.current) {
        const obj = selectedGroupRef.current
        if (transformMode === 'translate') {
          onUpdate(selectedItem.id, {
            position: [obj.position.x, 0, obj.position.z],
          })
        } else if (transformMode === 'rotate') {
          onUpdate(selectedItem.id, {
            rotation: obj.rotation.y,
          })
        }
      }
    }
    controls.addEventListener('dragging-changed', handler)
    return () => controls.removeEventListener('dragging-changed', handler)
  }, [selectedId, selectedItem, transformMode, onUpdate, orbitRef])

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

      {/* Selected item with TransformControls */}
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
