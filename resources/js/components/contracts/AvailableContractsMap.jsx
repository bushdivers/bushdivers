import maplibre from 'maplibre-gl'
import React, { useEffect, useState } from 'react'
import Map, { Layer, Marker, Source } from 'react-map-gl'

import {
  mapboxToken,
  parseMapStyle,
  transformRequest,
} from '../../helpers/geo.helpers'

function AvailableContractsMap({
  contracts,
  size,
  updatedMapStyle,
  defaultLocation,
  handleSelectedIcao,
}) {
  const [routeData, setRouteData] = useState(null)
  const [map, setMap] = useState('')

  useEffect(() => {
    if (updatedMapStyle === '') {
      setMap('dark')
    } else {
      setMap(updatedMapStyle)
    }
  }, [updatedMapStyle])

  useEffect(() => {
    const data = []

    contracts.forEach((contract) => {
      const depLngLat = [
        contract.current_airport.lon,
        contract.current_airport.lat,
      ]
      const arrLngLat = [contract.arr_airport.lon, contract.arr_airport.lat]
      data.push({
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: [depLngLat, arrLngLat] },
      })
    })

    const geojson = {
      type: 'FeatureCollection',
      features: data,
    }
    setRouteData(geojson)
  }, [contracts])

  return (
    <div className={`map-container-${size} relative`}>
      <Map
        mapLib={maplibre}
        mapboxAccessToken={mapboxToken}
        initialViewState={{
          longitude: defaultLocation.lon,
          latitude: defaultLocation.lat,
          zoom: 5,
        }}
        mapStyle={parseMapStyle(map)}
        transformRequest={transformRequest}
      >
        {contracts &&
          contracts.map((contract) => (
            <Marker
              key={contract.id}
              scale={0.75}
              longitude={contract.current_airport.lon}
              latitude={contract.current_airport.lat}
              onClick={() => handleSelectedIcao(contract.current_airport_id)}
            >
              <div className="h-10 w-10 p-2 rounded-full text-1xs bg-primary border-primary-content border text-primary-content flex justify-center items-center cursor-pointer">
                {contract.current_airport_id}
              </div>
            </Marker>
          ))}
        {contracts &&
          contracts.map((contract) => (
            <Marker
              key={contract.id}
              scale={0.75}
              longitude={contract.arr_airport.lon}
              latitude={contract.arr_airport.lat}
              onClick={() =>
                handleSelectedIcao(contract.arr_airport.identifier)
              }
            >
              <div className="h-10 w-10 p-2 rounded-full text-1xs bg-accent border-primary-content border text-primary-content flex justify-center items-center cursor-pointer">
                {contract.arr_airport.identifier}
              </div>
            </Marker>
          ))}
        <Source id="routeData" type="geojson" data={routeData}>
          <Layer
            id="lineLayer"
            type="line"
            source="my-data"
            layout={{
              'line-join': 'round',
              'line-cap': 'round',
            }}
            paint={{
              'line-color': '#F97316',
              'line-width': 1,
            }}
          />
        </Source>
      </Map>
    </div>
  )
}

export default AvailableContractsMap
