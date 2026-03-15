import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'
import { PARAMETRIC_PRESETS, MODEL_REGISTRY } from '../data/furnitureCatalog'

// ── Compact furniture serialization ───────────────────────────────────────────
// Only stores fields that differ from catalog defaults to minimize URL size.

const modelById = Object.fromEntries(MODEL_REGISTRY.map(m => [m.id, m]))

function round(n, d = 2) { return Math.round(n * 10 ** d) / 10 ** d }

function compactItem(item) {
  const o = {}
  if (item.type === 'model') {
    // Find registry id from modelPath
    const entry = MODEL_REGISTRY.find(m => m.path === item.modelPath)
    o.m = entry ? entry.id : item.modelPath
    if (item.scale !== 1) o.s = round(item.scale)
  } else {
    o.k = item.preset
    const preset = PARAMETRIC_PRESETS[item.preset]
    if (preset) {
      if (item.width  !== preset.defaultWidth)  o.w = round(item.width)
      if (item.height !== preset.defaultHeight) o.h = round(item.height)
      if (item.depth  !== preset.defaultDepth)  o.d = round(item.depth)
      if (item.color  !== preset.defaultColor)  o.c = item.color.replace('#', '')
    } else {
      o.w = round(item.width); o.h = round(item.height); o.d = round(item.depth)
      o.c = item.color.replace('#', '')
    }
  }
  const p = item.position.map(v => round(v))
  if (p[0] !== 0 || p[1] !== 0 || p[2] !== 0) o.p = p
  if (round(item.rotation) !== 0) o.r = round(item.rotation)
  if (item.floor === 'mezzanine') o.f = 'm'
  return o
}

function expandItem(o) {
  const base = {
    id: crypto.randomUUID(),
    position: o.p || [0, 0, 0],
    rotation: o.r || 0,
    floor: o.f === 'm' ? 'mezzanine' : 'ground',
  }
  if (o.m) {
    const entry = modelById[o.m]
    return {
      ...base,
      type: 'model',
      modelPath: entry ? entry.path : o.m,
      label: entry ? entry.label : o.m,
      scale: o.s ?? 1,
    }
  } else {
    const preset = PARAMETRIC_PRESETS[o.k]
    return {
      ...base,
      type: 'parametric',
      preset: o.k,
      label: preset ? preset.label : o.k,
      width:  o.w ?? (preset ? preset.defaultWidth  : 1),
      height: o.h ?? (preset ? preset.defaultHeight : 1),
      depth:  o.d ?? (preset ? preset.defaultDepth  : 1),
      color:  o.c ? '#' + o.c : (preset ? preset.defaultColor : '#9ca3af'),
    }
  }
}

export function serializeItems(items) {
  if (!items.length) return null
  return compressToEncodedURIComponent(JSON.stringify(items.map(compactItem)))
}

export function deserializeItems(raw) {
  // Try lz-string compressed format first
  const lz = decompressFromEncodedURIComponent(raw)
  if (lz) {
    try {
      const arr = JSON.parse(lz)
      if (Array.isArray(arr)) return arr.map(o => (o.m !== undefined || o.k !== undefined) ? expandItem(o) : o)
    } catch { /* fall through */ }
  }

  // Legacy: base64-encoded (with or without URL encoding inside)
  let str = atob(raw)
  if (str.startsWith('%5B') || str.startsWith('%7B')) {
    str = decodeURIComponent(str)
  }
  const arr = JSON.parse(str)
  return arr.map(o => (o.m !== undefined || o.k !== undefined) ? expandItem(o) : o)
}

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
  gridColor:        '#cbd5e1',
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
    if (raw) items = deserializeItems(raw)
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
    gridColor:        parseColor(p('gc'),  DEFAULTS.gridColor),
    items,
  }
}

const URL_LIMIT = 2048
const URL_WARN_RATIO = 0.95
let urlWarningShown = false

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
  const qs = '?' + params.toString()
  const fullLength = window.location.origin.length + window.location.pathname.length + qs.length
  history.replaceState(null, '', qs)

  if (fullLength >= URL_LIMIT * URL_WARN_RATIO && !urlWarningShown) {
    urlWarningShown = true
    alert(`URL is at ${Math.round(fullLength / URL_LIMIT * 100)}% of the browser limit (${fullLength}/${URL_LIMIT} chars). Adding more items may cause sharing issues.`)
  } else if (fullLength < URL_LIMIT * URL_WARN_RATIO) {
    urlWarningShown = false
  }
}
