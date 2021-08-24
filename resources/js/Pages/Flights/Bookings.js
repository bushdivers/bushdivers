import React, { useEffect, useState } from 'react'
import Layout from '../../Shared/Layout'
import PageTitle from '../../Shared/Navigation/PageTitle'
import NoContent from '../../Shared/Elements/NoContent'
import Tooltip from '../../Shared/Elements/Tooltip'
import { Inertia } from '@inertiajs/inertia'
import DispatchModal from '../../Shared/Components/Flights/DispatchModal'
import { Link } from '@inertiajs/inertia-react'

const EmptyData = () => {
  return (
    <>
      <i className="material-icons md-48">airplane_ticket</i>
      <div>There are no bookings</div>
    </>
  )
}

const Bookings = ({ bookings }) => {
  const [showDispatchModal, setShowDispatchModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(0)
  const [selectedFlight, setSelectedFlight] = useState({})

  function updateSelectedBooking (booking, flight) {
    setSelectedBooking(booking)
    setSelectedFlight(flight)
    toggleDispatchModal()
  }

  function toggleDispatchModal () {
    setShowDispatchModal(!showDispatchModal)
  }

  function cancelBooking (flight) {
    Inertia.delete(`/bookings/cancel/${flight.id}`)
  }

  return (
    <div>
      <PageTitle title="My Bookings" />
      <div className="bg-white rounded shadow overflow-x-auto">
      {bookings.length === 0
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
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>BDV{booking.flight.flight_number}</td>
                  <td>
                    {booking.flight.dep_airport_id}<br/>
                    <span className="text-xs">{booking.flight.dep_airport.name}</span>
                  </td>
                  <td>
                    {booking.flight.arr_airport_id}<br/>
                    <span className="text-xs">{booking.flight.arr_airport.name}</span>
                  </td>
                  <td>{booking.flight.distance}</td>
                  <td>
                    {booking.has_dispatch === ''
                      ? (
                        <span className="mr-2">
                            <Tooltip content="Create flight dispatch" direction="top">
                              <button onClick={() => updateSelectedBooking(booking.id, booking.flight)} className="btn btn-secondary flex items-center">
                                <i className="material-icons">post_add</i>
                              </button>
                            </Tooltip>
                        </span>
                        )
                      : (
                        <span className="mr-2">
                          <Tooltip content="View pilot briefing" direction="top">
                            <Link href={`/dispatch/${booking.has_dispatch}`} className="btn btn-secondary flex items-center">
                              <i className="material-icons">travel_explore</i>
                            </Link>
                          </Tooltip>
                        </span>
                        )
                    }

                    <Tooltip content="Cancel flight booking" direction="top">
                      <button onClick={() => cancelBooking(booking.flight)} className="btn btn-light flex items-center">
                        <i className="material-icons">close</i>
                      </button>
                    </Tooltip>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
          )
      }
      </div>
       <DispatchModal show={showDispatchModal} booking={selectedBooking} flight={selectedFlight} onClose={toggleDispatchModal} />
    </div>
  )
}

Bookings.layout = page => <Layout children={page} title="My Bookings" />

export default Bookings
