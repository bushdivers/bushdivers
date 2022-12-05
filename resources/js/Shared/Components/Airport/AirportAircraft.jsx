import React from 'react'
import { Link, usePage } from '@inertiajs/inertia-react'
import Card from '../../Elements/Card'
import Badge from '../../Elements/Badge'

const AirportAircraft = ({ aircraft }) => {
  const { auth } = usePage().props
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

  return (
    <Card title="Available Aircraft">
      <table className="table table-compact w-full overflow-x-auto">
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
        {aircraft && aircraft.map((ac) => (
          <tr key={ac.id}>
            <td><Link href={`/aircraft/${ac.id}`}>{ac.registration}</Link> {ac.owner_id === auth.user.id && <Badge color="primary" label="Private" />}</td>
            <td>{ac.fleet.manufacturer} {ac.fleet.name} ({ac.fleet.type})</td>
            <td>{ac.hub_id}</td>
            <td>{ac.fuel_onboard.toLocaleString(navigator.language)}</td>
            <td>{renderAircraftStatus(ac.state)}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </Card>
  )
}

export default AirportAircraft
