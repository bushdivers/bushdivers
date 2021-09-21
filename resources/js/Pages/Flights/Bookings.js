import React, { useEffect, useState } from 'react'
import Layout from '../../Shared/Layout'
import PageTitle from '../../Shared/Navigation/PageTitle'
import NoContent from '../../Shared/Elements/NoContent'
import Tooltip from '../../Shared/Elements/Tooltip'
import { Inertia } from '@inertiajs/inertia'
import { Link } from '@inertiajs/inertia-react'
import dayjs from '../../Helpers/date.helpers'

const EmptyData = () => {
  return (
    <>
      <i className="material-icons md-48">airplane_ticket</i>
      <div>There are no bids</div>
    </>
  )
}

const AirportToolTip = (props) => {
  return (
    <>
      <div>Altitude: {props.airport.altitude}ft</div>
      <div>Longest Runway: {props.airport.longest_runway_surface} - {props.airport.longest_runway_length}ft x {props.airport.longest_runway_width}ft</div>
    </>
  )
}

const Bookings = ({ bookings }) => {
  const [selectedContract, setSelectedContract] = useState({})
  function cancelBooking (id) {
    Inertia.delete(`/bookings/cancel/${id}`)
  }

  return (
    <div>
      <PageTitle title="My Contracts" />
          <div className="bg-white rounded shadow overflow-x-auto">
            {bookings.length === 0
              ? <NoContent content={<EmptyData />} />
              : (
                <div>
                  <table className="table table-auto">
                    <thead>
                    <tr>
                      <th>Contract</th>
                      <th>Departure</th>
                      <th>Current</th>
                      <th>Arrival</th>
                      <th>Distance</th>
                      <th>Heading</th>
                      <th>Type</th>
                      <th>Cargo</th>
                      <th>Pay</th>
                      <th>Expires</th>
                      <td>Actions</td>
                    </tr>
                    </thead>
                    <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>{booking.contract.id}</td>
                        <td>
                          <Tooltip content={<AirportToolTip airport={booking.contract.dep_airport} />} direction="top">
                            <Link href={`/airports/${booking.contract.dep_airport_id}`}>{booking.contract.dep_airport_id}</Link><br/>
                            <span className="text-xs">{booking.contract.dep_airport.name}</span>
                          </Tooltip>
                        </td>
                        <td>
                          <Tooltip content={<AirportToolTip airport={booking.contract.current_airport} />} direction="top">
                            <Link href={`/airports/${booking.contract.current_airport_id}`}>{booking.contract.current_airport_id}</Link><br/>
                            <span className="text-xs">{booking.contract.current_airport.name}</span>
                          </Tooltip>
                        </td>
                        <td>
                          <Tooltip content={<AirportToolTip airport={booking.contract.arr_airport} />} direction="top">
                            <Link href={`/airports/${booking.contract.arr_airport_id}`}>{booking.contract.arr_airport_id}</Link><br/>
                            <span className="text-xs">{booking.contract.arr_airport.name}</span>
                          </Tooltip>
                        </td>
                        <td>{booking.contract.distance}</td>
                        <td>{booking.contract.heading}</td>
                        <td>{booking.contract.contract_type_id === 1 ? 'Cargo' : 'Passenger'}</td>
                        <td>
                          {booking.contract.contract_type_id === 1
                            ? <div><span>{booking.bid_qty} kg</span><br /><span className="text-xs">{booking.contract.cargo}</span></div>
                            : <div><span>{booking.bid_qty}</span><br /><span className="text-xs">{booking.contract.pax}</span></div>
                          }
                        </td>
                        <td>${booking.contract.contract_value.toLocaleString()}</td>
                        <td>
                          <Tooltip content={dayjs(booking.contract.expires_at).format('HH:mm a')} direction="top">
                            {dayjs(booking.contract.expires_at).format('DD/MM/YYYY')}
                          </Tooltip>
                        </td>
                        <td>
                          <Tooltip content="Cancel contract bid" direction="top">
                            <button onClick={() => cancelBooking(booking.id)} className="btn btn-secondary flex items-center">
                              <i className="material-icons md-18">close</i>
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
    </div>
  )
}

Bookings.layout = page => <Layout children={page} title="My Bookings" />

export default Bookings
