import React, { useState } from 'react'

export default function Tooltip (props) {
  let timeout
  const [active, setActive] = useState(false)

  const showTip = () => {
    timeout = setTimeout(() => {
      setActive(true)
    }, 400)
  }

  const hideTip = () => {
    clearInterval(timeout)
    setActive(false)
  }

  return (
    <div
      className="inline-block relative"
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
    >
      {props.children}
      {active && (
        <div className={`tooltip ${props.direction || 'top'}`}>
          {props.content}
        </div>
      )}
    </div>
  )
}
