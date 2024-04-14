import { Box, Card, Tag, Text, useColorMode } from '@chakra-ui/react'
import maplibre from 'maplibre-gl'
import React from 'react'
import { Map, Marker } from 'react-map-gl'

import {
  mapboxToken,
  parseMapStyle,
  transformRequest,
} from '../../helpers/geo.helpers.js'

const TourMap = ({ checkpoints, start }) => {
  const { colorMode } = useColorMode()

  return (
    <Card>
      <Box rounded="md" className="map-container-small">
        <Map
          mapLib={maplibre}
          mapboxAccessToken={mapboxToken}
          initialViewState={{
            zoom: 0.75,
            latitude: 21.15,
            longitude: 169.96,
          }}
          mapStyle={parseMapStyle(colorMode)}
          transformRequest={transformRequest}
        >
          <Marker longitude={start.lon} latitude={start.lat}>
            <Tag size="sm">
              <Text fontSize="xs">{start.identifier}</Text>
            </Tag>
          </Marker>
          {checkpoints.map((c) => (
            <Marker
              key={c.id}
              longitude={c.airport.lon}
              latitude={c.airport.lat}
            >
              <Tag size="sm">
                <Text fontSize="xs">{c.section}</Text>
              </Tag>
            </Marker>
          ))}
        </Map>
      </Box>
    </Card>
  )
}

export default TourMap
