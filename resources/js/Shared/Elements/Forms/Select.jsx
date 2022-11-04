import React from 'react'

const Select = ({ id, value, onChange, options }) => {
  return (
    <select id={id} value={value} onChange={onChange} className="select select-bordered w-auto">
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.text}</option>
      ))}
    </select>
  )
}

export default Select
