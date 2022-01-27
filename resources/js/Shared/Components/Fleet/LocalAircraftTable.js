import React from 'react'
import { Link } from '@inertiajs/inertia-react'

const renderAircraftStatus = (status) => {
  switch (status) {
    case 1:
      return 'Available'
    case 2:
      return 'Reserved'
    case 3:
      return 'In Use'
  }
}

const LocalAircraftTable = (props) => {
  return (
      <>
    <div className="text-lg">Aircraft at this Airport</div>
    <table className="mt-2 table table-auto table-condensed">
        <thead>
        <tr>
            <th>Registration</th>
            <th>Aircraft</th>
            <th>Hub</th>
            <th>Fuel</th>
            <th>Status</th>
        </tr>
        </thead>
        <tbody>
        {props.aircraftlist && props.aircraftlist.map((ac) => (
            <tr key={ac.id}>
                <td><Link href={`/aircraft/${ac.id}`}>{ac.registration}</Link></td>
                <td>{ac.fleet.manufacturer} {ac.fleet.name} ({ac.fleet.type})</td>
                <td>{ac.hub_id}</td>
                <td>{ac.fuel_onboard.toLocaleString(navigator.language)}</td>
                <td>{renderAircraftStatus(ac.state)}</td>
            </tr>
        ))}
        </tbody>
    </table>
      </>
  )
}

export default LocalAircraftTable
