import { Box, useColorMode } from '@chakra-ui/react'
import maplibre from 'maplibre-gl'
import React from 'react'
import Map, { Marker } from 'react-map-gl'

import {
  mapboxToken,
  parseMapStyle,
  transformRequest,
} from '../../helpers/geo.helpers'

const AircraftMap = (props) => {
  const { colorMode } = useColorMode()
  return (
    <Box className="map-container-large">
      <Map
        mapLib={maplibre}
        mapboxAccessToken={mapboxToken}
        initialViewState={{
          longitude: props.aircraft.last_lon,
          latitude: props.aircraft.last_lat,
          zoom: 14,
        }}
        mapStyle={parseMapStyle(colorMode)}
        transformRequest={transformRequest}
      >
        <Marker
          longitude={props.aircraft.last_lon}
          latitude={props.aircraft.last_lat}
        />
      </Map>
    </Box>
  )
}

export default AircraftMap
