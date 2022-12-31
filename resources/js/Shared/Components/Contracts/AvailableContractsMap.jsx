import React, { useEffect, useRef, useState } from 'react'
import maplibre from 'maplibre-gl'
import { parseMapStyle, transformRequest } from '../../../Helpers/general.helpers'
import Map, { Marker, Popup } from 'react-map-gl'
import { usePage } from '@inertiajs/inertia-react'

const accessToken = import.meta.env.VITE_MAPBOX_TOKEN

function AvailableContracts ({ contracts, size, mapStyle, defaultLocation }) {
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
          <Marker key={contract.id} scale={0.75} longitude={contract.current_airport.lon} latitude={contract.current_airport.lat}>
            <div className="h-10 w-10 rounded-full text-xs bg-primary text-neutral flex justify-center items-center">{contract.current_airport_id}</div>
          </Marker>
        ))}
      </Map>
    </div>
  )
}

export default AvailableContracts
