import { Box, Card, CardBody, Icon, useColorMode } from '@chakra-ui/react'
import { Link } from '@inertiajs/react'
import { Anchor, Package } from 'lucide-react'
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
              key={loc.id}
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
            <Card boxShadow={'none'}>
              <CardBody p={2} pb={0}>
                <Box fontSize="md">
                  <Link href={`/airports/${selectedMarker.identifier}`}>
                    {selectedMarker.identifier}
                  </Link>{' '}
                  {selectedMarker.longest_runway_surface === 'W' && (
                    <Icon as={Anchor} color="blue.500" />
                  )}
                  {selectedMarker.is_thirdparty && (
                    <Icon as={Package} color="green.500" />
                  )}
                </Box>
                <Box>{selectedMarker.name}</Box>
              </CardBody>
            </Card>
          </Popup>
        )}
      </Map>
    </Box>
  )
}

export default HubMap
