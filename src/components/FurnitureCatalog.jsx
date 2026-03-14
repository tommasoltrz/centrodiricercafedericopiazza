import { useState } from 'react'
import { PARAMETRIC_PRESETS, MODEL_REGISTRY, CATEGORIES } from '../data/furnitureCatalog'

const panelStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: 210,
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

const tabRow = {
  display: 'flex',
  gap: 0,
  marginBottom: 10,
  borderRadius: 5,
  overflow: 'hidden',
  border: '1px solid #444',
}

const tabStyle = {
  flex: 1,
  padding: '6px 0',
  background: '#2a2a2a',
  border: 'none',
  color: '#94a3b8',
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'background 0.15s, color 0.15s',
}

const tabActiveStyle = {
  ...tabStyle,
  background: '#3b82f6',
  color: '#fff',
}

const categoryHeader = {
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#94a3b8',
  padding: '8px 4px 4px',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}

const btnStyle = {
  display: 'block',
  width: '100%',
  padding: '6px 10px',
  marginBottom: 2,
  background: '#2a2a2a',
  border: '1px solid #3a3a3a',
  borderRadius: 4,
  color: '#e2e8f0',
  fontSize: 12,
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'background 0.15s',
}

function CategoryGroup({ name, children }) {
  const [open, setOpen] = useState(true)
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={categoryHeader} onClick={() => setOpen(!open)}>
        <span>{name}</span>
        <span style={{ fontSize: 10, color: '#64748b' }}>{open ? '▾' : '▸'}</span>
      </div>
      {open && <div style={{ paddingLeft: 2 }}>{children}</div>}
    </div>
  )
}

function ItemButton({ label, onClick }) {
  return (
    <button
      style={btnStyle}
      onMouseEnter={e => e.currentTarget.style.background = '#3a3a3a'}
      onMouseLeave={e => e.currentTarget.style.background = '#2a2a2a'}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

export default function FurnitureCatalog({ onAddParametric, onAddModel }) {
  const [tab, setTab] = useState('presets')

  // Group models by category
  const modelGrouped = {}
  for (const entry of MODEL_REGISTRY) {
    if (!modelGrouped[entry.category]) modelGrouped[entry.category] = []
    modelGrouped[entry.category].push(entry)
  }

  // Group parametric presets by category
  const parametricGrouped = {}
  for (const [key, preset] of Object.entries(PARAMETRIC_PRESETS)) {
    if (!parametricGrouped[preset.category]) parametricGrouped[preset.category] = []
    parametricGrouped[preset.category].push({ key, ...preset })
  }

  return (
    <div style={panelStyle}>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, color: '#f1f5f9' }}>
        Furniture
      </div>

      {/* Tab switcher */}
      <div style={tabRow}>
        <button
          style={tab === 'presets' ? tabActiveStyle : tabStyle}
          onClick={() => setTab('presets')}
        >
          Presets
        </button>
        <button
          style={tab === 'custom' ? tabActiveStyle : tabStyle}
          onClick={() => setTab('custom')}
        >
          Custom
        </button>
      </div>

      {/* Presets tab — GLTF models grouped by category */}
      {tab === 'presets' && (
        MODEL_REGISTRY.length > 0 ? (
          CATEGORIES.map(cat => {
            const items = modelGrouped[cat]
            if (!items) return null
            return (
              <CategoryGroup key={cat} name={cat}>
                {items.map(entry => (
                  <ItemButton
                    key={entry.id}
                    label={entry.label}
                    onClick={() => onAddModel(entry)}
                  />
                ))}
              </CategoryGroup>
            )
          })
        ) : (
          <div style={{ color: '#64748b', fontSize: 12, padding: '8px 4px' }}>
            No models yet. Add .glb files to public/models/ and register them in furnitureCatalog.js
          </div>
        )
      )}

      {/* Custom tab — parametric shapes grouped by category */}
      {tab === 'custom' && (
        CATEGORIES.map(cat => {
          const items = parametricGrouped[cat]
          if (!items) return null
          return (
            <CategoryGroup key={cat} name={cat}>
              {items.map(item => (
                <ItemButton
                  key={item.key}
                  label={item.label}
                  onClick={() => onAddParametric(item.key)}
                />
              ))}
            </CategoryGroup>
          )
        })
      )}
    </div>
  )
}
