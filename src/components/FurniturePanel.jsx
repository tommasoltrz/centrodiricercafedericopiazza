const panelStyle = {
  position: 'absolute',
  top: 10,
  left: 220,
  width: 220,
  background: 'rgba(20, 20, 20, 0.92)',
  border: '1px solid #333',
  borderRadius: 6,
  padding: '14px 12px',
  fontFamily: 'system-ui, sans-serif',
  fontSize: 13,
  color: '#e2e8f0',
  zIndex: 10,
  userSelect: 'none',
}

const labelStyle = { display: 'block', marginBottom: 8 }
const inputStyle = {
  width: 60,
  padding: '3px 6px',
  background: '#2a2a2a',
  border: '1px solid #444',
  borderRadius: 3,
  color: '#e2e8f0',
  fontSize: 12,
  marginLeft: 6,
}
const colorInputStyle = {
  width: 32,
  height: 24,
  border: '1px solid #444',
  borderRadius: 3,
  background: 'none',
  cursor: 'pointer',
  marginLeft: 6,
  padding: 0,
}
const btnRow = { display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }
const smallBtn = {
  padding: '5px 10px',
  background: '#2a2a2a',
  border: '1px solid #444',
  borderRadius: 4,
  color: '#e2e8f0',
  fontSize: 12,
  cursor: 'pointer',
}
const activeBtn = { ...smallBtn, background: '#3b82f6', borderColor: '#3b82f6' }
const dangerBtn = { ...smallBtn, background: '#991b1b', borderColor: '#991b1b' }

export default function FurniturePanel({
  item,
  selectedCount,
  transformMode,
  onUpdate,
  onDelete,
  onDeleteSelected,
  onDuplicate,
  onSetTransformMode,
}) {
  if (!item && !selectedCount) return null

  // Multi-select: show only shared controls
  if (!item && selectedCount > 1) {
    return (
      <div style={panelStyle}>
        <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 14 }}>
          {selectedCount} items selected
        </div>
        <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>
          Shift+click to add/remove items
        </div>
        <div style={{ marginTop: 6, marginBottom: 2, fontSize: 12, color: '#94a3b8' }}>Tool</div>
        <div style={btnRow}>
          <button
            style={transformMode === 'translate' ? activeBtn : smallBtn}
            onClick={() => onSetTransformMode('translate')}
          >Move</button>
          <button
            style={transformMode === 'rotate' ? activeBtn : smallBtn}
            onClick={() => onSetTransformMode('rotate')}
          >Rotate</button>
        </div>
        <div style={btnRow}>
          <button style={dangerBtn} onClick={onDeleteSelected}>Delete all</button>
        </div>
      </div>
    )
  }

  if (!item) return null

  const update = (field, value) => onUpdate(item.id, { [field]: value })

  return (
    <div style={panelStyle}>
      <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 14 }}>
        {item.label}
      </div>

      {/* Dimensions — parametric only */}
      {item.type === 'parametric' && (
        <>
          <label style={labelStyle}>
            Width
            <input
              type="number"
              step="0.05"
              min="0.1"
              value={item.width}
              style={inputStyle}
              onChange={e => update('width', Math.max(0.1, +e.target.value))}
            /> m
          </label>
          <label style={labelStyle}>
            Height
            <input
              type="number"
              step="0.05"
              min="0.1"
              value={item.height}
              style={inputStyle}
              onChange={e => update('height', Math.max(0.1, +e.target.value))}
            /> m
          </label>
          <label style={labelStyle}>
            Depth
            <input
              type="number"
              step="0.05"
              min="0.1"
              value={item.depth}
              style={inputStyle}
              onChange={e => update('depth', Math.max(0.1, +e.target.value))}
            /> m
          </label>
          <label style={labelStyle}>
            Color
            <input
              type="color"
              value={item.color}
              style={colorInputStyle}
              onChange={e => update('color', e.target.value)}
            />
          </label>
        </>
      )}

      {/* Scale — model only */}
      {item.type === 'model' && (
        <label style={labelStyle}>
          Scale
          <input
            type="number"
            step="0.1"
            min="0.1"
            max="10"
            value={item.scale}
            style={inputStyle}
            onChange={e => update('scale', Math.max(0.1, +e.target.value))}
          />
        </label>
      )}

      {/* Floor toggle */}
      <label style={labelStyle}>
        Floor
        <select
          value={item.floor}
          style={{ ...inputStyle, width: 100 }}
          onChange={e => update('floor', e.target.value)}
        >
          <option value="ground">Ground</option>
          <option value="mezzanine">Mezzanine</option>
        </select>
      </label>

      {/* Rotation */}
      <div style={{ marginTop: 6, marginBottom: 2, fontSize: 12, color: '#94a3b8' }}>Rotation</div>
      <div style={btnRow}>
        {[0, 90, 180, 270].map(deg => (
          <button
            key={deg}
            style={Math.round(item.rotation * 180 / Math.PI) % 360 === deg ? activeBtn : smallBtn}
            onClick={() => update('rotation', deg * Math.PI / 180)}
          >
            {deg}°
          </button>
        ))}
      </div>

      {/* Transform mode */}
      <div style={{ marginTop: 10, marginBottom: 2, fontSize: 12, color: '#94a3b8' }}>Tool</div>
      <div style={btnRow}>
        <button
          style={transformMode === 'translate' ? activeBtn : smallBtn}
          onClick={() => onSetTransformMode('translate')}
        >
          Move
        </button>
        <button
          style={transformMode === 'rotate' ? activeBtn : smallBtn}
          onClick={() => onSetTransformMode('rotate')}
        >
          Rotate
        </button>
      </div>

      {/* Actions */}
      <div style={btnRow}>
        <button style={smallBtn} onClick={() => onDuplicate(item.id)}>Duplicate</button>
        <button style={dangerBtn} onClick={() => onDelete(item.id)}>Delete</button>
      </div>
    </div>
  )
}
