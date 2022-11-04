import React from 'react'
import AirportMap from '../../Shared/Components/Airport/AirportMap'
import { Link, usePage } from '@inertiajs/inertia-react'
import AppLayout from '../../Shared/AppLayout'
import { faAnchor } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Card from '../../Shared/Elements/Card'

const AirportDetail = ({ airport, metar, aircraft }) => {
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

  // For future use
  // const renderAirportSize = (size) => {
  //   switch (size) {
  //     case 1:
  //       return 'Small'
  //     case 2:
  //       return 'Regional'
  //     case 3:
  //       return 'Major'
  //     case 4:
  //       return 'International'
  //   }
  // }

  const renderRunwayText = (surface) => {
    switch (surface) {
      case 'A':
        return 'Asphalt'
      case 'B':
        return 'Bituminous'
      case 'C':
        return 'Concrete'
      case 'CE':
        return 'Cement'
      case 'CR':
        return 'Water'
      case 'G':
        return 'Grass'
      case 'GR':
        return 'Gravel'
      case 'M':
        return 'Macadam'
      case 'S':
        return 'Sand'
      case 'T':
        return 'Tarmac'
      case 'W':
        return 'Water'
      default:
        return 'Unknown'
    }
  }
  return (
    <div className="p-4">
      <h2>{airport.name} - {airport.identifier}</h2>
      { airport && (
      <div className="flex flex-col lg:flex-row justify-between">
        <div className="lg:w-1/2">
          <div className="mt-2 mx-2">
            <Card title="Airport Info">
            <div className="flex justify-between overflow-x-auto">
              <div className="flex flex-col items-center my-2 mx-4">
                <div className="text-sm">ICAO</div>
                <div className="text-xl">{airport.identifier} {airport.longest_runway_surface === 'W' && <FontAwesomeIcon icon={faAnchor} />}</div>
              </div>
              <div className="flex flex-col items-center my-2 mx-4">
                <div className="text-sm">Size</div>
                <div className="text-xl">{airport.size}</div>
              </div>
              <div className="flex flex-col items-center my-2 mx-4">
                <div className="text-sm">Country</div>
                <div className="text-xl">{airport.country}</div>
              </div>
              <div className="flex flex-col items-center my-2 mx-4">
                <div className="text-sm">Latitude</div>
                <div className="text-xl">{(airport.lat * 1).toFixed(4)}</div>
              </div>
              <div className="flex flex-col items-center my-2 mx-4">
                <div className="text-sm">Longitude</div>
                <div className="text-xl">{(airport.lon * 1).toFixed(4)}</div>
              </div>
              <div className="flex flex-col items-center my-2 mx-4">
                <div className="text-sm">Altitude</div>
                <div className="text-xl">{airport.altitude.toLocaleString(navigator.language)}ft</div>
              </div>
            </div>
            </Card>
          </div>
          {airport.longest_runway_length && (
            <div className="mt-2 mx-2">
              <Card title="Runway Info">
              <div className="flex items-center">
                <span>{renderRunwayText(airport.longest_runway_surface)} {airport.longest_runway_length.toLocaleString(navigator.language)}ft x {airport.longest_runway_width}ft</span>
              </div>
              </Card>
            </div>
          )}
          <div className="mt-2 mx-2">
              <Card title="METAR">
                <div className="flex items-center">
              {metar
                ? (
                  <>
                    <span>{metar}</span>
                  </>
                  )
                : <div>No METAR available</div>
              }
                </div>
              </Card>
          </div>
          <div className="mt-2 mx-2">
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
                  <td><Link href={`/aircraft/${ac.id}`}>{ac.registration}</Link></td>
                  <td>{ac.fleet.manufacturer} {ac.fleet.name} ({ac.fleet.type})</td>
                  <td>{ac.hub_id}</td>
                  <td>{ac.fuel_onboard.toLocaleString(navigator.language)}</td>
                  <td>{renderAircraftStatus(ac.state)}</td>
                </tr>
              ))}
              </tbody>
            </table>
            </Card>
          </div>
        </div>
        <div className="lg:w-1/2 mt-2 mx-2">
          <Card>
            <AirportMap airport={airport} size="large" mapStyle={auth.user.map_style} />
          </Card>
        </div>
      </div>
      )}
    </div>
  )
}

AirportDetail.layout = page => <AppLayout children={page} title="Airport Details" heading="Airport Details" />

export default AirportDetail
