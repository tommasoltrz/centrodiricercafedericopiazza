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

// ── GLTF model registry (Kenney Furniture Kit) ─────────────────
// Add entries here when you place .glb files in public/models/.

export const MODEL_REGISTRY = [
  // ── Seating ──
  { id: 'loungeChair',            label: 'Lounge Chair',             category: 'Seating',        path: '/models/loungeChair.glb' },
  { id: 'loungeChairRelax',       label: 'Lounge Chair Relax',       category: 'Seating',        path: '/models/loungeChairRelax.glb' },
  { id: 'loungeDesignChair',      label: 'Design Chair',             category: 'Seating',        path: '/models/loungeDesignChair.glb' },
  { id: 'loungeSofa',             label: 'Sofa',                     category: 'Seating',        path: '/models/loungeSofa.glb' },
  { id: 'loungeSofaCorner',       label: 'Sofa Corner',              category: 'Seating',        path: '/models/loungeSofaCorner.glb' },
  { id: 'loungeSofaLong',         label: 'Sofa Long',                category: 'Seating',        path: '/models/loungeSofaLong.glb' },
  { id: 'loungeSofaOttoman',      label: 'Ottoman',                  category: 'Seating',        path: '/models/loungeSofaOttoman.glb' },
  { id: 'loungeDesignSofa',       label: 'Design Sofa',              category: 'Seating',        path: '/models/loungeDesignSofa.glb' },
  { id: 'loungeDesignSofaCorner', label: 'Design Sofa Corner',       category: 'Seating',        path: '/models/loungeDesignSofaCorner.glb' },
  { id: 'chair',                  label: 'Chair',                    category: 'Seating',        path: '/models/chair.glb' },
  { id: 'chairCushion',           label: 'Chair Cushion',            category: 'Seating',        path: '/models/chairCushion.glb' },
  { id: 'chairModernCushion',     label: 'Modern Chair',             category: 'Seating',        path: '/models/chairModernCushion.glb' },
  { id: 'chairModernFrameCushion',label: 'Modern Frame Chair',       category: 'Seating',        path: '/models/chairModernFrameCushion.glb' },
  { id: 'chairRounded',           label: 'Rounded Chair',            category: 'Seating',        path: '/models/chairRounded.glb' },
  { id: 'chairDesk',              label: 'Desk Chair',               category: 'Seating',        path: '/models/chairDesk.glb' },
  { id: 'stoolBar',               label: 'Bar Stool',                category: 'Seating',        path: '/models/stoolBar.glb' },
  { id: 'stoolBarSquare',         label: 'Bar Stool Square',         category: 'Seating',        path: '/models/stoolBarSquare.glb' },
  { id: 'bench',                  label: 'Bench',                    category: 'Seating',        path: '/models/bench.glb' },
  { id: 'benchCushion',           label: 'Bench Cushion',            category: 'Seating',        path: '/models/benchCushion.glb' },
  { id: 'benchCushionLow',        label: 'Bench Low',                category: 'Seating',        path: '/models/benchCushionLow.glb' },

  // ── Beds ──
  { id: 'bedSingle',              label: 'Bed Single',               category: 'Beds',           path: '/models/bedSingle.glb' },
  { id: 'bedDouble',              label: 'Bed Double',               category: 'Beds',           path: '/models/bedDouble.glb' },
  { id: 'bedBunk',                label: 'Bunk Bed',                 category: 'Beds',           path: '/models/bedBunk.glb' },
  { id: 'cabinetBed',             label: 'Bedside Cabinet',          category: 'Beds',           path: '/models/cabinetBed.glb' },
  { id: 'cabinetBedDrawer',       label: 'Bedside Drawer',           category: 'Beds',           path: '/models/cabinetBedDrawer.glb' },
  { id: 'cabinetBedDrawerTable',  label: 'Bedside Table',            category: 'Beds',           path: '/models/cabinetBedDrawerTable.glb' },
  { id: 'pillow',                 label: 'Pillow',                   category: 'Beds',           path: '/models/pillow.glb' },
  { id: 'pillowLong',             label: 'Pillow Long',              category: 'Beds',           path: '/models/pillowLong.glb' },

  // ── Tables & Desks ──
  { id: 'table',                  label: 'Table',                    category: 'Tables & Desks', path: '/models/table.glb' },
  { id: 'tableCloth',             label: 'Table with Cloth',         category: 'Tables & Desks', path: '/models/tableCloth.glb' },
  { id: 'tableRound',             label: 'Round Table',              category: 'Tables & Desks', path: '/models/tableRound.glb' },
  { id: 'tableGlass',             label: 'Glass Table',              category: 'Tables & Desks', path: '/models/tableGlass.glb' },
  { id: 'tableCross',             label: 'Cross Table',              category: 'Tables & Desks', path: '/models/tableCross.glb' },
  { id: 'tableCrossCloth',        label: 'Cross Table Cloth',        category: 'Tables & Desks', path: '/models/tableCrossCloth.glb' },
  { id: 'tableCoffee',            label: 'Coffee Table',             category: 'Tables & Desks', path: '/models/tableCoffee.glb' },
  { id: 'tableCoffeeSquare',      label: 'Coffee Table Square',      category: 'Tables & Desks', path: '/models/tableCoffeeSquare.glb' },
  { id: 'tableCoffeeGlass',       label: 'Coffee Table Glass',       category: 'Tables & Desks', path: '/models/tableCoffeeGlass.glb' },
  { id: 'tableCoffeeGlassSquare', label: 'Coffee Table Glass Sq.',   category: 'Tables & Desks', path: '/models/tableCoffeeGlassSquare.glb' },
  { id: 'sideTable',              label: 'Side Table',               category: 'Tables & Desks', path: '/models/sideTable.glb' },
  { id: 'sideTableDrawers',       label: 'Side Table Drawers',       category: 'Tables & Desks', path: '/models/sideTableDrawers.glb' },
  { id: 'desk',                   label: 'Desk',                     category: 'Tables & Desks', path: '/models/desk.glb' },
  { id: 'deskCorner',             label: 'Corner Desk',              category: 'Tables & Desks', path: '/models/deskCorner.glb' },
  { id: 'kitchenBar',             label: 'Kitchen Bar',              category: 'Tables & Desks', path: '/models/kitchenBar.glb' },
  { id: 'kitchenBarEnd',          label: 'Kitchen Bar End',          category: 'Tables & Desks', path: '/models/kitchenBarEnd.glb' },

  // ── Storage ──
  { id: 'bookcaseOpen',           label: 'Bookcase Open',            category: 'Storage',        path: '/models/bookcaseOpen.glb' },
  { id: 'bookcaseOpenLow',        label: 'Bookcase Low',             category: 'Storage',        path: '/models/bookcaseOpenLow.glb' },
  { id: 'bookcaseClosed',         label: 'Bookcase Closed',          category: 'Storage',        path: '/models/bookcaseClosed.glb' },
  { id: 'bookcaseClosedDoors',    label: 'Bookcase Doors',           category: 'Storage',        path: '/models/bookcaseClosedDoors.glb' },
  { id: 'bookcaseClosedWide',     label: 'Bookcase Wide',            category: 'Storage',        path: '/models/bookcaseClosedWide.glb' },
  { id: 'books',                  label: 'Books',                    category: 'Storage',        path: '/models/books.glb' },
  { id: 'cabinetTelevision',      label: 'TV Cabinet',               category: 'Storage',        path: '/models/cabinetTelevision.glb' },
  { id: 'cabinetTelevisionDoors', label: 'TV Cabinet Doors',         category: 'Storage',        path: '/models/cabinetTelevisionDoors.glb' },
  { id: 'coatRack',               label: 'Coat Rack',                category: 'Storage',        path: '/models/coatRack.glb' },
  { id: 'coatRackStanding',       label: 'Coat Rack Standing',       category: 'Storage',        path: '/models/coatRackStanding.glb' },
  { id: 'cardboardBoxClosed',     label: 'Box Closed',               category: 'Storage',        path: '/models/cardboardBoxClosed.glb' },
  { id: 'cardboardBoxOpen',       label: 'Box Open',                 category: 'Storage',        path: '/models/cardboardBoxOpen.glb' },
  { id: 'trashcan',               label: 'Trashcan',                 category: 'Storage',        path: '/models/trashcan.glb' },

  // ── Kitchen ──
  { id: 'kitchenCabinet',             label: 'Cabinet',              category: 'Kitchen',        path: '/models/kitchenCabinet.glb' },
  { id: 'kitchenCabinetCornerInner',  label: 'Cabinet Corner',       category: 'Kitchen',        path: '/models/kitchenCabinetCornerInner.glb' },
  { id: 'kitchenCabinetCornerRound',  label: 'Cabinet Corner Round', category: 'Kitchen',        path: '/models/kitchenCabinetCornerRound.glb' },
  { id: 'kitchenCabinetDrawer',       label: 'Cabinet Drawer',       category: 'Kitchen',        path: '/models/kitchenCabinetDrawer.glb' },
  { id: 'kitchenCabinetUpper',        label: 'Upper Cabinet',        category: 'Kitchen',        path: '/models/kitchenCabinetUpper.glb' },
  { id: 'kitchenCabinetUpperCorner',  label: 'Upper Cabinet Corner', category: 'Kitchen',        path: '/models/kitchenCabinetUpperCorner.glb' },
  { id: 'kitchenCabinetUpperDouble',  label: 'Upper Cabinet Double', category: 'Kitchen',        path: '/models/kitchenCabinetUpperDouble.glb' },
  { id: 'kitchenCabinetUpperLow',     label: 'Upper Cabinet Low',    category: 'Kitchen',        path: '/models/kitchenCabinetUpperLow.glb' },
  { id: 'kitchenSink',                label: 'Kitchen Sink',         category: 'Kitchen',        path: '/models/kitchenSink.glb' },
  { id: 'kitchenStove',               label: 'Stove',                category: 'Kitchen',        path: '/models/kitchenStove.glb' },
  { id: 'kitchenStoveElectric',       label: 'Electric Stove',       category: 'Kitchen',        path: '/models/kitchenStoveElectric.glb' },
  { id: 'kitchenFridge',              label: 'Fridge',               category: 'Kitchen',        path: '/models/kitchenFridge.glb' },
  { id: 'kitchenFridgeBuiltIn',       label: 'Fridge Built-in',      category: 'Kitchen',        path: '/models/kitchenFridgeBuiltIn.glb' },
  { id: 'kitchenFridgeLarge',         label: 'Fridge Large',         category: 'Kitchen',        path: '/models/kitchenFridgeLarge.glb' },
  { id: 'kitchenFridgeSmall',         label: 'Fridge Small',         category: 'Kitchen',        path: '/models/kitchenFridgeSmall.glb' },
  { id: 'kitchenMicrowave',           label: 'Microwave',            category: 'Kitchen',        path: '/models/kitchenMicrowave.glb' },
  { id: 'kitchenBlender',             label: 'Blender',              category: 'Kitchen',        path: '/models/kitchenBlender.glb' },
  { id: 'kitchenCoffeeMachine',       label: 'Coffee Machine',       category: 'Kitchen',        path: '/models/kitchenCoffeeMachine.glb' },
  { id: 'toaster',                    label: 'Toaster',              category: 'Kitchen',        path: '/models/toaster.glb' },
  { id: 'hoodLarge',                  label: 'Hood Large',           category: 'Kitchen',        path: '/models/hoodLarge.glb' },
  { id: 'hoodModern',                 label: 'Hood Modern',          category: 'Kitchen',        path: '/models/hoodModern.glb' },

  // ── Bathroom ──
  { id: 'bathroomSink',           label: 'Bathroom Sink',            category: 'Bathroom',       path: '/models/bathroomSink.glb' },
  { id: 'bathroomSinkSquare',     label: 'Bathroom Sink Square',     category: 'Bathroom',       path: '/models/bathroomSinkSquare.glb' },
  { id: 'bathroomCabinet',        label: 'Bathroom Cabinet',         category: 'Bathroom',       path: '/models/bathroomCabinet.glb' },
  { id: 'bathroomCabinetDrawer',  label: 'Bathroom Cabinet Drawer',  category: 'Bathroom',       path: '/models/bathroomCabinetDrawer.glb' },
  { id: 'bathroomMirror',         label: 'Mirror',                   category: 'Bathroom',       path: '/models/bathroomMirror.glb' },
  { id: 'bathtub',                label: 'Bathtub',                  category: 'Bathroom',       path: '/models/bathtub.glb' },
  { id: 'shower',                 label: 'Shower',                   category: 'Bathroom',       path: '/models/shower.glb' },
  { id: 'showerRound',            label: 'Shower Round',             category: 'Bathroom',       path: '/models/showerRound.glb' },
  { id: 'toilet',                 label: 'Toilet',                   category: 'Bathroom',       path: '/models/toilet.glb' },
  { id: 'toiletSquare',           label: 'Toilet Square',            category: 'Bathroom',       path: '/models/toiletSquare.glb' },
  { id: 'washer',                 label: 'Washer',                   category: 'Bathroom',       path: '/models/washer.glb' },
  { id: 'dryer',                  label: 'Dryer',                    category: 'Bathroom',       path: '/models/dryer.glb' },
  { id: 'washerDryerStacked',     label: 'Washer/Dryer Stacked',     category: 'Bathroom',       path: '/models/washerDryerStacked.glb' },

  // ── Electronics ──
  { id: 'televisionModern',       label: 'TV Modern',                category: 'Electronics',    path: '/models/televisionModern.glb' },
  { id: 'televisionVintage',      label: 'TV Vintage',               category: 'Electronics',    path: '/models/televisionVintage.glb' },
  { id: 'televisionAntenna',      label: 'TV Antenna',               category: 'Electronics',    path: '/models/televisionAntenna.glb' },
  { id: 'computerScreen',         label: 'Computer Screen',          category: 'Electronics',    path: '/models/computerScreen.glb' },
  { id: 'computerKeyboard',       label: 'Keyboard',                 category: 'Electronics',    path: '/models/computerKeyboard.glb' },
  { id: 'computerMouse',          label: 'Mouse',                    category: 'Electronics',    path: '/models/computerMouse.glb' },
  { id: 'laptop',                 label: 'Laptop',                   category: 'Electronics',    path: '/models/laptop.glb' },
  { id: 'speaker',                label: 'Speaker',                  category: 'Electronics',    path: '/models/speaker.glb' },
  { id: 'speakerSmall',           label: 'Speaker Small',            category: 'Electronics',    path: '/models/speakerSmall.glb' },
  { id: 'radio',                  label: 'Radio',                    category: 'Electronics',    path: '/models/radio.glb' },

  // ── Lighting ──
  { id: 'lampRoundFloor',         label: 'Floor Lamp Round',         category: 'Lighting',       path: '/models/lampRoundFloor.glb' },
  { id: 'lampRoundTable',         label: 'Table Lamp Round',         category: 'Lighting',       path: '/models/lampRoundTable.glb' },
  { id: 'lampSquareFloor',        label: 'Floor Lamp Square',        category: 'Lighting',       path: '/models/lampSquareFloor.glb' },
  { id: 'lampSquareTable',        label: 'Table Lamp Square',        category: 'Lighting',       path: '/models/lampSquareTable.glb' },
  { id: 'lampSquareCeiling',      label: 'Ceiling Lamp',             category: 'Lighting',       path: '/models/lampSquareCeiling.glb' },
  { id: 'lampWall',               label: 'Wall Lamp',                category: 'Lighting',       path: '/models/lampWall.glb' },
  { id: 'ceilingFan',             label: 'Ceiling Fan',              category: 'Lighting',       path: '/models/ceilingFan.glb' },

  // ── Decor ──
  { id: 'pottedPlant',            label: 'Potted Plant',             category: 'Decor',          path: '/models/pottedPlant.glb' },
  { id: 'plantSmall1',            label: 'Small Plant 1',            category: 'Decor',          path: '/models/plantSmall1.glb' },
  { id: 'plantSmall2',            label: 'Small Plant 2',            category: 'Decor',          path: '/models/plantSmall2.glb' },
  { id: 'plantSmall3',            label: 'Small Plant 3',            category: 'Decor',          path: '/models/plantSmall3.glb' },
  { id: 'bear',                   label: 'Teddy Bear',               category: 'Decor',          path: '/models/bear.glb' },
  { id: 'rugRectangle',           label: 'Rug Rectangle',            category: 'Decor',          path: '/models/rugRectangle.glb' },
  { id: 'rugSquare',              label: 'Rug Square',               category: 'Decor',          path: '/models/rugSquare.glb' },
  { id: 'rugRound',               label: 'Rug Round',                category: 'Decor',          path: '/models/rugRound.glb' },
  { id: 'rugRounded',             label: 'Rug Rounded',              category: 'Decor',          path: '/models/rugRounded.glb' },
  { id: 'rugDoormat',             label: 'Doormat',                  category: 'Decor',          path: '/models/rugDoormat.glb' },
]

// ── Category order for the UI ──────────────────────────────────
export const CATEGORIES = [
  'Seating',
  'Beds',
  'Tables & Desks',
  'Storage',
  'Kitchen',
  'Bathroom',
  'Electronics',
  'Lighting',
  'Decor',
  'Kitchen & Bath',
  'Custom Shapes',
]
