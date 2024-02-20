import React from 'react'

const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full bg-gray-200 rounded h-2.5">
      <div className="bg-orange-500 h-2.5 rounded" style={{ width: progress + '%' }}></div>
    </div>
  )
}

export default ProgressBar
