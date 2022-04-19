import React from 'react'
import { Link, usePage } from '@inertiajs/inertia-react'
import AircraftCondition from './AircraftCondition'
import { faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const FleetCardContent = ({ fleet }) => {
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

  const shouldShowMaintenance = () => {
    return auth.user.user_roles.includes('fleet_manager')
  }

  return (
    <>
      <div className="flex flex-col md:flex-row items-start justify-between">
        <div className="flex flex-col">
          <div className="md:ml-3">
            <div className="text-2xl">{fleet.type} - {fleet.manufacturer} {fleet.name}</div>
            <p>{fleet.aircraft.length} aircraft in fleet</p>
          </div>
          <img className="rounded w-full md:w-auto" src={fleet.image_url} />
        </div>
        <div className="ml-2">
          <div className="flex flex-col md:flex-row mt-2 md:mt-0">
            <div className="md:mr-8">
              <span className="text-md font-bold text-gray-600">Powerplants: </span><br/>
              <span>{fleet.number_of_engines}x {fleet.powerplants}</span>
            </div>
            <div className="md:mr-8">
              <span className="text-md font-bold text-gray-600">Fuel Type: </span><br/>
              <span>{fleet.fuel_type === 1 ? <span>Avgas</span> : <span>Jet Fuel</span>}</span>
            </div>
            <div className="mr-8">
              <span className="text-md font-bold text-gray-600">Fuel Capacity: </span><br/>
              <span>{fleet.fuel_capacity.toLocaleString(navigator.language)} gal</span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row mt-4">
            <div className="mr-8">
              <span className="text-md font-bold text-gray-600">Service Ceiling: </span><br/>
              <span>{fleet.service_ceiling.toLocaleString(navigator.language)} ft</span>
            </div>
            <div className="mr-8">
              <span className="text-md font-bold text-gray-600">Max Range: </span><br/>
              <span>{fleet.range.toLocaleString(navigator.language)} nm</span>
            </div>
            <div className="mr-8">
              <span className="text-md font-bold text-gray-600">Max Cruise Speed: </span><br/>
              <span>{fleet.cruise_speed.toLocaleString(navigator.language)} kts</span>
            </div>
            <div className="mr-8">
              <span className="text-md font-bold text-gray-600">PAX Capacity: </span><br/>
              <span>{fleet.pax_capacity}</span>
            </div>
            <div className="mr-8">
              <span className="text-md font-bold text-gray-600">Cargo Capacity: </span><br/>
              <span>{fleet.cargo_capacity.toLocaleString(navigator.language)} lbs</span>
            </div>
          </div>
        </div>
      </div>
      { auth.user && (
        <div className="mt-3 overflow-x-auto">
          {fleet.aircraft.length > 0 &&
          <table className="table table-auto">
            <thead>
            <tr>
              <th scope="col">Registration</th>
              <th scope="col">Hub</th>
              <th scope="col">Current Location</th>
              <th scope="col">Flight Time (minutes)</th>
              <th scope="col">Status</th>
              <th scope="col">Overall Condition</th>
              {shouldShowMaintenance() && <th scope="col">Action</th>}
            </tr>
            </thead>
            <tbody>
            {fleet.aircraft.map((aircraft) => (
              <tr key={aircraft.id}>
                <td><Link href={`/aircraft/${aircraft.id}`}>{aircraft.registration}</Link></td>
                <td><Link href={`/airports/${aircraft.hub_id}`}>{aircraft.hub_id}</Link></td>
                <td><Link href={`/airports/${aircraft.current_airport_id}`}>{aircraft.current_airport_id}</Link></td>
                <td>{aircraft.flight_time_mins}</td>
                <td>{renderAircraftStatus(aircraft.state)} {aircraft.maintenance_status && <span className="ml-2 text-orange-500"><FontAwesomeIcon icon={faScrewdriverWrench} /></span>}</td>
                <td>
                  <AircraftCondition aircraftCondition={aircraft.total_condition} />
                </td>
                {shouldShowMaintenance() && <td><Link href={`/aircraft/${aircraft.id}`} className="btn btn-secondary btn-small">Maintenance</Link></td>}
              </tr>
            ))}
            </tbody>
          </table>
          }
        </div>
      )}
    </>
  )
}

export default FleetCardContent
