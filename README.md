# Room Planner

Interactive 3D room planner for visualizing furniture placement in a loft space with a mezzanine. Built with React and Three.js.

![Room Planner](src/assets/hero.png)

## Features

- **3D room visualization** — explore the space with orbit camera controls (rotate, zoom, pan)
- **Architectural details** — sloped roof, mezzanine with railings, staircase, bathroom partition, door & window cutouts
- **Real-time controls** — toggle wall visibility, adjust colors, show/hide measurements via a control panel
- **Accurate dimensions** — room is modeled at real-world scale (5.8m × 12m, roof from 5.5m to 9m)

## Room Layout

| Element | Dimensions |
|---------|-----------|
| Room | 5.8m wide × 12m deep |
| Roof | Slopes from 5.5m (north) to 9m (south) |
| Mezzanine | 5.8m wide × 5m deep, at 3m height |
| Bathroom | 3m × 1.5m partition on the mezzanine (SE corner) |
| Door | 1.0m × 2.2m (north wall) |
| Window | 2.0m × 2.0m (north wall) |

## Tech Stack

- **React 19** — UI framework
- **Three.js** + **React Three Fiber** — 3D rendering
- **Drei** — helper components (orbit controls, HTML labels)
- **Leva** — interactive control panel
- **Vite** — dev server and build tool

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in a browser with WebGL support.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── main.jsx              # Entry point
├── App.jsx               # Scene setup, lights, camera, Leva controls
├── index.css             # Global styles
└── components/
    ├── Room.jsx          # Floor, walls, sloped roof, door & window cutouts
    ├── Mezzanine.jsx     # Loft slab with stairwell hole and railings
    ├── Bathroom.jsx      # Partition walls on the mezzanine
    ├── Stairs.jsx        # Dynamically generated staircase
    └── GroundWall.jsx    # Support wall beneath the mezzanine
```
