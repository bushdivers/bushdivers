import React from 'react'
import Layout from '../../Shared/Layout'
import PageTitle from '../../Shared/Navigation/PageTitle'
import AirportMap from '../../Shared/Components/Airport/AirportMap'

const AirportDetail = ({ airport, metar }) => {
  return (
    <>
      <PageTitle title={`${airport.name} - ${airport.identifier}`} />
      <div className="flex justify-between">
        <div className="w-1/2">
          <div className="rounded shadow p-4 mt-2 bg-white mx-2">
            <div className="flex justify-between">
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
        </div>
        <div className="w-1/2 rounded shadow p-4 mt-2 bg-white mx-2">
          <AirportMap airport={airport} size="large" />
        </div>
      </div>
    </>
  )
}

AirportDetail.layout = page => <Layout children={page} title="Airport Details" />

export default AirportDetail
