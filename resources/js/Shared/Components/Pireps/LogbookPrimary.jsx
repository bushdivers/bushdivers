import React from 'react'
import { format } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { convertMinuteDecimalToHoursAndMinutes } from '../../../Helpers/date.helpers'
import { Link } from '@inertiajs/inertia-react'
import { faPlaneDeparture, faPlaneArrival } from '@fortawesome/free-solid-svg-icons'

const LogbookPrimary = ({ pirep }) => {
  return (
    <div className="rounded shadow p-4 mt-2 bg-white mx-2">
      <div className="flex justify-between items-center">
        <div className="flex flex-col items-center my-2 mx-4">
          <div className="text-sm"><FontAwesomeIcon icon={faPlaneDeparture} /></div>
          <div className="text-xl"><Link href={`/airports/${pirep.departure_airport_id}`}>{pirep.departure_airport_id}</Link></div>
          <div className="text-sm">{pirep.dep_airport.name}</div>
          <div className="text-xs">{format(new Date(pirep.block_off_time), 'kk:mm')}</div>
        </div>
        <div className="flex flex-col items-center my-2 mx-4">
          <div className="text-sm"><FontAwesomeIcon icon={faPlaneArrival} /></div>
          <div className="text-xl"><Link href={`/airports/${pirep.destination_airport_id}`}>{pirep.destination_airport_id}</Link></div>
          <div className="text-sm">{pirep.arr_airport.name}</div>
          <div className="text-xs">{format(new Date(pirep.block_on_time), 'kk:mm')}</div>
        </div>
        <div className="flex flex-col items-center my-2 mx-4">
          <div className="text-sm">{pirep.is_rental ? <span>{pirep.rental.fleet.manufacturer} {pirep.rental.fleet.name}</span> : <span>{pirep.aircraft.fleet.manufacturer} {pirep.aircraft.fleet.name}</span>}</div>
          <div className="text-xl">{pirep.is_rental ? <span>{pirep.rental.registration} ({pirep.rental.fleet.type})</span> : <Link href={`/aircraft/${pirep.aircraft.id}`}>{pirep.aircraft.registration} ({pirep.aircraft.fleet.type})</Link>}</div>
        </div>
      </div>
    </div>
  )
}

export default LogbookPrimary
