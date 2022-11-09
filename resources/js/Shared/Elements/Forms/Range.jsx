import React from 'react'

const Range = ({ id, value, onChange, label, error, min, max, step, children }) => {
  return (
    <>
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input id={id} type="range" min={min} max={max} value={value} onChange={onChange} className="range" step={step} />
      <div className="w-full flex justify-between text-xs px-2">
        {children}
      </div>
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </>
  )
}

export default Range
