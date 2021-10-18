import React, { useState } from 'react'
import Layout from '../../Shared/Layout'
import PageTitle from '../../Shared/Navigation/PageTitle'
import NoContent from '../../Shared/Elements/NoContent'
import { convertMinuteDecimalToHoursAndMinutes } from '../../Helpers/date.helpers'
import { format } from 'date-fns'
import Pagination from '../../Shared/Elements/Pagination'
import { Inertia } from '@inertiajs/inertia'

const EmptyData = () => {
  return (
    <>
      <i className="material-icons md-48">airplane_landing</i>
      <div>There are no pirep entries</div>
    </>
  )
}

const Pireps = ({ pireps }) => {
  const [pirepId, setPirepId] = useState('')
  function loadPirep (pirep) {
    Inertia.get(`/logbook/${pirep.id}`)
  }

  const renderPirepState = (state) => {
    switch (state) {
      case 1:
        return 'Dispatch'
      case 2:
        return 'In Progress'
      case 3:
        return 'Accepted'
      case 4:
        return 'Rejected'
    }
  }

  function handleChange (e) {
    setPirepId(e.target.value)
  }

  function handleSearch () {
    if (pirepId !== '') Inertia.get(`/logbook/${pirepId}`)
  }

  return (
    <div>
      <PageTitle title="Pireps" />
      <div className="bg-white rounded shadow overflow-x-auto">
        {pireps.length === 0
          ? <NoContent content={<EmptyData />} />
          : (
            <div className="my-2">
              <div className="inline-block mx-2">
                <label htmlFor="pirep"><span className="text-gray-700">Pirep Id</span></label>
                <input id="pirep" type="text" placeholder="Find pirep" className="form-input form" value={pirepId} onChange={handleChange} />
              </div>
              <div className="inline-block mx-2">
                <button onClick={() => handleSearch()} className="btn btn-secondary">Go</button>
              </div>
              <table className="table table-auto">
                <thead>
                <tr>
                  <th></th>
                  <th>Departure</th>
                  <th>Arrival</th>
                  <th>Aircraft</th>
                  <th>Pilot</th>
                  <th>State</th>
                  <th>Date</th>
                </tr>
                </thead>
                <tbody>
                {pireps.data.map((entry) => (
                  <tr key={entry.id}>
                    <td className="text-orange-500 hover:underline" onClick={() => loadPirep(entry)}>View Details</td>
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
                    <td>
                      <span>{entry.pilot.pilot_id}</span><br/>
                      <span className="text-xs">{entry.pilot.private_name}</span>
                    </td>
                    <td>
                      {renderPirepState(entry.state)}
                    </td>
                    <td>{format(new Date(entry.submitted_at), 'dd LLL yyyy')}</td>
                  </tr>
                ))}
                </tbody>
              </table>
              <Pagination pages={pireps} />
            </div>
            )
        }
      </div>
    </div>
  )
}

Pireps.layout = page => <Layout children={page} title="Admin - Pireps" />

export default Pireps
