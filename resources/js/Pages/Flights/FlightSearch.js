import React, { useState } from 'react'
import Layout from '../../Shared/Layout'
import PageTitle from '../../Shared/Navigation/PageTitle'
import NoContent from '../../Shared/Elements/NoContent'
import Tooltip from '../../Shared/Elements/Tooltip'
import FlightModal from '../../Shared/Components/Flights/FlightModal'
import SearchInput from '../../Shared/Components/Flights/SearchInput'
import { Inertia } from '@inertiajs/inertia'
import { Link } from '@inertiajs/inertia-react'

const EmptyData = () => {
  return (
    <>
      <i className="material-icons md-48">airplane_ticket</i>
      <div>There are no flights</div>
    </>
  )
}

const FlightSearch = ({ flights, bookings }) => {
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedFlight, setSelectedFlight] = useState({})

  function toggleDetailModal () {
    setShowDetailModal(!showDetailModal)
  }

  function updateSelectedFlight (flight) {
    setSelectedFlight(flight)
    toggleDetailModal()
  }

  function bookFlight (flight) {
    Inertia.post(`/bookings/create/${flight.id}`)
  }

  function cancelBooking (flight) {
    Inertia.delete(`/bookings/cancel/${flight.id}`)
  }

  return (
    <div>
      <PageTitle title="Flight Search" />
      <SearchInput />
      <p className="text-sm mb-1">{flights.length > 0 && <span>Total results: {flights.length} </span> } </p>
      <div className="bg-white rounded shadow overflow-x-auto">
        {flights.length === 0
          ? <NoContent content={<EmptyData />} />
          : (
            <div>
              <table className="table table-auto">
                <thead>
                <tr>
                  <th>Flight</th>
                  <th>Departure</th>
                  <th>Arrival</th>
                  <th>Distance</th>
                  <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {flights.map((flight) => (
                  <tr key={flight.id}>
                    <td className="hover:underline hover:text-orange-500" onClick={() => updateSelectedFlight(flight)}>BDV{flight.flight_number}</td>
                    <td>
                      <Link href={`/airports/${flight.dep_airport_id}`}>{flight.dep_airport_id}</Link><br/>
                      <span className="text-xs">{flight.dep_airport.name}</span>
                    </td>
                    <td>
                      <Link href={`/airports/${flight.dep_airport_id}`}>{flight.arr_airport_id}</Link><br/>
                      <span className="text-xs">{flight.arr_airport.name}</span>
                    </td>
                    <td>{flight.distance}</td>
                    <td>
                      {bookings.find(f => f.flight_id === flight.id) === undefined
                        ? (
                        <Tooltip content="Book flight" direction="top">
                          <button onClick={() => bookFlight(flight)} className="btn btn-secondary flex items-center">
                            <i className="material-icons">airplane_ticket</i>
                          </button>
                        </Tooltip>
                          )
                        : (
                          <Tooltip content="Cancel flight booking" direction="top">
                            <button onClick={() => cancelBooking(flight)} className="btn btn-light flex items-center">
                              <i className="material-icons">close</i>
                            </button>
                          </Tooltip>
                          )
                      }

                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
            )
        }
      </div>
      {<FlightModal show={showDetailModal} flight={selectedFlight} onClose={toggleDetailModal} />}
    </div>
  )
}

FlightSearch.layout = page => <Layout children={page} title="Flight Search" />

export default FlightSearch
