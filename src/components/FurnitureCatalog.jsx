import { useState, useRef, useEffect } from 'react'
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

const labelStyle = {
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#94a3b8',
  marginBottom: 3,
  display: 'block',
}

const triggerStyle = {
  width: '100%',
  padding: '7px 8px',
  background: '#2a2a2a',
  border: '1px solid #444',
  borderRadius: 4,
  color: '#e2e8f0',
  fontSize: 12,
  cursor: 'pointer',
  marginBottom: 10,
  textAlign: 'left',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}

const menuStyle = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: '100%',
  marginTop: 2,
  background: '#1e1e1e',
  border: '1px solid #444',
  borderRadius: 4,
  maxHeight: 200,
  overflowY: 'auto',
  zIndex: 20,
}

const menuItemStyle = {
  padding: '6px 10px',
  fontSize: 12,
  cursor: 'pointer',
  color: '#e2e8f0',
  transition: 'background 0.1s',
}

function CategoryDropdown({ label, items, isPresets, onAdd }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', handler)
    return () => document.removeEventListener('pointerdown', handler)
  }, [open])

  const handlePick = (item) => {
    if (isPresets) {
      onAdd(item)
    } else {
      onAdd(item.key)
    }
    setOpen(false)
  }

  return (
    <div style={{ position: 'relative', marginBottom: 2 }} ref={ref}>
      <label style={labelStyle}>{label}</label>
      <button
        style={{
          ...triggerStyle,
          borderColor: open ? '#3b82f6' : '#444',
        }}
        onClick={() => setOpen(!open)}
      >
        <span style={{ color: '#64748b' }}>+ Add</span>
        <span style={{ fontSize: 10, color: '#64748b' }}>{open ? '▴' : '▾'}</span>
      </button>

      {open && (
        <div style={menuStyle}>
          {items.map(item => (
            <div
              key={isPresets ? item.id : item.key}
              style={menuItemStyle}
              onMouseEnter={e => e.currentTarget.style.background = '#333'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              onClick={() => handlePick(item)}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
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

  const isPresets = tab === 'presets'
  const grouped = isPresets ? modelGrouped : parametricGrouped

  return (
    <div style={panelStyle}>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, color: '#f1f5f9' }}>
        Furniture
      </div>

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

      {CATEGORIES.map(cat => {
        const items = grouped[cat]
        if (!items) return null
        return (
          <CategoryDropdown
            key={`${tab}-${cat}`}
            label={cat}
            items={items}
            isPresets={isPresets}
            onAdd={isPresets ? onAddModel : onAddParametric}
          />
        )
      })}
    </div>
  )
}
