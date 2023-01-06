import React, { useState } from 'react'
import maplibre from 'maplibre-gl'
import { parseMapStyle, transformRequest } from '../../../Helpers/general.helpers'
import Map, { Marker, Popup } from 'react-map-gl'

const accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const CrewMap = (props) => {
  const [selectedMarker, setSelectedMarker] = useState(null)

  const handleClick = (loc) => {
    setSelectedMarker(loc)
  }

  return (
    <>
      <div className={`map-container-${props.size} relative`}>
        <Map
          mapLib={maplibre}
          mapboxAccessToken={accessToken}
          initialViewState={{
            longitude: 145.0,
            latitude: -5.8,
            zoom: 4
          }}
          mapStyle={parseMapStyle(props.mapStyle)}
          transformRequest={transformRequest}
        >
          {props.locations.length > 0 && props.locations.map((loc) => (
            <Marker onClick={(e) => {
              e.originalEvent.stopPropagation()
              handleClick(loc)
            }} key={loc.identifier} color="#f97316" scale={0.75} longitude={loc.lon} latitude={loc.lat} anchor="bottom" />
          ))}
          {selectedMarker && (
            <Popup longitude={Number(selectedMarker.lon)} latitude={Number(selectedMarker.lat)}
                   anchor="top"
                   onClose={() => setSelectedMarker(null)}
            >
              <p>{selectedMarker.identifier}</p>
            </Popup>
          )}
        </Map>
      </div>
    </>
  )
}

export default CrewMap
