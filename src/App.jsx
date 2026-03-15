import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, TransformControls, Text3D, Center } from '@react-three/drei'
import { useControls, Leva } from 'leva'
import Room from './components/Room'
import Mezzanine from './components/Mezzanine'
import Bathroom from './components/Bathroom'
import Stairs from './components/Stairs'
import GroundWall from './components/GroundWall'
import FurnitureManager from './components/FurnitureManager'
import FurnitureCatalog from './components/FurnitureCatalog'
import FurniturePanel from './components/FurniturePanel'
import { PARAMETRIC_PRESETS } from './data/furnitureCatalog'
import { parseURL, writeURL, serializeItems } from './hooks/useURLState'
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

  // ── Restore state from URL (once on mount) ───────────────────
  const initURL = useMemo(() => parseURL(), [])

  // ── Furniture state ──────────────────────────────────────────
  const [furnitureItems, setFurnitureItems] = useState(initURL.items)
  const [selectedIds, setSelectedIds] = useState([])
  const [transformMode, setTransformMode] = useState('translate')

  const deselect = useCallback(() => setSelectedIds([]), [])

  const selectedItems = furnitureItems.filter(i => selectedIds.includes(i.id))
  // For panel: show single-item controls only when exactly 1 selected
  const selectedItem = selectedItems.length === 1 ? selectedItems[0] : null

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

  const handleDeleteSelected = useCallback(() => {
    setFurnitureItems(prev => prev.filter(item => !selectedIds.includes(item.id)))
    deselect()
  }, [selectedIds, deselect])

  const handleDelete = useCallback((id) => {
    setFurnitureItems(prev => prev.filter(item => item.id !== id))
    setSelectedIds(prev => prev.filter(i => i !== id))
  }, [])

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

  // Click = select single, Shift+click = toggle in/out of multi-select
  const handleSelect = useCallback((id, shiftKey) => {
    if (shiftKey) {
      setSelectedIds(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      )
    } else {
      setSelectedIds([id])
    }
    setTransformMode('translate')
  }, [])

  // ── Keyboard shortcuts ───────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return

      if (e.key === 'Escape') {
        deselect()
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedIds.length) {
        handleDeleteSelected()
      } else if (e.key === 'r' && selectedIds.length) {
        setFurnitureItems(prev => prev.map(item =>
          selectedIds.includes(item.id)
            ? { ...item, rotation: item.rotation + Math.PI / 2 }
            : item
        ))
      } else if (e.key === 'd' && selectedIds.length) {
        selectedIds.forEach(id => handleDuplicate(id))
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selectedIds, handleDeleteSelected, handleDuplicate, deselect])

  // ── Leva controls (initial values from URL) ──────────────────
  const { showNorthWall, showSouthWall, showEastWall, showWestWall, showCeiling, showMeasurements, showGrid, showLighting, bgColor } = useControls('Display', {
    showNorthWall:    { value: initURL.showNorthWall,    label: 'North wall'        },
    showSouthWall:    { value: initURL.showSouthWall,    label: 'South wall'        },
    showEastWall:     { value: initURL.showEastWall,     label: 'East wall'         },
    showWestWall:     { value: initURL.showWestWall,     label: 'West wall'         },
    showCeiling:      { value: initURL.showCeiling,      label: 'Ceiling'           },
    showMeasurements: { value: initURL.showMeasurements, label: 'Measurements'      },
    showGrid:         { value: initURL.showGrid,         label: 'Grid'              },
    showLighting:     { value: initURL.showLighting,     label: 'Lighting'          },
    bgColor:          { value: initURL.bgColor,          label: 'Background'        },
  })

  const { ambientInt, topInt, frontInt, backInt } = useControls('Lighting', {
    ambientInt: { value: initURL.ambientInt, min: 0, max: 2, step: 0.05, label: 'Ambient'   },
    topInt:     { value: initURL.topInt,     min: 0, max: 2, step: 0.05, label: 'Top'       },
    frontInt:   { value: initURL.frontInt,   min: 0, max: 2, step: 0.05, label: 'Front'     },
    backInt:    { value: initURL.backInt,    min: 0, max: 2, step: 0.05, label: 'Back'      },
  })

  const { plOn, plInt, plDist } = useControls('Point Light', {
    plOn:   { value: initURL.plOn,   label: 'Enabled'   },
    plInt:  { value: initURL.plInt,  min: 0, max: 500, step: 5,   label: 'Intensity' },
    plDist: { value: initURL.plDist, min: 1, max: 100, step: 1,   label: 'Distance'  },
  })

  const [plObject, setPlObject] = useState(null)
  const [plPos, setPlPos] = useState([initURL.plX, initURL.plY, initURL.plZ])

  const { roomWallColor, roomWallOpacity, bathWallColor, groundWallColor, railColor, mezzColor, gridColor } = useControls('Colors', {
    roomWallColor:   { value: initURL.roomWallColor,   label: 'Room walls'         },
    roomWallOpacity: { value: initURL.roomWallOpacity, min: 0, max: 1, step: 0.01, label: 'Room walls opacity' },
    bathWallColor:   { value: initURL.bathWallColor,   label: 'Bathroom walls'     },
    groundWallColor: { value: initURL.groundWallColor, label: 'Wall below mezz.'   },
    railColor:       { value: initURL.railColor,       label: 'Rails'              },
    mezzColor:       { value: initURL.mezzColor,       label: 'Mezzanine floor'    },
    gridColor:       { value: initURL.gridColor,       label: 'Grid'               },
  })

  // ── Write URL when state changes ──────────────────────────────
  useEffect(() => {
    writeURL({
      nw: showNorthWall    ? '1' : '0',
      sw: showSouthWall    ? '1' : '0',
      ew: showEastWall     ? '1' : '0',
      ww: showWestWall     ? '1' : '0',
      cl: showCeiling      ? '1' : '0',
      ms: showMeasurements ? '1' : '0',
      gr: showGrid         ? '1' : '0',
      lt: showLighting     ? '1' : '0',
      bg: bgColor.replace('#', ''),
    })
  }, [showNorthWall, showSouthWall, showEastWall, showWestWall, showCeiling, showMeasurements, showGrid, showLighting, bgColor])

  useEffect(() => {
    writeURL({ ai: ambientInt, ti: topInt, fi: frontInt, bi: backInt })
  }, [ambientInt, topInt, frontInt, backInt])

  useEffect(() => {
    writeURL({ pl: plOn ? '1' : '0', pi: plInt, pd: plDist })
  }, [plOn, plInt, plDist])

  useEffect(() => {
    writeURL({ plx: plPos[0], ply: plPos[1], plz: plPos[2] })
  }, [plPos])

  useEffect(() => {
    writeURL({
      rwc: roomWallColor.replace('#', ''),
      rwo: roomWallOpacity,
      bwc: bathWallColor.replace('#', ''),
      gwc: groundWallColor.replace('#', ''),
      rc:  railColor.replace('#', ''),
      mc:  mezzColor.replace('#', ''),
      gc:  gridColor.replace('#', ''),
    })
  }, [roomWallColor, roomWallOpacity, bathWallColor, groundWallColor, railColor, mezzColor, gridColor])

  useEffect(() => {
    writeURL({
      items: serializeItems(furnitureItems),
    })
  }, [furnitureItems])

  const isMobile = window.innerWidth < 768

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Leva collapsed={isMobile} />
      {/* Furniture catalog sidebar */}
      <FurnitureCatalog
        onAddParametric={handleAddParametric}
        onAddModel={handleAddModel}
      />

      {/* Furniture edit panel */}
      <FurniturePanel
        item={selectedItem}
        selectedCount={selectedIds.length}
        transformMode={transformMode}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onDeleteSelected={handleDeleteSelected}
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
          selectedIds={selectedIds}
          transformMode={transformMode}
          onSelect={handleSelect}
          onUpdate={handleUpdate}
          orbitRef={orbitRef}
        />

        {plOn && (
          <>
            <group ref={setPlObject} position={plPos}>
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
                onMouseUp={() => {
                  orbitRef.current && (orbitRef.current.enabled = true)
                  const { x, y, z } = plObject.position
                  setPlPos([x, y, z])
                }}
              />
            )}
          </>
        )}

        {/* Building name — outside the north wall */}
        <group position={[0, 0, 30]} rotation={[0, Math.PI, 0]}>
          <Center position={[0, 2.9, 0]}>
            <Text3D
              font={`${import.meta.env.BASE_URL}helvetiker_bold.typeface.json`}
              size={0.55}
              height={0.18}
              curveSegments={12}
              bevelEnabled
              bevelThickness={0.03}
              bevelSize={0.02}
              bevelSegments={4}
            >
              Centro di ricerca
              <meshStandardMaterial color="#c8b89a" roughness={0.4} metalness={0.1} />
            </Text3D>
          </Center>
          <Center position={[0, 2.1, 0]}>
            <Text3D
              font={`${import.meta.env.BASE_URL}helvetiker_bold.typeface.json`}
              size={0.55}
              height={0.18}
              curveSegments={12}
              bevelEnabled
              bevelThickness={0.03}
              bevelSize={0.02}
              bevelSegments={4}
            >
              Federico Piazza
              <meshStandardMaterial color="#c8b89a" roughness={0.4} metalness={0.1} />
            </Text3D>
          </Center>
        </group>

        {showGrid && <gridHelper args={[60, 60, gridColor, gridColor]} position={[0, -0.03, 0]} />}

        <OrbitControls ref={orbitRef} makeDefault target={[0, roofLowHeight / 2, 0]} enableDamping={false} />
        <axesHelper args={[1.5]} />
      </Canvas>
    </div>
  )
}
