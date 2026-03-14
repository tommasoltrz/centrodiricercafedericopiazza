import { useState, useRef, useCallback, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, TransformControls } from '@react-three/drei'
import { useControls } from 'leva'
import Room from './components/Room'
import Mezzanine from './components/Mezzanine'
import Bathroom from './components/Bathroom'
import Stairs from './components/Stairs'
import GroundWall from './components/GroundWall'
import FurnitureManager from './components/FurnitureManager'
import FurnitureCatalog from './components/FurnitureCatalog'
import FurniturePanel from './components/FurniturePanel'
import { PARAMETRIC_PRESETS } from './data/furnitureCatalog'
import './index.css'

// ── Fixed dimensions ─────────────────────────────────────────────
const roomWidth      = 5.8
const roomDepth      = 12
const roofLowHeight  = 5.5
const roofHighHeight = 9

const mezzDepth  = 5
const mezzHeight = 3
const mezzWall   = 'S'

const bathWidth      = 3
const bathDepth      = 1.5
const bathWallHeight = 2.4

const stairsWidth     = 1.2
const leftClearance   = 2
const rightClearance  = 1

const gwDistFromSouth = 2
const gwLeftGap       = 1
const gwRightGap      = 1

const doorW   = 1.0;  const doorH   = 2.2;  const doorX   =  1.5
const winW    = 2.0;  const winH    = 2.0;  const winSill = 0.9;  const winX = -1.0
// ─────────────────────────────────────────────────────────────────

export default function App() {
  const orbitRef = useRef()
  const flushRef = useRef(null)

  // ── Furniture state ──────────────────────────────────────────
  const [furnitureItems, setFurnitureItems] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [transformMode, setTransformMode] = useState('translate')

  // Flush transform position to state, then deselect
  const deselect = useCallback(() => {
    if (flushRef.current) flushRef.current()
    setSelectedId(null)
  }, [])

  const selectedItem = furnitureItems.find(i => i.id === selectedId) || null

  const handleAddParametric = useCallback((presetKey) => {
    const preset = PARAMETRIC_PRESETS[presetKey]
    if (!preset) return
    setFurnitureItems(prev => [...prev, {
      id: crypto.randomUUID(),
      type: 'parametric',
      preset: presetKey,
      label: preset.label,
      position: [0, 0, 0],
      rotation: 0,
      width: preset.defaultWidth,
      height: preset.defaultHeight,
      depth: preset.defaultDepth,
      color: preset.defaultColor,
      floor: 'ground',
    }])
  }, [])

  const handleAddModel = useCallback((entry) => {
    setFurnitureItems(prev => [...prev, {
      id: crypto.randomUUID(),
      type: 'model',
      modelPath: entry.path,
      label: entry.label,
      position: [0, 0, 0],
      rotation: 0,
      scale: 1.0,
      floor: 'ground',
    }])
  }, [])

  const handleUpdate = useCallback((id, updates) => {
    setFurnitureItems(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ))
  }, [])

  const handleDelete = useCallback((id) => {
    setFurnitureItems(prev => prev.filter(item => item.id !== id))
    if (selectedId === id) deselect()
  }, [selectedId, deselect])

  const handleDuplicate = useCallback((id) => {
    setFurnitureItems(prev => {
      const source = prev.find(i => i.id === id)
      if (!source) return prev
      return [...prev, {
        ...source,
        id: crypto.randomUUID(),
        position: [source.position[0] + 0.5, source.position[1], source.position[2] + 0.5],
      }]
    })
  }, [])

  const handleSelect = useCallback((id) => {
    setSelectedId(id)
    setTransformMode('translate')
  }, [])

  // ── Keyboard shortcuts ───────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      // Don't fire when typing in inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return

      if (e.key === 'Escape') {
        deselect()
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        handleDelete(selectedId)
      } else if (e.key === 'r' && selectedId) {
        setFurnitureItems(prev => prev.map(item =>
          item.id === selectedId
            ? { ...item, rotation: item.rotation + Math.PI / 2 }
            : item
        ))
      } else if (e.key === 'd' && selectedId) {
        handleDuplicate(selectedId)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selectedId, handleDelete, handleDuplicate, deselect])

  // ── Leva controls ────────────────────────────────────────────
  const { showNorthWall, showSouthWall, showEastWall, showWestWall, showCeiling, showMeasurements, showGrid, showLighting, bgColor } = useControls('Display', {
    showNorthWall:    { value: true,      label: 'North wall'        },
    showSouthWall:    { value: true,      label: 'South wall'        },
    showEastWall:     { value: false,     label: 'East wall'         },
    showWestWall:     { value: true,      label: 'West wall'         },
    showCeiling:      { value: true,      label: 'Ceiling'           },
    showMeasurements: { value: true,      label: 'Measurements'      },
    showGrid:         { value: true,      label: 'Grid'              },
    showLighting:     { value: true,      label: 'Lighting'          },
    bgColor:          { value: '#908c8c', label: 'Background'        },
  })

  const { ambientInt, topInt, frontInt, backInt } = useControls('Lighting', {
    ambientInt: { value: 0.8, min: 0, max: 2, step: 0.05, label: 'Ambient'   },
    topInt:     { value: 0.0, min: 0, max: 2, step: 0.05, label: 'Top'       },
    frontInt:   { value: 0.0, min: 0, max: 2, step: 0.05, label: 'Front'     },
    backInt:    { value: 0.0, min: 0, max: 2, step: 0.05, label: 'Back'      },
  })

  const { plOn, plInt, plDist } = useControls('Point Light', {
    plOn:   { value: true,  label: 'Enabled'   },
    plInt:  { value: 500, min: 0, max: 500, step: 5,   label: 'Intensity' },
    plDist: { value: 17,  min: 1, max: 100, step: 1,   label: 'Distance'  },
  })

  const [plObject, setPlObject] = useState(null)

  const { roomWallColor, roomWallOpacity, bathWallColor, groundWallColor, railColor, mezzColor } = useControls('Colors', {
    roomWallColor:   { value: '#ffffff', label: 'Room walls'         },
    roomWallOpacity: { value: 1.0,  min: 0, max: 1, step: 0.01, label: 'Room walls opacity' },
    bathWallColor:   { value: '#ffffff', label: 'Bathroom walls'     },
    groundWallColor: { value: '#ffffff', label: 'Wall below mezz.'   },
    railColor:       { value: '#ffffff', label: 'Rails'              },
    mezzColor:       { value: '#7c3a0e', label: 'Mezzanine floor'    },
  })

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {/* Furniture catalog sidebar */}
      <FurnitureCatalog
        onAddParametric={handleAddParametric}
        onAddModel={handleAddModel}
      />

      {/* Furniture edit panel */}
      <FurniturePanel
        item={selectedItem}
        transformMode={transformMode}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onSetTransformMode={setTransformMode}
      />

      <Canvas
        camera={{ position: [12, 9, 14], fov: 45 }}
        onPointerMissed={deselect}
      >
        <color attach="background" args={[bgColor]} />

        {showLighting ? (
          <>
            <ambientLight intensity={ambientInt} />
            <directionalLight position={[10, 15, 10]} intensity={frontInt} />
            <directionalLight position={[-6, 8, -6]} intensity={backInt} />
            <directionalLight position={[0, 20, 0]} intensity={topInt} />
          </>
        ) : (
          <ambientLight intensity={1} />
        )}

        <Room
          roomWidth={roomWidth}
          roomDepth={roomDepth}
          roofLowHeight={roofLowHeight}
          roofHighHeight={roofHighHeight}
          doorW={doorW} doorH={doorH} doorX={doorX}
          winW={winW}   winH={winH}   winSill={winSill} winX={winX}
          wallColor={roomWallColor}
          wallOpacity={roomWallOpacity}
          skylightW={2.7} skylightD={3.7} skylightGap={2.1} skylightCZ={0.1}
          showRoof={showCeiling}
          showEastWall={showEastWall}
          showWestWall={showWestWall}
          showNorthWall={showNorthWall}
          showSouthWall={showSouthWall}
          showMeasurements={showMeasurements}
        />

        <Mezzanine
          roomWidth={roomWidth}
          roomDepth={roomDepth}
          mezzDepth={mezzDepth}
          mezzHeight={mezzHeight}
          mezzWall={mezzWall}
          showRailings={true}
          showMeasurements={showMeasurements}
          railColor={railColor}
          mezzColor={mezzColor}
          holeOffset={leftClearance - 1}
          holeWidth={roomWidth - bathWidth - (leftClearance - 1)}
          holeDepth={stairsWidth}
        />

        <GroundWall
          roomWidth={roomWidth}
          roomDepth={roomDepth}
          mezzHeight={mezzHeight}
          distFromSouth={gwDistFromSouth}
          leftGap={gwLeftGap}
          rightGap={gwRightGap}
          wallColor={groundWallColor}
        />

        <Stairs
          roomWidth={roomWidth}
          roomDepth={roomDepth}
          mezzHeight={mezzHeight}
          stairsWidth={stairsWidth}
          leftClearance={leftClearance}
          rightClearance={rightClearance}
        />

        <Bathroom
          roomWidth={roomWidth}
          roomDepth={roomDepth}
          mezzHeight={mezzHeight}
          bathWidth={bathWidth}
          bathDepth={bathDepth}
          wallHeight={bathWallHeight}
          wallColor={bathWallColor}
        />

        {/* Furniture system */}
        <FurnitureManager
          items={furnitureItems}
          selectedId={selectedId}
          transformMode={transformMode}
          onSelect={handleSelect}
          onUpdate={handleUpdate}
          orbitRef={orbitRef}
          flushRef={flushRef}
        />

        {plOn && (
          <>
            <group ref={setPlObject} position={[0, 15, -5]}>
              <pointLight intensity={plInt} distance={plDist} color="#fffbe6" />
              <mesh>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshBasicMaterial color="#ffe066" />
              </mesh>
            </group>
            {plObject && (
              <TransformControls
                object={plObject}
                mode="translate"
                onMouseDown={() => orbitRef.current && (orbitRef.current.enabled = false)}
                onMouseUp={() => orbitRef.current && (orbitRef.current.enabled = true)}
              />
            )}
          </>
        )}

        {showGrid && <gridHelper args={[60, 60, '#cbd5e1', '#e2e8f0']} position={[0, -0.03, 0]} />}

        <OrbitControls ref={orbitRef} makeDefault target={[0, roofLowHeight / 2, 0]} />
        <axesHelper args={[1.5]} />
      </Canvas>
    </div>
  )
}
