import React, { useState } from 'react'

const ApiKey = ({ apiKey }) => {
  const [show, setShow] = useState(false)

  function showKey () {
    setShow(true)
    navigator.clipboard.writeText(apiKey)
  }

  return (
    <div>
      <div>Bush Tracker Key <span className="text-xs">(click to display key and copy to clipboard)</span></div>
      <div className="cursor-pointer mt-2" onClick={showKey}>{show ? apiKey : '***************'}</div>
    </div>
  )
}

export default ApiKey
