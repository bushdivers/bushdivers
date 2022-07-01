import React, { useState } from 'react'
import AirportMap from '../../Shared/Components/Airport/AirportMap'
import { Link, usePage } from '@inertiajs/inertia-react'
import AppLayout from '../../Shared/AppLayout'
import { faAnchor, faCloudSun } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const AirportDetail = ({ airport, metar, aircraft }) => {
  const { auth } = usePage().props
  const [icao, setIcao] = useState()

  const handleAirportChange = (e) => {
    setIcao(e.target.value)
  }

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
      <div className="w-1/6 mb-2 flex items-center">
        <input id="airport" type="text" placeholder="ICAO" className="form-input form inline-block" value={icao} onChange={handleAirportChange} />
        <Link href={`/airports/${icao}`} className="ml-2 btn btn-secondary">Go</Link>
      </div>
      { !airport
        ? <h1>Airport Search</h1>
        : <h1>{airport.name} - {airport.identifier}</h1>
      }
      { airport && (
      <div className="flex flex-col lg:flex-row justify-between">
        <div className="lg:w-1/2">
          <div className="rounded shadow p-1 lg:p-4 mt-2 bg-white mx-2">
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
          </div>
          {airport.longest_runway_length && (
            <div className="rounded shadow p-4 mt-2 bg-white mx-2">
              <div className="flex items-center">
                RWY
                <span className="ml-2">{renderRunwayText(airport.longest_runway_surface)} {airport.longest_runway_length.toLocaleString(navigator.language)}ft x {airport.longest_runway_width}ft</span>
              </div>
            </div>
          )}
          <div className="rounded shadow p-4 mt-2 bg-white mx-2">
            <div className="flex items-center">
              {metar
                ? (
                  <>
                    <FontAwesomeIcon icon={faCloudSun} />
                    <span className="ml-2">{metar}</span>
                  </>
                  )
                : <div>No METAR available</div>
              }

            </div>
          </div>
          <div className="rounded shadow p-4 mt-2 bg-white mx-2 overflow-x-auto">
            <div className="text-lg">Available Aircraft</div>
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
          </div>
        </div>
        <div className="lg:w-1/2 rounded shadow p-4 mt-2 bg-white mx-2">
          <AirportMap airport={airport} size="large" mapStyle={auth.user.map_style} />
        </div>
      </div>
      )}
    </div>
  )
}

AirportDetail.layout = page => <AppLayout children={page} title="Airport Details" heading="Airport Details" />

export default AirportDetail
