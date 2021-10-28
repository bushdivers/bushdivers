import React, { useState } from 'react'
import Layout from '../../Shared/Layout'
import PageTitle from '../../Shared/Navigation/PageTitle'
import AirportMap from '../../Shared/Components/Airport/AirportMap'
import { Inertia } from '@inertiajs/inertia'
import { Link } from '@inertiajs/inertia-react'

const AirportDetail = ({ airport, metar, aircraft }) => {
  const [icao, setIcao] = useState()

  const handleAirportChange = (e) => {
    setIcao(e.target.value)
  }

  return (
    <>
      <div className="w-1/6 mb-2 flex items-center">
        <input id="airport" type="text" placeholder="ICAO" className="form-input form inline-block" value={icao} onChange={handleAirportChange} />
        <Link href={`/airports/${icao}`} className="ml-2 btn btn-secondary">Go</Link>
      </div>
      { !airport
        ? <PageTitle title="Airport Search" />
        : <PageTitle title={`${airport.name} - ${airport.identifier}`} />
      }
      { airport && (
      <div className="flex flex-col lg:flex-row justify-between">
        <div className="lg:w-1/2">
          <div className="rounded shadow p-1 lg:p-4 mt-2 bg-white mx-2">
            <div className="flex justify-between overflow-x-auto">
              <div className="flex flex-col items-center my-2 mx-4">
                <div className="text-sm">ICAO</div>
                <div className="text-xl">{airport.identifier}</div>
              </div>
              <div className="flex flex-col items-center my-2 mx-4">
                <div className="text-sm">Country</div>
                <div className="text-xl">{airport.country}</div>
              </div>
              <div className="flex flex-col items-center my-2 mx-4">
                <div className="text-sm">Latitude</div>
                <div className="text-xl">{airport.lat}</div>
              </div>
              <div className="flex flex-col items-center my-2 mx-4">
                <div className="text-sm">Longitude</div>
                <div className="text-xl">{airport.lon}</div>
              </div>
              <div className="flex flex-col items-center my-2 mx-4">
                <div className="text-sm">Altitude</div>
                <div className="text-xl">{airport.altitude}ft</div>
              </div>
            </div>
          </div>
          {airport.longest_runway_length && (
            <div className="rounded shadow p-4 mt-2 bg-white mx-2">
              <div className="flex items-center">
                <i className="material-icons mr-2">add_road</i>
                <span>{airport.longest_runway_surface} {airport.longest_runway_length}ft x {airport.longest_runway_width}ft</span>
              </div>
            </div>
          )}
          <div className="rounded shadow p-4 mt-2 bg-white mx-2">
            <div className="flex items-center">
              {metar
                ? (
                  <>
                    <i className="material-icons mr-2">light_mode</i>
                    <span>{metar}</span>
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
              </tr>
              </thead>
              <tbody>
              {aircraft && aircraft.map((ac) => (
                <tr key={ac.id}>
                  <td><Link href={`/aircraft/${ac.id}`}>{ac.registration}</Link></td>
                  <td>{ac.fleet.manufacturer} {ac.fleet.name} ({ac.fleet.type})</td>
                  <td>{ac.hub_id}</td>
                  <td>{ac.fuel_onboard}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="lg:w-1/2 rounded shadow p-4 mt-2 bg-white mx-2">
          <AirportMap airport={airport} size="large" />
        </div>
      </div>
      )}
    </>
  )
}

AirportDetail.layout = page => <Layout children={page} title="Airport Details" />

export default AirportDetail
