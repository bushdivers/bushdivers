import { Box, Card, CardBody, CardHeader, useColorMode } from '@chakra-ui/react'
import maplibre from 'maplibre-gl'
import React, { useEffect, useRef, useState } from 'react'
import { Layer, Map, Marker, Source } from 'react-map-gl'

import {
  mapboxToken,
  parseMapStyle,
  transformRequest,
} from '../../helpers/geo.helpers'

const PirepMap = (props) => {
  const { colorMode } = useColorMode()
  const [pirepRoute, setPirepRoute] = useState()
  useEffect(() => {
    if (props.pirep) {
      const data = []

      const depLngLat = [
        props.pirep.dep_airport.lon,
        props.pirep.dep_airport.lat,
      ]
      const arrLngLat = [
        props.pirep.arr_airport.lon,
        props.pirep.arr_airport.lat,
      ]
      data.push({
        type: 'Feature',
        id: 'route',
        geometry: { type: 'LineString', coordinates: [depLngLat, arrLngLat] },
      })

      const coords = []
      props.coords.map((log) =>
        coords.push(new maplibre.LngLat(log.lon, log.lat).toArray())
      )

      data.push({
        type: 'Feature',
        id: 'coords',
        geometry: { type: 'LineString', coordinates: [coords] },
      })

      const geojson = {
        type: 'FeatureCollection',
        features: data,
      }
      setPirepRoute(geojson)
    }
  }, [props.pirep])

  // useEffect(() => {
  //   if (props.pirep) {
  //     // setFlight(props.pirep.flight)
  //
  //     const depPopup = new maplibre.Popup({ offset: 25 }).setText(
  //       props.pirep.departure_airport_id
  //     )
  //
  //     const arrPopup = new maplibre.Popup({ offset: 25 }).setText(
  //       props.pirep.destination_airport_id
  //     )
  //
  //     const depLngLat = [
  //       props.pirep.dep_airport.lon,
  //       props.pirep.dep_airport.lat,
  //     ]
  //     const arrLngLat = [
  //       props.pirep.arr_airport.lon,
  //       props.pirep.arr_airport.lat,
  //     ]
  //
  //     map.current.on('load', function () {
  //       new maplibre.Marker({
  //         color: '#22C55E',
  //       })
  //         .setLngLat(depLngLat)
  //         .setPopup(depPopup)
  //         .addTo(map.current)
  //
  //       new maplibre.Marker({
  //         color: '#F97316',
  //       })
  //         .setLngLat(arrLngLat)
  //         .setPopup(arrPopup)
  //         .addTo(map.current)
  //
  //       map.current.addSource('route', {
  //         type: 'geojson',
  //         data: {
  //           type: 'Feature',
  //           geometry: {
  //             type: 'LineString',
  //             coordinates: [depLngLat, arrLngLat],
  //           },
  //         },
  //       })
  //
  //       const coords = []
  //       props.coords.map((log) =>
  //         coords.push(new maplibre.LngLat(log.lon, log.lat).toArray())
  //       )
  //
  //       // coords = JSON.stringify(coords)
  //       // const newc = JSON.parse(coords)
  //
  //       console.log(coords)
  //
  //       map.current.addSource('coords', {
  //         type: 'geojson',
  //         data: {
  //           type: 'Feature',
  //           geometry: {
  //             type: 'MultiLineString',
  //             coordinates: [coords],
  //           },
  //         },
  //       })
  //
  //       map.current.addLayer({
  //         id: 'route',
  //         type: 'line',
  //         source: 'route',
  //         paint: {
  //           'line-color': '#fff',
  //           'line-width': 4,
  //           'line-opacity': 0.6,
  //         },
  //       })
  //
  //       map.current.addLayer({
  //         id: 'coords',
  //         type: 'line',
  //         source: 'coords',
  //         layout: {
  //           'line-join': 'round',
  //           'line-cap': 'round',
  //         },
  //         paint: {
  //           'line-color': '#F97316',
  //           'line-width': 4,
  //           'line-opacity': 0.6,
  //         },
  //       })
  //     })
  //
  //     const bounds = [depLngLat, arrLngLat]
  //     map.current.fitBounds(bounds, {
  //       padding: 80,
  //     })
  //   }
  // }, [props.pirep])

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
                <Source id="routeData" type="geojson" data={pirepRoute}>
                  <Layer
                    id="lineLayer"
                    type="line"
                    source="route"
                    layout={{
                      'line-join': 'round',
                      'line-cap': 'round',
                    }}
                    paint={{
                      'line-color': '#fff',
                      'line-width': 4,
                      'line-opacity': 0.6,
                    }}
                  />
                  <Layer
                    id="lineLayer"
                    type="line"
                    source="coodrs"
                    layout={{
                      'line-join': 'round',
                      'line-cap': 'round',
                    }}
                    paint={{
                      'line-color': '#F97316',
                      'line-width': 4,
                      'line-opacity': 0.6,
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
