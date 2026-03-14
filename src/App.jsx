import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useControls } from 'leva'
import Room from './components/Room'
import Mezzanine from './components/Mezzanine'
import Bathroom from './components/Bathroom'
import Stairs from './components/Stairs'
import GroundWall from './components/GroundWall'
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

  const { showWalls, showCeiling, showMeasurements, showGrid, bgColor } = useControls('Display', {
    showWalls:        { value: true,      label: 'Show walls'        },
    showCeiling:      { value: true,      label: 'Show ceiling'      },
    showMeasurements: { value: true,      label: 'Show measurements' },
    showGrid:         { value: true,      label: 'Show grid'         },
    bgColor:          { value: '#1a1a1a', label: 'Background'        },
  })

const { roomWallColor, roomWallOpacity, bathWallColor, groundWallColor, railColor, mezzColor } = useControls('Colors', {
    roomWallColor:   { value: '#ffffff', label: 'Room walls'         },
    roomWallOpacity: { value: 0.18, min: 0, max: 1, step: 0.01, label: 'Room walls opacity' },
    bathWallColor:   { value: '#ffffff', label: 'Bathroom walls'     },
    groundWallColor: { value: '#ffffff', label: 'Wall below mezz.'   },
    railColor:       { value: '#ffffff', label: 'Rails'              },
    mezzColor:       { value: '#7c3a0e', label: 'Mezzanine floor'    },
  })

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [12, 9, 14], fov: 45 }}>
        <color attach="background" args={[bgColor]} />

        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 15, 10]} intensity={0.7} />
        <directionalLight position={[-6, 8, -6]} intensity={0.3} />

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
          showLateralWalls={showWalls}
          showNorthWall={showWalls}
          showSouthWall={showWalls}
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

        {showGrid && <gridHelper args={[60, 60, '#cbd5e1', '#e2e8f0']} position={[0, 0.001, 0]} />}

        <OrbitControls makeDefault target={[0, roofLowHeight / 2, 0]} />
        <axesHelper args={[1.5]} />
      </Canvas>
    </div>
  )
}
