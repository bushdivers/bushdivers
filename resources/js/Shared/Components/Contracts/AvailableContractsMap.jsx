import React, { useEffect, useRef, useState } from 'react'
import maplibre from 'maplibre-gl'
import { parseMapStyle, transformRequest } from '../../../Helpers/general.helpers'
import Map, { Layer, Marker, Popup, Source } from 'react-map-gl'

const accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const layerStyle = {
  id: 'lines',
  type: 'line',
  paint: {
    'line-color': '#F97316',
    'line-width': 2
  }
}

function AvailableContracts ({ contracts, size, mapStyle, defaultLocation, handleSelectedIcao }) {
  const [routeData, setRouteData] = useState(null)
  useEffect(() => {
    const data = []

    contracts.forEach((contract) => {
      const depLngLat = [contract.current_airport.lon, contract.current_airport.lat]
      const arrLngLat = [contract.arr_airport.lon, contract.arr_airport.lat]
      data.push({ type: 'Feature', geometry: { type: 'LineString', coordinates: [depLngLat, arrLngLat] } })
    })

    const geojson = {
      type: 'FeatureCollection',
      features: data
    }
    setRouteData(geojson)
  }, [contracts])

  return (
    <div className={`map-container-${size} relative`}>
      <Map
        mapLib={maplibre}
        mapboxAccessToken={accessToken}
        initialViewState={{
          longitude: defaultLocation.lon,
          latitude: defaultLocation.lat,
          zoom: 5
        }}
        mapStyle={parseMapStyle(mapStyle)}
        transformRequest={transformRequest}
      >
        {contracts && contracts.map((contract) => (
          <Marker key={contract.id} scale={0.75} longitude={contract.current_airport.lon} latitude={contract.current_airport.lat} onClick={() => handleSelectedIcao(contract.current_airport_id)}>
            <div className="h-10 w-10 p-2 rounded-full text-1xs bg-primary border-primary-content border text-primary-content flex justify-center items-center cursor-pointer">{contract.current_airport_id}</div>
          </Marker>
        ))}
        {contracts && contracts.map((contract) => (
          <Marker key={contract.id} scale={0.75} longitude={contract.arr_airport.lon} latitude={contract.arr_airport.lat} onClick={() => handleSelectedIcao(contract.arr_airport.identifier)}>
            <div className="h-10 w-10 p-2 rounded-full text-1xs bg-accent border-primary-content border text-primary-content flex justify-center items-center cursor-pointer">{contract.arr_airport.identifier}</div>
          </Marker>
        ))}
        <Source id="routeData" type="geojson" data={routeData}>
        <Layer
            id="lineLayer"
            type="line"
            source="my-data"
            layout={{
              'line-join': 'round',
              'line-cap': 'round'
            }}
            paint={{
              'line-color': '#F97316',
              'line-width': 1
            }}
          />
        </Source>
      </Map>
    </div>
  )
}

export default AvailableContracts
