import React from 'react'

const Uploader = ({ children, value, onChange, disabled, accept}) => {
  return (
    <label htmlFor="uploader">
      <input
        id="uploader"
        value={value}
        accept={accept}
        disabled={disabled}
        style={{ display: 'none' }}
        type="file"
        onChange={disabled ? () => {} : onChange}
      />
      {children}
    </label>
  )
}

export default Uploader
