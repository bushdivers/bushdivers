import React from 'react'
import AppLayout from '../../Shared/AppLayout'
import AircraftCondition from '../../Shared/Components/Fleet/AircraftCondition'
import { Link } from '@inertiajs/inertia-react'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Inertia } from '@inertiajs/inertia'
import axios from 'axios'
import { convertMinuteDecimalToHoursAndMinutes } from '../../Helpers/date.helpers'

const MyAircraft = ({ aircraft, rentals, agreements }) => {
  const handleCancel = (agreement) => {
    if (window.confirm(`Cancelling will relinquish ownership and access to ${agreement.aircraft.registration} and will incur a penalty of: $${agreement.monthly_payments}. Do you wish to continue?`)) {
      Inertia.post(`/marketplace/finance/cancel/${agreement.id}`)
    }
  }

  const handleSale = async (ac) => {
    if (ac.is_financed) {
      window.alert(`You cannot sell ${ac.registration} as there is still outstanding finance`)
      return
    }
    const res = await axios.get(`/api/aircraft/price/${ac.id}`)
    if (res.status === 200) {
      if (window.confirm(`Are you sure you want to sell your aircraft ${ac.registration} for $${res.data.price}?`)) {
        Inertia.post(`/marketplace/sell/${ac.id}`)
      }
    }
  }

  return (
    <div className="p-4 flex space-x-4">
      <div className="w-1/2 space-y-4">
        <div className="bg-white rounded shadow px-2 overflow-x-auto">
          <div className="flex justify-between items-baseline mt-2">
            <h1>My Aircraft</h1>
            <Link href="/marketplace"><button className="btn btn-primary btn-small">Go To Marketplace</button></Link>
          </div>
          <table className="table table-auto table-condensed my-2">
            <thead>
            <tr>
              <th>Registration</th>
              <th>Type</th>
              <th>Location</th>
              <th>Home</th>
              <th>Hours</th>
              <th>Condition</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            {aircraft && aircraft.map((ac) => (
              <tr key={ac.id}>
                <td><Link href={`/aircraft/${ac.id}`} className="link">{ac.registration}</Link></td>
                <td>{ac.fleet.type}</td>
                <td>{ac.current_airport_id}</td>
                <td>{ac.hub_id}</td>
                <td>{convertMinuteDecimalToHoursAndMinutes(ac.flight_time_mins)}</td>
                <td><AircraftCondition aircraftCondition={ac.wear} /></td>
                <td><button onClick={() => handleSale(ac)} className="btn btn-small btn-secondary">Sell</button></td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white rounded shadow px-2 overflow-x-auto">
          <div className="flex justify-between items-baseline mt-2">
            <h1>My Rentals</h1>
            <Link href="/rentals"><button className="btn btn-primary btn-small">Go To Rentals</button></Link>
          </div>
          <table className="table table-auto table-condensed my-2">
            <thead>
            <tr>
              <th>Registration</th>
              <th>Type</th>
              <th>Location</th>
              <th>Home</th>
              <th>Rental Cost (hour)</th>
            </tr>
            </thead>
            <tbody>
            {rentals && rentals.map((ac) => (
              <tr key={ac.id}>
                <td>{ac.registration}</td>
                <td>{ac.fleet.type}</td>
                <td>{ac.current_airport_id}</td>
                <td>{ac.hub_id}</td>
                <td>${ac.fleet.rental_cost}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-1/2">
        {agreements.length === 0 && <div className="bg-white rounded shadow p-4 text-center">No Current Finance Agreements</div>}
        {agreements && agreements.map((ag) => (
          <div key={ag.id} className={`p-4 rounded shadow mb-2 ${ag.is_paid || !ag.is_active ? 'bg-gray-200 text-gray-500' : 'bg-white'}`}>
            <div className="flex justify-between items-center">
              <h1>Agreement #{ag.id}</h1>
              {ag.is_paid ? <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" /> : !ag.is_active ? <FontAwesomeIcon icon={faTimesCircle} className="text-red-500"/> : <><button onClick={() => handleCancel(ag)} className="btn btn-secondary btn-small">Cancel</button></>}
            </div>
            <h2>{ag.aircraft.registration}</h2>
            <div className="flex justify-between items-center mt-2">
              <div>
                <span className="text-lg">Deposit</span> <br />
                ${ag.deposit}
              </div>
              <div>
                <span className="text-lg">Total Finance</span> <br />
                ${ag.finance_amount}
              </div>
              <div>
                <span className="text-lg">Length</span> <br/>
                {ag.term_remaining} / {ag.term_months} months
              </div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <div>
                <span className="text-lg">Monthly Repayments</span> <br/>
                ${ag.monthly_payments}
              </div>
              <div>
                <span className="text-lg">Amount Remaining</span> <br />
                ${ag.amount_remaining}
              </div>
              <div>
                <span className="text-lg">Missed Payments</span> <br/>
                {ag.missed_payments}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

MyAircraft.layout = page => <AppLayout children={page} heading="My Aircraft" title="My Aircraft" />

export default MyAircraft
