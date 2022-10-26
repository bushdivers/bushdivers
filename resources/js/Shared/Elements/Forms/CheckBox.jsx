import React from 'react'

const CheckBox = ({ id, value, onChange, label, error }) => {
  return (
    <div>
      <label className="inline-flex items-center">
        <input id={id} checked={value} onChange={onChange} type="checkbox" className="form-checkbox rounded border-gray-300 text-orange-500 shadow-sm focus:border-orange-300 focus:ring focus:ring-offset-0 focus:ring-orange-200 focus:ring-opacity-50" />
        {label && <span className="text-gray-700 ml-2">{label}</span>}
      </label>
      {error && <div className="text-sm text-red-500">{error}</div>}
    </div>
  )
}

export default CheckBox
