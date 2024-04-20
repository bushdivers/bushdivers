import { Box, Card, CardBody, CardHeader, useColorMode } from '@chakra-ui/react'
import maplibre from 'maplibre-gl'
import React from 'react'
import { Layer, Map, Marker, Source } from 'react-map-gl'

import {
  mapboxToken,
  parseMapStyle,
  transformRequest,
} from '../../helpers/geo.helpers'

const PirepMap = (props) => {
  const { colorMode } = useColorMode()
  let pirepRoute = null
  let pirepFlight = null
  if (props.pirep) {
    const depLngLat = [props.pirep.dep_airport.lon, props.pirep.dep_airport.lat]
    const arrLngLat = [props.pirep.arr_airport.lon, props.pirep.arr_airport.lat]

    pirepRoute = {
      type: 'Feature',
      id: 'route',
      geometry: { type: 'LineString', coordinates: [depLngLat, arrLngLat] },
    }

    const coords = []
    props.coords.map((log) => coords.push([log.lon, log.lat]))

    pirepFlight = {
      type: 'Feature',
      id: 'coords',
      geometry: { type: 'LineString', coordinates: coords },
    }
  }

  return (
    <Card>
      <CardHeader>Route</CardHeader>
      <CardBody>
        <Box className="map-container-small rounded`">
          <Map
            mapLib={maplibre}
            mapboxAccessToken={mapboxToken}
            initialViewState={{
              longitude: props.pirep.arr_airport.lon,
              latitude: props.pirep.arr_airport.lat,
              zoom: 6,
              fitBoundsOptions: 5,
            }}
            mapStyle={parseMapStyle(colorMode)}
            transformRequest={transformRequest}
          >
            {props.pirep && (
              <>
                <Marker
                  longitude={props.pirep.dep_airport.lon}
                  latitude={props.pirep.dep_airport.lat}
                  color="#22C55E"
                />
                <Marker
                  longitude={props.pirep.arr_airport.lon}
                  latitude={props.pirep.arr_airport.lat}
                  color="#F97316"
                />
                <Source id="pirep-route" type="geojson" data={pirepRoute}>
                  <Layer
                    id="pirep-route-layer"
                    type="line"
                    source="pirep-route"
                    layout={{
                      'line-join': 'round',
                      'line-cap': 'round',
                    }}
                    paint={{
                      'line-color': '#4299E1',
                      'line-width': 1,
                    }}
                  />
                </Source>
                <Source id="pirep-flight" type="geojson" data={pirepFlight}>
                  <Layer
                    id="pirep-flight-layer"
                    type="line"
                    source="pirep-route"
                    layout={{
                      'line-join': 'round',
                      'line-cap': 'round',
                    }}
                    paint={{
                      'line-color': '#ED8936',
                      'line-width': 2.5,
                    }}
                  />
                </Source>
              </>
            )}
          </Map>
        </Box>
      </CardBody>
    </Card>
  )
}

export default PirepMap
