import { Badge, Card, CardBody, Icon } from '@chakra-ui/react'
import { Inertia, usePage } from '@inertiajs/react'
import { format } from 'date-fns'
import { Wrench } from 'lucide-react'
import React from 'react'

import StatCard from '../../components/elements/StatCard'
import AircraftCondition from '../../components/fleet/AircraftCondition'
import AircraftMap from '../../components/fleet/AircraftMap'
import AppLayout from '../../components/layout/AppLayout'
import { convertMinuteDecimalToHoursAndMinutes } from '../../helpers/date.helpers'

const Aircraft = ({ aircraft, maintenanceStatus, pireps }) => {
  const { auth } = usePage().props

  const calculateDistanceFlown = (p) => {
    return p.reduce((a, pirep) => {
      return a + pirep.distance
    }, 0)
  }

  const shouldShowMaintenance = () => {
    if (aircraft.owner_id > 0) {
      return aircraft.owner_id === auth.user.id
    } else {
      return auth.user.user_roles.includes('fleet_manager')
    }
  }

  const renderMaintenanceType = (maintenanceType) => {
    switch (maintenanceType) {
      case 1:
        return 'Engine 100 hour'
      case 2:
        return 'Engine TBO'
      case 3:
        return 'Annual airframe inspection'
      case 4:
        return 'General Maintenance'
      case 5:
        return 'Engine Maintenance'
    }
  }

  const checkAircraftAtHub = (aircraft) => {
    if (aircraft.location.is_hub || aircraft.location.size >= 3) return true
  }

  const handleTBO = (aircraft, engine) => {
    const res = checkAircraftAtHub(aircraft)
    if (!res) {
      window.alert('Maintenance is not available at this airport')
      return
    }
    let cost = 0.0
    switch (aircraft.fleet.size) {
      case 'S':
        cost = 15000.0
        break
      case 'M':
        cost = 30000.0
        break
      case 'L':
        cost = 60000.0
        break
    }
    const accept = window.confirm(
      `TBO will cost $${cost}, do you want to proceed?`
    )
    if (!accept) return
    const data = {
      aircraft: aircraft.id,
      engine,
      type: 2,
      cat: 'Inspection',
    }
    Inertia.post('/aircraft/maintenance', data)
  }
  //
  const handle100hr = (aircraft, engine) => {
    const res = checkAircraftAtHub(aircraft)
    if (!res) {
      window.alert('Maintenance is not available at this airport')
      return
    }

    const accept = window.confirm(
      '100 hour check will cost $2000.00, do you want to proceed?'
    )
    if (!accept) return

    const data = {
      aircraft: aircraft.id,
      engine,
      type: 1,
      cat: 'Inspection',
    }
    Inertia.post('/aircraft/maintenance', data)
  }

  const handleAnnual = (aircraft) => {
    const res = checkAircraftAtHub(aircraft)
    if (!res) {
      window.alert('Maintenance is not available at this airport')
      return
    }

    const accept = window.confirm(
      'Annual airframe check will cost $2000.00, do you want to proceed?'
    )
    if (!accept) return

    const data = {
      aircraft: aircraft.id,
      type: 3,
      cat: 'Inspection',
    }
    Inertia.post('/aircraft/maintenance', data)
  }

  const handleRelocate = (aircraft) => {
    const dest = window.prompt(
      'Enter ICAO of destination airport',
      aircraft.hub_id
    )
    if (!dest || dest.length < 2) return

    const data = {
      aircraft: aircraft.id,
      dest: dest,
    }

    Inertia.post('/aircraft/maintenance/relocate', data)
  }

  const handleGeneralMaintenance = (
    aircraft,
    maintenanceType,
    engine = null
  ) => {
    const res = checkAircraftAtHub(aircraft)
    if (!res) {
      window.alert('Maintenance is not available at this airport')
      return
    }
    const accept = window.confirm(
      `Are you sure you want to proceed with ${
        maintenanceType === 4 ? 'General' : 'Engine'
      } maintenance?`
    )
    if (!accept) return

    const data = {
      aircraft: aircraft.id,
      engine,
      type: maintenanceType,
      cat: 'General',
    }
    Inertia.post('/aircraft/maintenance', data)
  }

  return (
    <div>
      <div className="flex justify-start items-center mb-2">
        <h2>{`${aircraft.registration} - ${aircraft.fleet.manufacturer} ${aircraft.fleet.name} (${aircraft.fleet.type})`}</h2>
        {aircraft.maintenance_status && !aircraft.is_rental && (
          <span className="ml-2 text-orange-500">
            <Icon as={Wrench} />
          </span>
        )}
        {aircraft.is_rental ? (
          <span className="ml-2">
            <Badge color="primary" label="Rental" />
          </span>
        ) : (
          <></>
        )}
        {aircraft.owner_id > 0 && aircraft.owner_id === auth.user.id ? (
          <span className="ml-2">
            <Badge color="primary" label="Private Plane - Owner" />
          </span>
        ) : aircraft.owner_id > 0 ? (
          <span className="ml-2 bg-orange-500 text-white p-1 rounded text-xs">
            Private Plane
          </span>
        ) : (
          <></>
        )}
      </div>
      {maintenanceStatus['100hr'] ||
      maintenanceStatus.annual ||
      maintenanceStatus.tbo ? (
        <div className="text-red-400">
          <p>Maintenance Required:</p>
          <ul>
            {maintenanceStatus.annual && <li>Airframe Annual Inspection</li>}
            {maintenanceStatus['100hr'] && <li>100 Hour Inspection</li>}
            {maintenanceStatus.tbo && <li>Engine Overhaul</li>}
          </ul>
        </div>
      ) : (
        <></>
      )}
      <div className="flex flex-col md:flex-row justify-between">
        <div className="md:w-1/5 my-1">
          <StatCard title="Flights" stat={pireps.length} />
        </div>
        <div className="md:w-1/5 my-1">
          <StatCard
            title="Distance Flown"
            stat={calculateDistanceFlown(pireps)}
          />
        </div>
        <div className="md:w-1/5 my-1">
          <StatCard
            title="Current Location"
            stat={aircraft.current_airport_id}
            link={'/airports/' + aircraft.current_airport_id}
          />
        </div>
        <div className="md:w-1/5 my-1">
          <StatCard
            title="Home Hub"
            stat={aircraft.hub_id}
            link={'/airports/' + aircraft.hub_id}
          />
        </div>
        <div className="md:w-1/5 my-1">
          <StatCard title="Current Fuel" stat={aircraft.fuel_onboard} />
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:justify-between mt-4">
        <div className="md:w-1/2 mx-2">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="md:w-1/3 my-1">
              <StatCard
                title="Airframe Time"
                stat={(aircraft.flight_time_mins / 60).toFixed(2)}
              />
            </div>
            <div className="md:w-1/3 my-1">
              <StatCard
                title="Last Inspection (Annual)"
                stat={format(aircraft.last_inspected_at, 'DD/MM/YYYY')}
              />
            </div>
            <div className="md:w-1/3 my-1">
              <StatCard
                title="TBO Interval"
                stat={aircraft.fleet.tbo_mins / 60}
              />
            </div>
          </div>
          {!aircraft.is_rental && (
            <div className="my-2">
              <Card title="Maintenance">
                <div className="flex justify-between">
                  {shouldShowMaintenance() && (
                    <div className="flex justify-between space-x-1">
                      <button
                        className="btn btn-secondary btn-sm my-1"
                        onClick={() => handleGeneralMaintenance(aircraft, 4)}
                      >
                        General Maintenance
                      </button>
                      <button
                        className="btn btn-secondary my-1 btn-sm"
                        onClick={() => handleAnnual(aircraft)}
                      >
                        Annual Inspection
                      </button>
                      <button
                        className="btn btn-secondary my-1 btn-sm"
                        onClick={() => handleRelocate(aircraft)}
                      >
                        Relocate
                      </button>
                    </div>
                  )}
                </div>
                <div className="mt-2 my-4">
                  <p>Airframe Condition</p>
                  <AircraftCondition aircraftCondition={aircraft.wear} />
                </div>
                <div className="overflow-x-auto">
                  <table className="table table-compact w-full">
                    <thead>
                      <tr>
                        <th>Engine #</th>
                        <th>Time since 100 hr</th>
                        <th>Time since TBO</th>
                        <th>Condition</th>
                        {shouldShowMaintenance() && <th>Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {aircraft.engines.map((engine) => (
                        <tr key={engine.id}>
                          <td>{engine.engine_no}</td>
                          <td>
                            {(engine.mins_since_100hr / 60).toFixed(2)}
                            {shouldShowMaintenance() && (
                              <button
                                className="btn btn-secondary ml-2 btn-xs"
                                onClick={() => handle100hr(aircraft, engine.id)}
                              >
                                100 hr
                              </button>
                            )}
                          </td>
                          <td>
                            {(engine.mins_since_tbo / 60).toFixed(2)}
                            {shouldShowMaintenance() && (
                              <button
                                className="btn btn-secondary ml-2 btn-xs"
                                onClick={() => handleTBO(aircraft, engine.id)}
                              >
                                TBO
                              </button>
                            )}
                          </td>
                          <td>
                            <AircraftCondition
                              aircraftCondition={engine.wear}
                            />
                          </td>
                          {shouldShowMaintenance() && (
                            <td>
                              <button
                                onClick={() =>
                                  handleGeneralMaintenance(
                                    aircraft,
                                    5,
                                    engine.id
                                  )
                                }
                                className="btn btn-secondary btn-xs"
                              >
                                Engine Maintenance
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}
          {!aircraft.is_rental && (
            <div>
              <Card title="Maintenance Logs">
                <div className="overflow-x-auto">
                  <table className="table table-compact w-full">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Cost</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aircraft.maintenance.map((maintenance) => (
                        <tr key={maintenance.id}>
                          <td>
                            {renderMaintenanceType(
                              maintenance.maintenance_type
                            )}
                          </td>
                          <td>{maintenance.cost}</td>
                          <td>
                            {format(maintenance.created_at, 'DD/MM/YYYY')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}
          <div className="mt-2">
            <Card title="Flights">
              <div className="overflow-x-auto">
                <table className="table table-compact w-full">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Departure</th>
                      <th>Arrival</th>
                      <th>Distance</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pireps &&
                      pireps.map((pirep) => (
                        <tr key={pirep.id}>
                          <td>{pirep.submitted_at}</td>
                          <td>{pirep.departure_airport_id}</td>
                          <td>{pirep.destination_airport_id}</td>
                          <td>{pirep.distance}</td>
                          <td>
                            {convertMinuteDecimalToHoursAndMinutes(
                              pirep.flight_time
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
        <div className="md:w-1/2 mx-1">
          <div>
            <Card>
              <AircraftMap
                aircraft={aircraft}
                size="large"
                mapStyle={auth.user.map_style}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

Aircraft.layout = (page) => (
  <AppLayout
    children={page}
    title="Aircraft Details"
    heading="Aircraft Details"
  />
)

export default Aircraft
