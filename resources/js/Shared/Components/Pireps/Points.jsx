import React from 'react'

const Points = (props) => {
  return (
    <div className="rounded shadow p-4 mt-2 bg-white mx-2">
      <div className="text-lg">Points Awarded</div>
      {props.points.length > 0 &&
      <div className="flex justify-between items-center">
        {props.points.map((point) => (
          <div key={point.id} className="flex flex-col items-center my-2 mx-4">
            <div className="text-sm">{point.type_name}</div>
            <div className="text-xl">{point.points.toLocaleString(navigator.language)}</div>
          </div>
        ))}
      </div>
      }
    </div>
  )
}

export default Points
