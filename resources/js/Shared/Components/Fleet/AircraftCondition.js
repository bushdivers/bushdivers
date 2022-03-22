import React from 'react'

const AircraftCondition = ({ aircraftCondition }) => {
  const conditionStyle = (condition) => {
    return {
      width: condition + '%'
    }
  }

  const conditionColour = (condition) => {
    if (condition >= 75) return 'bg-green-500'
    if (condition < 75 && condition >= 50) return 'bg-yellow-500'
    if (condition < 50 && condition > 30) return 'bg-orange-500'
    if (condition <= 30) return 'bg-red-500'
  }

  return (
    <div className="flex justify-between items-center space-x-2">
      <div className="w-full bg-gray-200 rounded h-2.5">
        <div className={`${conditionColour(aircraftCondition)} h-2.5 rounded`} style={conditionStyle(aircraftCondition)}></div>
      </div>
      <div className="text-sm font-medium text-gray-800">{aircraftCondition}%</div>
    </div>
  )
}

export default AircraftCondition
