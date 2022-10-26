import React from 'react'

export default function Tooltip ({ direction, content, children }) {
  return (
    <div className={`tooltip tooltip-${direction} tooltip-secondary`} data-tip={content}>
      {children}
    </div>
  )
}
