import { PARAMETRIC_PRESETS, MODEL_REGISTRY, CATEGORIES } from '../data/furnitureCatalog'

const panelStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: 200,
  height: '100vh',
  overflowY: 'auto',
  background: 'rgba(20, 20, 20, 0.92)',
  borderRight: '1px solid #333',
  padding: '12px 10px',
  fontFamily: 'system-ui, sans-serif',
  fontSize: 13,
  color: '#e2e8f0',
  zIndex: 10,
  userSelect: 'none',
}

const categoryStyle = {
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#94a3b8',
  margin: '14px 0 6px',
}

const btnStyle = {
  display: 'block',
  width: '100%',
  padding: '7px 10px',
  marginBottom: 3,
  background: '#2a2a2a',
  border: '1px solid #3a3a3a',
  borderRadius: 4,
  color: '#e2e8f0',
  fontSize: 13,
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'background 0.15s',
}

export default function FurnitureCatalog({ onAddParametric, onAddModel }) {
  // Group parametric presets by category
  const grouped = {}
  for (const [key, preset] of Object.entries(PARAMETRIC_PRESETS)) {
    const cat = preset.category
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push({ key, ...preset })
  }

  // Group models by category
  const modelGrouped = {}
  for (const entry of MODEL_REGISTRY) {
    const cat = entry.category
    if (!modelGrouped[cat]) modelGrouped[cat] = []
    modelGrouped[cat].push(entry)
  }

  return (
    <div style={panelStyle}>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, color: '#f1f5f9' }}>
        Furniture
      </div>

      {/* GLTF Models section */}
      {MODEL_REGISTRY.length > 0 && (
        <>
          <div style={{ ...categoryStyle, color: '#60a5fa' }}>Models</div>
          {CATEGORIES.map(cat => {
            const items = modelGrouped[cat]
            if (!items) return null
            return items.map(entry => (
              <button
                key={entry.id}
                style={btnStyle}
                onMouseEnter={e => e.target.style.background = '#3a3a3a'}
                onMouseLeave={e => e.target.style.background = '#2a2a2a'}
                onClick={() => onAddModel(entry)}
              >
                {entry.label}
              </button>
            ))
          })}
          <div style={{ borderBottom: '1px solid #333', margin: '10px 0' }} />
        </>
      )}

      {/* Parametric presets by category */}
      {CATEGORIES.map(cat => {
        const items = grouped[cat]
        if (!items) return null
        return (
          <div key={cat}>
            <div style={categoryStyle}>{cat}</div>
            {items.map(item => (
              <button
                key={item.key}
                style={btnStyle}
                onMouseEnter={e => e.target.style.background = '#3a3a3a'}
                onMouseLeave={e => e.target.style.background = '#2a2a2a'}
                onClick={() => onAddParametric(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
        )
      })}
    </div>
  )
}
