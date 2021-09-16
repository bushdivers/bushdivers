import React from 'react'

const StatCard = (props) => {
  return (
    <div className="rounded shadow bg-white p-4 mr-2 text-center">
      <div className="text-2xl">{props.stat}</div>
      <div className="text-sm">{props.title}</div>
    </div>
  )
}

export default StatCard
