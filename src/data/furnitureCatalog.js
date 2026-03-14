// ── Parametric furniture presets ────────────────────────────────
// Each preset defines a label, category, default dimensions, color,
// and a `parts(w, h, d)` function that returns sub-geometries.
// Parts use local coordinates (origin = bottom-center of the item).

export const PARAMETRIC_PRESETS = {
  couch: {
    label: 'Couch',
    category: 'Seating',
    defaultWidth: 2.0, defaultHeight: 0.85, defaultDepth: 0.9,
    defaultColor: '#6b7280',
    parts: (w, h, d) => [
      { shape: 'box', offset: [0, h * 0.25, 0],         size: [w, h * 0.3, d] },            // seat
      { shape: 'box', offset: [0, h * 0.55, d * 0.4],   size: [w, h * 0.55, d * 0.2] },     // backrest
      { shape: 'box', offset: [-w/2 + 0.08, h * 0.35, 0], size: [0.15, h * 0.45, d] },      // left arm
      { shape: 'box', offset: [ w/2 - 0.08, h * 0.35, 0], size: [0.15, h * 0.45, d] },      // right arm
    ],
  },

  chair: {
    label: 'Chair',
    category: 'Seating',
    defaultWidth: 0.5, defaultHeight: 0.9, defaultDepth: 0.5,
    defaultColor: '#78716c',
    parts: (w, h, d) => {
      const legH = h * 0.5
      const legR = 0.025
      const seatT = 0.05
      return [
        // 4 legs
        { shape: 'box', offset: [-w/2 + legR*2, legH/2, -d/2 + legR*2], size: [legR*4, legH, legR*4] },
        { shape: 'box', offset: [ w/2 - legR*2, legH/2, -d/2 + legR*2], size: [legR*4, legH, legR*4] },
        { shape: 'box', offset: [-w/2 + legR*2, legH/2,  d/2 - legR*2], size: [legR*4, legH, legR*4] },
        { shape: 'box', offset: [ w/2 - legR*2, legH/2,  d/2 - legR*2], size: [legR*4, legH, legR*4] },
        // seat
        { shape: 'box', offset: [0, legH + seatT/2, 0], size: [w, seatT, d] },
        // backrest
        { shape: 'box', offset: [0, legH + (h - legH)/2, d/2 - 0.025], size: [w, h - legH, 0.05] },
      ]
    },
  },

  bed: {
    label: 'Bed',
    category: 'Seating',
    defaultWidth: 1.6, defaultHeight: 0.55, defaultDepth: 2.0,
    defaultColor: '#a3a3a3',
    parts: (w, h, d) => [
      { shape: 'box', offset: [0, h * 0.35, 0],        size: [w, h * 0.35, d] },            // base
      { shape: 'box', offset: [0, h * 0.55, 0],         size: [w - 0.05, h * 0.15, d - 0.05], color: '#e5e7eb' }, // mattress
      { shape: 'box', offset: [0, h * 0.75, d/2 - 0.04], size: [w, h * 0.5, 0.08] },        // headboard
    ],
  },

  desk: {
    label: 'Desk',
    category: 'Tables & Desks',
    defaultWidth: 1.4, defaultHeight: 0.75, defaultDepth: 0.7,
    defaultColor: '#92400e',
    parts: (w, h, d) => {
      const legT = 0.06
      const topT = 0.04
      return [
        { shape: 'box', offset: [-w/2 + legT/2, h/2 - topT/2, -d/2 + legT/2], size: [legT, h - topT, legT] },
        { shape: 'box', offset: [ w/2 - legT/2, h/2 - topT/2, -d/2 + legT/2], size: [legT, h - topT, legT] },
        { shape: 'box', offset: [-w/2 + legT/2, h/2 - topT/2,  d/2 - legT/2], size: [legT, h - topT, legT] },
        { shape: 'box', offset: [ w/2 - legT/2, h/2 - topT/2,  d/2 - legT/2], size: [legT, h - topT, legT] },
        { shape: 'box', offset: [0, h - topT/2, 0], size: [w, topT, d] },  // top
      ]
    },
  },

  table: {
    label: 'Table',
    category: 'Tables & Desks',
    defaultWidth: 1.2, defaultHeight: 0.75, defaultDepth: 0.8,
    defaultColor: '#78350f',
    parts: (w, h, d) => {
      const legT = 0.07
      const topT = 0.05
      return [
        { shape: 'box', offset: [-w/2 + legT/2, (h - topT)/2, -d/2 + legT/2], size: [legT, h - topT, legT] },
        { shape: 'box', offset: [ w/2 - legT/2, (h - topT)/2, -d/2 + legT/2], size: [legT, h - topT, legT] },
        { shape: 'box', offset: [-w/2 + legT/2, (h - topT)/2,  d/2 - legT/2], size: [legT, h - topT, legT] },
        { shape: 'box', offset: [ w/2 - legT/2, (h - topT)/2,  d/2 - legT/2], size: [legT, h - topT, legT] },
        { shape: 'box', offset: [0, h - topT/2, 0], size: [w, topT, d] },
      ]
    },
  },

  wardrobe: {
    label: 'Wardrobe',
    category: 'Storage',
    defaultWidth: 1.2, defaultHeight: 2.0, defaultDepth: 0.6,
    defaultColor: '#a16207',
    parts: (w, h, d) => [
      { shape: 'box', offset: [0, h/2, 0], size: [w, h, d] },                               // body
      { shape: 'box', offset: [-w * 0.25, h/2, -d/2 - 0.005], size: [w/2 - 0.02, h - 0.04, 0.01], color: '#ca8a04' }, // left door
      { shape: 'box', offset: [ w * 0.25, h/2, -d/2 - 0.005], size: [w/2 - 0.02, h - 0.04, 0.01], color: '#ca8a04' }, // right door
    ],
  },

  bookshelf: {
    label: 'Bookshelf',
    category: 'Storage',
    defaultWidth: 0.8, defaultHeight: 1.8, defaultDepth: 0.35,
    defaultColor: '#92400e',
    parts: (w, h, d) => {
      const shelfCount = 5
      const sideT = 0.03
      const shelfT = 0.025
      const parts = [
        // sides
        { shape: 'box', offset: [-w/2 + sideT/2, h/2, 0], size: [sideT, h, d] },
        { shape: 'box', offset: [ w/2 - sideT/2, h/2, 0], size: [sideT, h, d] },
        // back
        { shape: 'box', offset: [0, h/2, d/2 - 0.01], size: [w, h, 0.02] },
      ]
      for (let i = 0; i < shelfCount; i++) {
        const y = (h / (shelfCount - 1)) * i
        parts.push({ shape: 'box', offset: [0, y, 0], size: [w - sideT * 2, shelfT, d] })
      }
      return parts
    },
  },

  sink: {
    label: 'Sink',
    category: 'Kitchen & Bath',
    defaultWidth: 0.6, defaultHeight: 0.85, defaultDepth: 0.5,
    defaultColor: '#d4d4d8',
    parts: (w, h, d) => [
      { shape: 'box', offset: [0, h * 0.45, 0], size: [w, h * 0.9, d] },                    // cabinet
      { shape: 'box', offset: [0, h * 0.92, 0], size: [w, 0.04, d], color: '#f4f4f5' },     // countertop
      { shape: 'box', offset: [0, h * 0.88, 0], size: [w * 0.6, 0.12, d * 0.6], color: '#e4e4e7' }, // basin
    ],
  },

  kitchen_counter: {
    label: 'Kitchen Counter',
    category: 'Kitchen & Bath',
    defaultWidth: 2.4, defaultHeight: 0.9, defaultDepth: 0.6,
    defaultColor: '#a1a1aa',
    parts: (w, h, d) => [
      { shape: 'box', offset: [0, h * 0.45, 0], size: [w, h * 0.9, d] },                    // cabinet
      { shape: 'box', offset: [0, h * 0.93, 0], size: [w + 0.03, 0.04, d + 0.03], color: '#f4f4f5' }, // countertop
    ],
  },

  custom_box: {
    label: 'Custom Box',
    category: 'Custom Shapes',
    defaultWidth: 1.0, defaultHeight: 1.0, defaultDepth: 1.0,
    defaultColor: '#9ca3af',
    parts: (w, h, d) => [
      { shape: 'box', offset: [0, h/2, 0], size: [w, h, d] },
    ],
  },

  custom_cylinder: {
    label: 'Custom Cylinder',
    category: 'Custom Shapes',
    defaultWidth: 0.5, defaultHeight: 1.0, defaultDepth: 0.5,
    defaultColor: '#9ca3af',
    parts: (w, h) => [
      { shape: 'cylinder', offset: [0, h/2, 0], radius: w/2, height: h },
    ],
  },
}

// ── GLTF model registry ────────────────────────────────────────
// Add entries here when you place .glb files in public/models/.
// Example:
//   { id: 'my-sofa', label: 'My Sofa', category: 'Seating', path: '/models/my-sofa.glb' }

export const MODEL_REGISTRY = []

// ── Category order for the UI ──────────────────────────────────
export const CATEGORIES = [
  'Seating',
  'Tables & Desks',
  'Storage',
  'Kitchen & Bath',
  'Custom Shapes',
]
