import React from 'react'

const Label = ({ labelText, isRequired, helpText, relatedInput }) => {
  return (
    <label htmlFor={relatedInput} className="block">
      <span className="text-gray-700">{labelText}</span>
      {isRequired ? <span className="text-red-500 ml-1">*</span> : <></>}
      {helpText && <span className="text-gray-700 italic text-sm ml-2">{helpText}</span>}
    </label>
  )
}

export default Label
