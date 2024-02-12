import { Box, useColorMode } from '@chakra-ui/react'
import maplibre from 'maplibre-gl'
import React from 'react'
import { Map, Marker } from 'react-map-gl'

import {
  mapboxToken,
  parseMapStyle,
  transformRequest,
} from '../../helpers/geo.helpers'

const LandingMap = (props) => {
  const { colorMode } = useColorMode()

  return (
    <Box className="map-container-small rounded">
      <Map
        mapLib={maplibre}
        mapboxAccessToken={mapboxToken}
        initialViewState={{
          longitude: props.pirep.landing_lon,
          latitude: props.pirep.landing_lat,
          zoom: 16,
        }}
        mapStyle={parseMapStyle(colorMode)}
        transformRequest={transformRequest}
      >
        {props.pirep && (
          <Marker
            longitude={props.pirep.landing_lon}
            latitude={props.pirep.landing_lat}
          />
        )}
      </Map>
    </Box>
  )
}

export default LandingMap
