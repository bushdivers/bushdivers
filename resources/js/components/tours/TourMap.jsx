import { Box, Card, Tag, Text, useColorMode } from '@chakra-ui/react'
import { featureCollection, greatCircle, point } from '@turf/turf'
import maplibre from 'maplibre-gl'
import React from 'react'
import { Layer, Map, Marker, Source } from 'react-map-gl'

import {
  mapboxToken,
  parseMapStyle,
  transformRequest,
} from '../../helpers/geo.helpers.js'

const TourMap = ({ checkpoints, start }) => {
  const { colorMode } = useColorMode()

  let lineFeatures = []
  let prevPoint = point([start.lon, start.lat])
  for (let i = 0; i < checkpoints.length; i++) {
    const startPoint = prevPoint
    const endPoint = point([
      checkpoints[i].airport.lon,
      checkpoints[i].airport.lat,
    ])
    const gc = greatCircle(startPoint, endPoint)
    prevPoint = endPoint
    lineFeatures.push(gc)
  }

  const geojson = featureCollection(lineFeatures)

  const layerStyle = {
    id: 'line',
    type: 'line',
    paint: {
      'line-width': 1,
      'line-color': '#FF6900',
    },
  }

  return (
    <Card>
      <Box rounded="md" className="map-container-small">
        <Map
          mapLib={maplibre}
          mapboxAccessToken={mapboxToken}
          initialViewState={{
            zoom: 0.75,
            latitude: start.lat,
            longitude: start.lon,
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
          <Source id="my-data" type="geojson" data={geojson}>
            <Layer {...layerStyle} />
          </Source>
        </Map>
      </Box>
    </Card>
  )
}

export default TourMap
