import React from 'react'
import dayjs, { convertMinuteDecimalToHoursAndMinutes } from '../../Helpers/date.helpers'
import { Link } from '@inertiajs/inertia-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CrewMap from '../../Shared/Components/Crew/CrewMap'
import AppLayout from '../../Shared/AppLayout'
import StatBlock from '../../Shared/Elements/StatBlock'
import { faPlaneArrival, faPlaneUp } from '@fortawesome/free-solid-svg-icons'

const Dashboard = ({ lastFlight, user, locations, distance }) => {
  console.log(lastFlight)
  return (
    <div className="relative">
      <CrewMap size="full" locations={locations && locations.length > 0 ? locations : []} mapStyle={user.map_style} />
      <div className="absolute z-30 bg-white w-1/2 md:w-1/3 h-auto opacity-90 top-4 left-4 p-4 rounded shadow">
        <div>
          <div className="text-lg flex flex-col md:flex-row items-start md:items-center justify-between mb-2">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faPlaneArrival} className="mr-2 md-36" /> Last Flight
            </div>
            {lastFlight && <span className="ml-2"><Link className="link" href={`/logbook/${lastFlight.id}`}>{dayjs(lastFlight.submitted_at).format('ddd DD MMM YYYY')}</Link></span>}
          </div>
          {lastFlight && (
            <>
              <div>
                <div className="mt-2">
                  <div className="text-lg">{lastFlight.dep_airport.name}</div>
                  <Link className="link" href={`/airports/${lastFlight.departure_airport_id}`}>{lastFlight.departure_airport_id}</Link>
                </div>
                <div className="mt-2">
                  <div className="text-lg">{lastFlight.arr_airport.name}</div>
                  <Link className="link" href={`/airports/${lastFlight.destination_airport_id}`}>{lastFlight.destination_airport_id}</Link>
                </div>
              </div>
              <div className="text-sm">
                {dayjs.utc(lastFlight.submitted_at).fromNow()} - {dayjs(lastFlight.submitted_at).format('ddd DD MMM YYYY')}
              </div>
              <div className="mt-2 text-sm flex items-center">
                <FontAwesomeIcon icon={faPlaneUp} />
                { lastFlight.is_rental
                  ? <span>{lastFlight.rental.fleet.type} - {lastFlight.rental.registration}</span>
                  : <Link className="link ml-2" href={`/aircraft/${lastFlight.aircraft.id}`}>{lastFlight.aircraft.fleet.type} - {lastFlight.aircraft.registration}</Link>
                }
              </div>
            </>
          )}
        </div>
        <div className="mt-4 flex flex-col md:flex-row">
          <StatBlock width="1/4" data={user.flights.toLocaleString(navigator.language)} text="Flights" />
          <StatBlock width="1/4" data={user.flights_time > 0 ? convertMinuteDecimalToHoursAndMinutes(user.flights_time) : 0} text="Hours" />
          <StatBlock width="1/4" data={user.points.toLocaleString(navigator.language)} text="Points" />
          <StatBlock width="1/4" data={distance} text="Distance (nm)" />
        </div>
      </div>
    </div>
  )
}

Dashboard.layout = page => <AppLayout children={page} title="Crew Page" heading="My Crew Page" />

export default Dashboard
