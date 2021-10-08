import React from 'react'
import { convertMinuteDecimalToHoursAndMinutes } from '../../Helpers/date.helpers'

const LogbookSecondary = ({ pirep }) => {
  return (
    <div className="rounded shadow p-4 mt-2 bg-white mx-2">
      <div className="flex justify-between items-center">
        <div className="flex flex-col items-center my-2 mx-4">
          <div className="text-sm">Fuel used</div>
          <div className="text-xl">{pirep.fuel_used} gal</div>
        </div>
        <div className="flex flex-col items-center my-2 mx-4">
          <div className="text-sm">Duration</div>
          <div className="text-xl">{convertMinuteDecimalToHoursAndMinutes(pirep.flight_time)}</div>
        </div>
        <div className="flex flex-col items-center my-2 mx-4">
          <div className="text-sm">Distance</div>
          <div className="text-xl">{pirep.distance}nm</div>
        </div>
        <div className="flex flex-col items-center my-2 mx-4">
          <div className="text-sm">Points</div>
          <div className="text-xl">{pirep.score}</div>
        </div>
      </div>
    </div>
  )
}

export default LogbookSecondary
