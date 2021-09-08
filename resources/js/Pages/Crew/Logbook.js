import React from 'react'
import PageTitle from '../../Shared/Navigation/PageTitle'
import Layout from '../../Shared/Layout'
import NoContent from '../../Shared/Elements/NoContent'
import { Link } from '@inertiajs/inertia-react'
import Tooltip from '../../Shared/Elements/Tooltip'
import { convertMinuteDecimalToHoursAndMinutes } from '../../Helpers/date.helpers'
import { format } from 'date-fns'

const EmptyData = () => {
  return (
    <>
      <i className="material-icons md-48">airplane_landing</i>
      <div>There are no logbook entries</div>
    </>
  )
}

const Logbook = ({ logbook }) => {
  return (
    <div>
      <PageTitle title="Logbook" />
      <p className="text-sm mb-1">{logbook.length > 0 && <span>Total pireps: {logbook.length} </span> } </p>
      <div className="bg-white rounded shadow overflow-x-auto">
        {logbook.length === 0
          ? <NoContent content={<EmptyData />} />
          : (
            <div>
              <table className="table table-auto">
                <thead>
                <tr>
                  <th>Flight</th>
                  <th>Departure</th>
                  <th>Arrival</th>
                  <th>Aircraft</th>
                  <th>Cargo</th>
                  <th>Time</th>
                  <th>Distance</th>
                  <th>Landing Rate</th>
                  <th>Points</th>
                  <th>Date</th>
                </tr>
                </thead>
                <tbody>
                {logbook.map((entry) => (
                  <tr key={entry.id}>
                    <td className="hover:underline hover:text-orange-500">
                      <Link href={`/logbook/${entry.id}`}>{entry.flight.full_flight_number}</Link>
                    </td>
                    <td>
                      <Link href={`/airports/${entry.flight.dep_airport_id}`}>{entry.flight.dep_airport_id}</Link><br/>
                      <span className="text-xs">{entry.flight.dep_airport.name}</span>
                    </td>
                    <td>
                      <Link href={`/airports/${entry.flight.dep_airport_id}`}>{entry.flight.arr_airport_id}</Link><br/>
                      <span className="text-xs">{entry.flight.arr_airport.name}</span>
                    </td>
                    <td>
                      <span>{entry.aircraft.registration} ({entry.aircraft.fleet.type})</span><br/>
                      <span className="text-xs">{entry.aircraft.fleet.manufacturer} {entry.aircraft.fleet.name}</span>
                    </td>
                    <td>
                      {entry.pax > 0 &&
                        <><span className="flex items-center text-sm"><i className="material-icons md-18 mr-2">group</i> {entry.pax} {entry.pax_name}</span></>
                      }
                      <span className="flex items-center text-sm"><i className="material-icons md-18 mr-2">inventory</i> {entry.cargo}kg {entry.cargo_name}</span>
                    </td>
                    <td>{convertMinuteDecimalToHoursAndMinutes(entry.flight_time)}</td>
                    <td>{entry.distance}</td>
                    <td>{entry.landing_rate}</td>
                    <td>{entry.score}</td>
                    <td>{format(new Date(entry.submitted_at), 'dd LLL yyyy')}</td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          )
        }
      </div>
    </div>
  )
}

Logbook.layout = page => <Layout children={page} title="Logbook" />

export default Logbook
