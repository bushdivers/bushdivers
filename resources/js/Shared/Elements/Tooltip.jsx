import React from 'react'

export default function Tooltip ({ direction, content, children }) {
  console.log(direction)
  return (
    <div className={`tooltip tooltip-${direction} tooltip-secondary`} data-tip={content}>
      {children}
    </div>
  )
}
