import React from 'react'
import AppLayout from '../../Shared/AppLayout'
import { getDistance } from '../../Helpers/general.helpers'

const UsedAircraft = ({ aircraft, currentLocation, fleet }) => {
  return (
    <div className="p-4">
      <h1>{fleet.manufacturer} {fleet.name} - {fleet.type}</h1>
      <div className="rounded bg-white shadow p-4">
        {aircraft && aircraft.map((ac) => (
          <div key={ac.id}>{ac.registration} - {ac.current_airport_id}
            {getDistance(currentLocation.lat, currentLocation.lon, ac.location.lat, ac.location.lon)}nm
          </div>
        ))}
      </div>
    </div>
  )
}

UsedAircraft.layout = page => <AppLayout children={page} title="Marketplace - Used Aircraft" heading="Marketplace - Used Aircraft" />

export default UsedAircraft
