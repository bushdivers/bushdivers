import React from 'react'
import { format } from 'date-fns'
import { convertMinuteDecimalToHoursAndMinutes } from '../../Helpers/date.helpers'
import { Link } from '@inertiajs/inertia-react'

const LogbookPrimary = ({ pirep }) => {
  return (
    <div className="rounded shadow p-4 mt-2 bg-white mx-2">
      <div className="flex justify-between items-center">
        <div className="flex flex-col items-center my-2 mx-4">
          <div className="text-sm"><i className="material-icons">flight_takeoff</i></div>
          <div className="text-xl"><Link href={`/airports/${pirep.flight.dep_airport_id}`}>{pirep.flight.dep_airport_id}</Link></div>
          <div className="text-sm">{pirep.flight.dep_airport.name}</div>
          <div className="text-xs">{format(new Date(pirep.block_off_time), 'kk:mm')}</div>
        </div>
        <div className="flex flex-col items-center my-2 mx-4">
          <div className="text-sm"><i className="material-icons">flight_land</i></div>
          <div className="text-xl"><Link href={`/airports/${pirep.flight.arr_airport_id}`}>{pirep.flight.arr_airport_id}</Link></div>
          <div className="text-sm">{pirep.flight.arr_airport.name}</div>
          <div className="text-xs">{format(new Date(pirep.block_on_time), 'kk:mm')}</div>
        </div>
        <div className="flex flex-col items-center my-2 mx-4">
          <div className="text-sm">{pirep.aircraft.fleet.manufacturer} {pirep.aircraft.fleet.name}</div>
          <div className="text-xl">{pirep.aircraft.registration} ({pirep.aircraft.fleet.type})</div>
        </div>
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
      </div>
    </div>
  )
}

export default LogbookPrimary
