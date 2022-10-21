import React from 'react'

const StatBlock = ({ width, data, text }) => {
  return (
    <div className={`flex flex-col p-2 m-2 w-${width}`}>
      <div className="text-2xl font-bold">
        {data}
      </div>
      <div>
        {text}
      </div>
    </div>
  )
}

export default StatBlock
