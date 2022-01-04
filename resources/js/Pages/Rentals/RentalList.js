import React, { useState } from 'react'
import { Link } from '@inertiajs/inertia-react'
import { Inertia } from '@inertiajs/inertia'
import AppLayout from '../../Shared/AppLayout'

const RentalList = ({ aircraft, searchedIcao, myRentals }) => {
  const [icao, setIcao] = useState()

  const handleAirportChange = (e) => {
    setIcao(e.target.value)
  }

  const handleRental = (ac) => {
    Inertia.post('/rentals', { aircraft: ac.id })
  }

  const handelCancel = (ac) => {
    if (ac.current_airport_id !== ac.hub_id) {
      const confirm = window.confirm(`Aircraft ${ac.registration} is not at its home location, if you end the rental now you will not get your deposit back. Do you wish to continue?`)
      if (confirm) {
        returnRental(ac)
      }
    } else {
      returnRental(ac)
    }
  }

  const returnRental = (ac) => {
    Inertia.post(`/rentals/end/${ac.id}`)
  }

  return (
    <div className="p-4">
      <div>
        <h2 className="text-xl my-2">My Rentals</h2>
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="table table-auto table-condensed">
            <thead>
            <tr>
              <th>Registration</th>
              <th>Type</th>
              <th>Location</th>
              <th>Home</th>
              <th>Rental Cost (hour)</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {myRentals && myRentals.map((ac) => (
              <tr key={ac.id}>
                <td><Link href={`aircraft/${ac.id}`}>{ac.registration}</Link></td>
                <td>{ac.fleet.manufacturer} {ac.fleet.name} ({ac.fleet.type})</td>
                <td><Link href={`airports/${ac.current_airport_id}`}>{ac.current_airport_id}</Link></td>
                <td><Link href={`airports/${ac.hub_id}`}>{ac.hub_id}</Link></td>
                <td>${ac.fleet.rental_cost}</td>
                <td><span className="text-orange-500" onClick={() => handelCancel(ac)}>End rental</span></td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h2 className="text-xl my-2">Aircraft Available for Rental {searchedIcao && <span> - {searchedIcao}</span>}</h2>
        <div className="w-1/6 mb-2 flex items-center">
          <input id="airport" type="text" placeholder="ICAO" className="form-input form inline-block" value={icao} onChange={handleAirportChange} />
          <Link href={`/rentals/${icao}`} className="ml-2 btn btn-secondary">Go</Link>
        </div>
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="table table-auto table-condensed">
            <thead>
            <tr>
              <th>Registration</th>
              <th>Type</th>
              <th>Location</th>
              <th>Home</th>
              <th>Rental Cost (hour)</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
              {aircraft && aircraft.map((ac) => (
                <tr key={ac.id}>
                  <td><Link href={`aircraft/${ac.id}`}>{ac.registration}</Link></td>
                  <td>{ac.fleet.manufacturer} {ac.fleet.name} ({ac.fleet.type})</td>
                  <td><Link href={`airports/${ac.current_airport_id}`}>{ac.current_airport_id}</Link></td>
                  <td><Link href={`airports/${ac.hub_id}`}>{ac.hub_id}</Link></td>
                  <td>${ac.fleet.rental_cost}</td>
                  <td><span className="text-orange-500" onClick={() => handleRental(ac)}>Rent</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

RentalList.layout = page => <AppLayout children={page} title="Aircraft Rentals" heading="Aircraft Rentals" />

export default RentalList
