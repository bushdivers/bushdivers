import React from 'react'
import Card from '../../Elements/Card'

const Points = (props) => {
  return (
    <div className="mt-2 mx-2">
      <Card title="Points Awarded">
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
      </Card>
    </div>
  )
}

export default Points
