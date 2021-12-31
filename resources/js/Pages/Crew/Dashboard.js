import React from 'react'
import Layout from '../../Shared/Layout'
// import PageTitle from '../../Shared/Navigation/PageTitle'
import dayjs, { convertMinuteDecimalToHoursAndMinutes } from '../../Helpers/date.helpers'
import PilotStats from '../../Shared/Components/Crew/PilotStats'
import { Link } from '@inertiajs/inertia-react'
import CrewMap from '../../Shared/Components/Crew/CrewMap'
import AppLayout from '../../Shared/AppLayout'

const Dashboard = ({ lastFlight, rank, nextRank, awards, user, locations, balance }) => {
  return (
    <div className="relative">
      <CrewMap size="full" locations={locations && locations.length > 0 ? locations : []} />
      <div className="absolute z-30 bg-gray-800 w-1/3 text-white opacity-80 h-auto top-4 left-4 p-4 rounded shadow">
        <div>
          <div className="text-lg flex flex-col md:flex-row items-center justify-between mb-2">
            <div className="flex items-center">
              <i className="material-icons mr-2 md-36">flight_land</i> Last Flight
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
                <i className="material-icons md-18">local_airport</i>
                {lastFlight.aircraft.fleet.type} - {lastFlight.aircraft.registration}
              </div>
            </>
          )}
        </div>
        <div className="mt-4 flex flex-col md:flex-row">
          <div className="flex flex-col p-2 m-2 w-full md:w-1/3">
            <div className="text-2xl text-white font-bold">
              {user.flights}
            </div>
            <div className="text-gray-300">
              Flights
            </div>
          </div>
          <div className="flex flex-col p-2 m-2 w-1/3">
            <div className="text-2xl text-white font-bold">
              {user.flights_time}
            </div>
            <div className="text-gray-300">
              Hours
            </div>
          </div>
          <div className="flex flex-col p-2 m-2 w-1/3">
            <div className="text-2xl text-white font-bold">
              {user.points}
            </div>
            <div className="text-gray-300">
              Points
            </div>
          </div>
        </div>
        {/*<PilotStats*/}
        {/*  flights={user.flights}*/}
        {/*  hours={user.flights_time}*/}
        {/*  location={user.current_airport_id}*/}
        {/*  balance={balance}*/}
        {/*  awards={awards && awards.length > 0 ? awards.length : 0}*/}
        {/*  points={user.points}*/}
        {/*/>*/}
      </div>
    </div>
  )
}

Dashboard.layout = page => <AppLayout children={page} title="Crew Page" heading="My Crew Page" />

export default Dashboard
