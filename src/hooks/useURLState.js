// ── URL state helpers ─────────────────────────────────────────────────────────
// Encodes all app state into URLSearchParams and restores from them on load.

const DEFAULTS = {
  showNorthWall:    true,
  showSouthWall:    true,
  showEastWall:     false,
  showWestWall:     true,
  showCeiling:      true,
  showMeasurements: true,
  showGrid:         true,
  showLighting:     true,
  bgColor:          '#908c8c',
  ambientInt:       0.8,
  topInt:           0.0,
  frontInt:         0.0,
  backInt:          0.0,
  plOn:             true,
  plInt:            500,
  plDist:           17,
  plX:              0,
  plY:              15,
  plZ:              -5,
  roomWallColor:    '#ffffff',
  roomWallOpacity:  1.0,
  bathWallColor:    '#ffffff',
  groundWallColor:  '#ffffff',
  railColor:        '#ffffff',
  mezzColor:        '#7c3a0e',
  items:            [],
}

function parseBool(val, def) {
  if (val === null || val === undefined) return def
  return val === '1'
}

function parseNum(val, def) {
  if (val === null || val === undefined) return def
  const n = parseFloat(val)
  return isNaN(n) ? def : n
}

function parseColor(val, def) {
  if (!val) return def
  return val.startsWith('#') ? val : '#' + val
}

/** Read window.location.search and return all settings with defaults for missing params. */
export function parseURL() {
  const params = new URLSearchParams(window.location.search)
  const p = (key) => params.get(key)

  let items = DEFAULTS.items
  try {
    const raw = p('items')
    if (raw) items = JSON.parse(decodeURIComponent(atob(raw)))
  } catch {
    items = DEFAULTS.items
  }

  return {
    showNorthWall:    parseBool(p('nw'),  DEFAULTS.showNorthWall),
    showSouthWall:    parseBool(p('sw'),  DEFAULTS.showSouthWall),
    showEastWall:     parseBool(p('ew'),  DEFAULTS.showEastWall),
    showWestWall:     parseBool(p('ww'),  DEFAULTS.showWestWall),
    showCeiling:      parseBool(p('cl'),  DEFAULTS.showCeiling),
    showMeasurements: parseBool(p('ms'),  DEFAULTS.showMeasurements),
    showGrid:         parseBool(p('gr'),  DEFAULTS.showGrid),
    showLighting:     parseBool(p('lt'),  DEFAULTS.showLighting),
    bgColor:          parseColor(p('bg'), DEFAULTS.bgColor),
    ambientInt:       parseNum(p('ai'),   DEFAULTS.ambientInt),
    topInt:           parseNum(p('ti'),   DEFAULTS.topInt),
    frontInt:         parseNum(p('fi'),   DEFAULTS.frontInt),
    backInt:          parseNum(p('bi'),   DEFAULTS.backInt),
    plOn:             parseBool(p('pl'),  DEFAULTS.plOn),
    plInt:            parseNum(p('pi'),   DEFAULTS.plInt),
    plDist:           parseNum(p('pd'),   DEFAULTS.plDist),
    plX:              parseNum(p('plx'),  DEFAULTS.plX),
    plY:              parseNum(p('ply'),  DEFAULTS.plY),
    plZ:              parseNum(p('plz'),  DEFAULTS.plZ),
    roomWallColor:    parseColor(p('rwc'), DEFAULTS.roomWallColor),
    roomWallOpacity:  parseNum(p('rwo'),   DEFAULTS.roomWallOpacity),
    bathWallColor:    parseColor(p('bwc'), DEFAULTS.bathWallColor),
    groundWallColor:  parseColor(p('gwc'), DEFAULTS.groundWallColor),
    railColor:        parseColor(p('rc'),  DEFAULTS.railColor),
    mezzColor:        parseColor(p('mc'),  DEFAULTS.mezzColor),
    items,
  }
}

/** Merge patch into current URLSearchParams and call history.replaceState. */
export function writeURL(patch) {
  const params = new URLSearchParams(window.location.search)
  Object.entries(patch).forEach(([key, val]) => {
    if (val === null || val === undefined) {
      params.delete(key)
    } else {
      params.set(key, String(val))
    }
  })
  history.replaceState(null, '', '?' + params.toString())
}
