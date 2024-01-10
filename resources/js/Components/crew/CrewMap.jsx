import { Box } from '@chakra-ui/react'
import maplibre from 'maplibre-gl'
import React, { useState } from 'react'
import Map, { Marker, Popup } from 'react-map-gl'

import {
  mapboxToken,
  parseMapStyle,
  transformRequest,
} from '../../helpers/geo.helpers'

const CrewMap = (props) => {
  const [selectedMarker, setSelectedMarker] = useState(null)

  const handleClick = (loc) => {
    setSelectedMarker(loc)
  }

  return (
    <>
      <Box className={'map-container-full relative'}>
        <Map
          mapLib={maplibre}
          mapboxAccessToken={mapboxToken}
          initialViewState={{
            longitude: 145.0,
            latitude: -5.8,
            zoom: 4,
          }}
          mapStyle={parseMapStyle(props.mapStyle)}
          transformRequest={transformRequest}
        >
          {props.locations.length > 0 &&
            props.locations.map((loc) => (
              <Marker
                onClick={(e) => {
                  e.originalEvent.stopPropagation()
                  handleClick(loc)
                }}
                key={loc.identifier}
                color="#f97316"
                scale={0.75}
                longitude={loc.lon}
                latitude={loc.lat}
                anchor="bottom"
              />
            ))}
          {selectedMarker && (
            <Popup
              longitude={Number(selectedMarker.lon)}
              latitude={Number(selectedMarker.lat)}
              anchor="top"
              onClose={() => setSelectedMarker(null)}
            >
              <p>{selectedMarker.identifier}</p>
            </Popup>
          )}
        </Map>
      </Box>
    </>
  )
}

export default CrewMap
