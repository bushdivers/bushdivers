import React, { useEffect, useState } from 'react'
import Layout from '../../Shared/Layout'
import PageTitle from '../../Shared/Navigation/PageTitle'
import { Link, usePage } from '@inertiajs/inertia-react'
import axios from 'axios'
import NoContent from '../../Shared/Elements/NoContent'
import Tooltip from '../../Shared/Elements/Tooltip'
import dayjs from '../../Helpers/date.helpers'

const EmptyData = () => {
  return (
    <>
      <i className="material-icons md-48">airplane_ticket</i>
      <div>There are no bids</div>
    </>
  )
}

const Dispatch = ({ bookings, aircraft }) => {
  const { errors } = usePage().props
  const [availableAircraft, setAvailableAircraft] = useState([])
  const [selectedAircraft, setSelectedAircraft] = useState(null)
  const [values, setValues] = useState({
    aircraft: 0,
    fuel: 0,
    contracts: []
  })

  useEffect(async () => {
    const acList = aircraft.map((aircraft) => (<option key={aircraft.id} value={aircraft.id}>{aircraft.fleet.name} ({aircraft.fleet.type}) {aircraft.registration} - Fuel: {aircraft.fuel_onboard} gal</option>))
    setAvailableAircraft(acList)
  }, [])

  function handleFormChange (e) {
    const key = e.target.id
    const value = e.target.value
    setValues(values => ({
      ...values,
      [key]: value
    }))
    if (key === 'aircraft') {
      console.log(aircraft)
      const ac = aircraft.find(a => a.id === parseInt(e.target.value))
      console.log(ac)
      setSelectedAircraft(ac)
    }
  }

  const handleSubmit = () => {
    window.alert('Hello')
  }

  return (
    <div>
      <PageTitle title="Dispatch" />
      <form onSubmit={handleSubmit}>
      <div className="flex justify-between mt-4">
        <div className="w-1/2">
          <div className="shadow rounded p-4 mr-2 bg-white">
            <div className="my-2">
              <label htmlFor="aircraft" className="block"><span className="text-gray-700">Select Aircraft</span></label>
              <select id="aircraft" value={values.aircraft} onChange={handleFormChange} className="form-select form">
                <option>Please select an aircraft</option>
                {availableAircraft}
              </select>
              {errors.aircraft && <div className="text-sm text-red-500">{errors.aircraft}</div>}
            </div>
          </div>
          <div className="shadow rounded p-4 mt-2 mr-2 bg-white">
            {bookings.length === 0
              ? <NoContent content={<EmptyData />} />
              : (
                <div>
                  <table className="table table-auto table-condensed">
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
                    </tr>
                    </thead>
                    <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>{booking.contract.id}</td>
                        <td>{booking.contract.dep_airport_id}</td>
                        <td>{booking.contract.current_airport_id}</td>
                        <td>{booking.contract.arr_airport_id}</td>
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
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
                )
            }
          </div>
          <div className="shadow rounded p-4 mt-2 mr-2 bg-white">
            <div>Fuel</div>
            {selectedAircraft && <div>Current Fuel: {selectedAircraft.fuel_onboard}</div>}
          </div>
        </div>
        <div className="w-1/2">
          <div className="shadow rounded p-4 ml-2 bg-white">
            Summary
          </div>
        </div>
      </div>
      </form>
    </div>
  )
}

Dispatch.layout = page => <Layout children={page} title="Dispatch" />

export default Dispatch
