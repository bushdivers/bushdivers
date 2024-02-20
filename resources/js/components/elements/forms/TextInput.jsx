import React from 'react'

const TextInput = ({ label, value, onChange, error, type, id, placeHolder, inline }) => {
  return (
    <div className={`form-control ${!inline ? 'w-full' : ''}`}>
      {!inline && <label className="label">
        <span className="label-text">{label}</span>
      </label>}
      <input id={id} value={value} onChange={onChange} type={type} placeholder={placeHolder} className="input input-bordered w-full" />
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  )
}

export default TextInput
