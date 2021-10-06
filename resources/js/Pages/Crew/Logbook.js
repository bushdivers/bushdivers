import React from 'react'
import PageTitle from '../../Shared/Navigation/PageTitle'
import Layout from '../../Shared/Layout'
import NoContent from '../../Shared/Elements/NoContent'
import { Link } from '@inertiajs/inertia-react'
// import Tooltip from '../../Shared/Elements/Tooltip'
import { convertMinuteDecimalToHoursAndMinutes } from '../../Helpers/date.helpers'
import { format } from 'date-fns'
import { Inertia } from '@inertiajs/inertia'

const EmptyData = () => {
  return (
    <>
      <i className="material-icons md-48">airplane_landing</i>
      <div>There are no logbook entries</div>
    </>
  )
}

const Logbook = ({ logbook }) => {

  function loadPirep (pirep) {
    Inertia.get(`/logbook/${pirep.id}`)
  }

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
                  <th>Departure</th>
                  <th>Arrival</th>
                  <th>Aircraft</th>
                  <th>Time</th>
                  <th>Distance</th>
                  <th>Points</th>
                  <th>Date</th>
                </tr>
                </thead>
                <tbody>
                {logbook.map((entry) => (
                  <tr key={entry.id} onClick={() => loadPirep(entry)}>
                    <td>
                      {entry.departure_airport_id}<br/>
                      <span className="text-xs">{entry.dep_airport.name}</span>
                    </td>
                    <td>
                     {entry.destination_airport_id}<br/>
                      <span className="text-xs">{entry.arr_airport.name}</span>
                    </td>
                    <td>
                      <span>{entry.aircraft.registration} ({entry.aircraft.fleet.type})</span><br/>
                      <span className="text-xs">{entry.aircraft.fleet.manufacturer} {entry.aircraft.fleet.name}</span>
                    </td>
                    <td>{convertMinuteDecimalToHoursAndMinutes(entry.flight_time)}</td>
                    <td>{entry.distance}nm</td>
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
