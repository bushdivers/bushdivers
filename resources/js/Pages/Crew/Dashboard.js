import React from 'react'
import Layout from '../../Shared/Layout'
import PageTitle from '../../Shared/Navigation/PageTitle'
import dayjs, { convertMinuteDecimalToHoursAndMinutes } from '../../Helpers/date.helpers'
import PilotStats from '../../Shared/Components/Crew/PilotStats'
import { Link } from '@inertiajs/inertia-react'
import CrewMap from '../../Shared/Components/Crew/CrewMap'

const Dashboard = ({ lastFlight, rank, nextRank, awards, user, locations }) => {
  return (
    <div>
      <PageTitle title="Crew Page" />
      <div className="mt-4 flex justify-between">
        <div className="flex justify-start items-center">
          <img width="75" src={rank.image}/>
          <span className="ml-4">{user.pilot_id} {user.private_name} - {rank.name}</span>
        </div>
        <div className="flex justify-end items-center">
          <span className="mr-4">Joined {dayjs(user.created_at).fromNow()}</span>
          <span>Last flight {lastFlight ? dayjs(lastFlight.submitted_at).fromNow() : 'No flight recorded'}</span>
          </div>
      </div>
      <div className="flex justify-between mt-4">
        <div className="w-1/2">
          <PilotStats
            flights={user.flights}
            hours={user.flights_time}
            location={user.current_airport_id}
            balance={user.account_balance}
            awards={awards && awards.length > 0 ? awards.length : 0}
            points={user.points}
          />
          <div className="flex">
            <div className="rounded shadow p-4 mt-4 mr-2 bg-white w-1/2">
              <div className="text-lg flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <i className="material-icons mr-2 md-36">flight_land</i> Last Flight
                </div>
                {lastFlight && <span className="ml-2"><Link href={`/logbook/${lastFlight.id}`}>{lastFlight.flight.full_flight_number}</Link></span>}
              </div>
              {lastFlight && (
                <>
                  <div>{lastFlight.flight.dep_airport.name} {lastFlight.flight.dep_airport_id} - {lastFlight.flight.arr_airport.name} {lastFlight.flight.arr_airport_id}</div>
                  <div className="text-sm">
                    {dayjs(lastFlight.submitted_at).fromNow()} - {dayjs(lastFlight.submitted_at).format('ddd DD MMM YYYY')}
                  </div>
                  <div className="mt-2 text-sm flex items-center">
                    <i className="material-icons md-18">local_airport</i>
                    {lastFlight.aircraft.fleet.type} - {lastFlight.aircraft.registration}
                  </div>
                </>
              )}
            </div>
            <div className="rounded shadow p-4 mt-4 ml-2 bg-white w-1/2">
              <div className="text-lg flex items-center justify-between">
                <div className="flex items-center">
                  <i className="material-icons mr-2 md-36">military_tech</i> Rank
                </div>
                <div className="ml-2 flex items-center">
                  <img width="60" src={rank.image} /> <span className="ml-2 text-sm">{rank.name}</span></div>
              </div>
              <div className="mt-4">
                <div>Next Rank:</div>
                <div className="flex justify-between">
                  <div className="flex items-center justify-between"><img width="60" src={nextRank.image} /> <span className="ml-2 text-sm">{nextRank.name}</span></div>
                  <div>
                    <span className="text-sm">Hours: {convertMinuteDecimalToHoursAndMinutes((nextRank.hours * 60) - user.flights_time)}</span>
                  </div>
                  <div>
                    <span className="text-sm">Points: {nextRank.points - user.points}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded shadow p-4 mt-4 bg-white">
            <div className="text-lg flex items-center">
              <i className="material-icons mr-2 md-36">emoji_events</i> Awards
            </div>
            <div className="mt-4 flex justify-start">
              {awards && awards.map((award) => (
                <div className="mx-2" key={award.id}>
                  <img height="100" width="100" src={award.image} />
                  <div className="mt-1 text-sm text-center">{award.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-1/2 rounded shadow p-4 mt-2 bg-white mx-2">
          <CrewMap size="large" locations={locations && locations.length > 0 ? locations : []} />
        </div>
      </div>
    </div>
  )
}

Dashboard.layout = page => <Layout children={page} title="Crew Page" />

export default Dashboard
