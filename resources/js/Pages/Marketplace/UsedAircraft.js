import React from 'react'
import AppLayout from '../../Shared/AppLayout'
import { getDistance } from '../../Helpers/general.helpers'
import dayjs from 'dayjs'
import AircraftCondition from '../../Shared/Components/Fleet/AircraftCondition'
import { formatNumber } from 'chart.js/helpers'
import { Inertia } from '@inertiajs/inertia'

const UsedAircraft = ({ aircraft, currentLocation, fleet }) => {
  const handlePurchase = (ac) => {
    Inertia.get(`/marketplace/purchase/used/${ac.id}`)
  }

  return (
    <div className="p-4">
      <h1>{fleet.manufacturer} {fleet.name} - {fleet.type}</h1>
      <div className="rounded bg-white shadow">
        <table className="table-condensed table-auto">
          <thead>
          <tr className="">
            <th>Registration</th>
            <th>Location</th>
            <th>Distance</th>
            <th>Condition</th>
            <th>Airframe</th>
            <th>Last Inspection</th>
            <th>Engines (hrs)</th>
            <th>Price</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
        {aircraft && aircraft.map((ac) => (
          <tr key={ac.id}>
            <td>{ac.registration}</td>
            <td>
              {ac.current_airport_id} <br/>
              <span className="text-sm">{ac.location.name}</span>
            </td>
            <td>{getDistance(currentLocation.lat, currentLocation.lon, ac.location.lat, ac.location.lon)}nm</td>
            <td><AircraftCondition aircraftCondition={ac.total_condition} /></td>
            <td>{(ac.flight_time_mins / 60).toFixed(2)}</td>
            <td>{dayjs(ac.last_inspected_at).format('DD/MM/YYYY')}</td>
            <td>
              {ac.engines.map((e) => (
                <>
                  <span>Until TBO: {((ac.fleet.tbo_mins / 60) - (e.mins_since_tbo / 60)).toFixed(2)}</span><br />
                  <span>Until 100hr {(100 - (e.mins_since_100hr / 60)).toFixed(2)}</span>
                </>
              ))}
            </td>
            <td>${formatNumber(ac.sale_price)}</td>
            <td><button onClick={() => handlePurchase(ac)} className="btn btn-secondary btn-small">Purchase</button></td>
          </tr>
        ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

UsedAircraft.layout = page => <AppLayout children={page} title="Marketplace - Used Aircraft" heading="Marketplace - Used Aircraft" />

export default UsedAircraft
