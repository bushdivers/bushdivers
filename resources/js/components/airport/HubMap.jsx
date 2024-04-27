import { Box, Card, CardBody, useColorMode } from '@chakra-ui/react'
import maplibre from 'maplibre-gl'
import React, { useEffect, useRef, useState } from 'react'
import { Map, Marker, Popup } from 'react-map-gl'

import {
  mapboxToken,
  parseMapStyle,
  transformRequest,
} from '../../helpers/geo.helpers.js'

const HubMap = ({ hubs, onIsVisible }) => {
  const [selectedMarker, setSelectedMarker] = useState(null)
  const { colorMode } = useColorMode()
  const handleClick = (loc) => {
    setSelectedMarker(loc)
  }

  const mapRef = useRef(null)

  useEffect(() => {
    if (onIsVisible) {
      mapRef.current.resize()
    }
  }, [onIsVisible])

  return (
    <Box className="map-container-large">
      <Map
        ref={mapRef}
        mapLib={maplibre}
        mapboxAccessToken={mapboxToken}
        initialViewState={{
          longitude: 145.0,
          latitude: -5.8,
          zoom: 4,
        }}
        mapStyle={parseMapStyle(colorMode)}
        transformRequest={transformRequest}
      >
        {hubs.length > 0 &&
          hubs.map((loc) => (
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
            <Card>
              <CardBody>{selectedMarker.identifier}</CardBody>
            </Card>
          </Popup>
        )}
      </Map>
    </Box>
  )
}

export default HubMap
