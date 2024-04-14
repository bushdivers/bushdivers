import { Box, Card, CardBody, Image, useColorMode } from '@chakra-ui/react'
import axios from 'axios'
import maplibre from 'maplibre-gl'
import React, { useEffect, useState } from 'react'
import Map, { Marker, Popup } from 'react-map-gl'

import {
  mapboxToken,
  parseMapStyle,
  transformRequest,
} from '../../helpers/geo.helpers'
import { useInterval } from '../../hooks/useInterval'

const LiveFlightMap = ({ updateFlightCount }) => {
  const { colorMode } = useColorMode()
  const [selectedMarker, setSelectedMarker] = useState(null)
  // const mapContainer = useRef(null)
  // const map = useRef(null)
  // const markers = useRef([])
  const [flights, setFlights] = useState([])
  useInterval(async () => {
    await loadMarkers()
  }, 10000)

  const loadMarkers = async () => {
    const res = await axios.get('/api/liveflights')
    if (res.status === 200) {
      setFlights(res.data.flights)
    }

    // flights.forEach((f) => {
    //   const flightLngLat = [f.current_lon, f.current_lat]
    //
    //   const flightPopup = new maplibre.Popup({ offset: 25 }).setHTML(`
    //         <b>Pilot:</b> ${f.pilot.pilot_id} ${f.pilot.private_name}<br/>
    //         <b>Route:</b> ${f.departure_airport_id} - ${
    //           f.destination_airport_id
    //         }<br/>
    //         <b>Aircraft:</b><br/>
    //         ${
    //           f.is_rental
    //             ? f.rental.fleet.manufacturer
    //             : f.aircraft.fleet.manufacturer
    //         }
    //         ${f.is_rental ? f.rental.fleet.name : f.aircraft.fleet.name}
    //         <br/>
    //         ${
    //           f.is_rental ? f.rental.registration : f.aircraft.registration
    //         }<br/>
    //         <b>Altitude:</b> ${f.current_altitude} ft<br/>
    //         <b>Ind. Speed:</b> ${f.current_indicated_speed} kts<br/>
    //         <b>Heading:</b> ${f.current_heading}&#176;<br/>
    //      `)
    //   // .setText(
    //   //   `${f.pilot.pilot_id} ${f.pilot.private_name} - ${f.flight.dep_airport_id} ${f.flight.arr_airport_id}`
    //   // )
    //   const el = document.createElement('img')
    //   el.className = 'marker'
    //   el.width = 30
    //   el.height = 30
    //   el.src =
    //     'https://res.cloudinary.com/dji0yvkef/image/upload/v1631525263/BDVA/icon_c208_orangekFus_whiteWings_revnmm.png'
    //
    //   const flightMarker = new maplibre.Marker(el, {
    //     rotation: f.current_heading,
    //   })
    //     .setLngLat(flightLngLat)
    //     .setPopup(flightPopup)
    //     .addTo(map.current)
    //
    //   markers.current.push(flightMarker)
    // })
  }

  useEffect(() => {
    updateFlightCount(flights.length)
  }, [flights])

  useEffect(() => {
    async function asyncSetup() {
      await loadMarkers()
    }

    asyncSetup()
    // async function asyncSetup() {
    //   if (map.current) return
    //   map.current = new maplibre.Map({
    //     container: mapContainer.current,
    //     style: parseMapStyle(mapStyle),
    //     // center: [143.23070, -6.36188],
    //     center: [165.272614, 29.5309],
    //     zoom: 2,
    //     mapboxAccessToken: mapboxToken,
    //   })
    //
    //   await map.current.on('load', function () {
    //     loadMarkers()
    //   })
    // }
    // asyncSetup()
  }, [])

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
          mapStyle={parseMapStyle(colorMode)}
          transformRequest={transformRequest}
        >
          {flights.length > 0 &&
            flights.map((flight) => (
              <Marker
                onClick={(e) => {
                  e.originalEvent.stopPropagation()
                  handleClick(flight)
                }}
                key={flight.id}
                color="#f97316"
                scale={0.75}
                longitude={flight.current_lon}
                latitude={flight.current_lat}
                anchor="bottom"
                rotation={flight.current_heading}
              >
                <Image
                  boxSize="30px"
                  src={
                    flight.tour_id
                      ? 'https://d1z4ruc262gung.cloudfront.net/assets/bd_flight_black.png'
                      : 'https://d1z4ruc262gung.cloudfront.net/assets/bd_flight_white.png'
                  }
                />
              </Marker>
            ))}
          {selectedMarker && (
            <Popup
              longitude={Number(selectedMarker.current_lon)}
              latitude={Number(selectedMarker.current_lat)}
              anchor="top"
              onClose={() => setSelectedMarker(null)}
            >
              <Card>
                <CardBody>
                  <b>Pilot: </b>
                  {selectedMarker.pilot.pilot_id}{' '}
                  {selectedMarker.pilot.private_name}
                  <br />
                  <b>Route: </b>
                  {selectedMarker.departure_airport_id} -{' '}
                  {selectedMarker.destination_airport_id}
                  <br />
                  <b>Aircraft:</b>
                  <br />
                  {selectedMarker.is_rental
                    ? selectedMarker.rental.fleet.manufacturer
                    : selectedMarker.aircraft.fleet.manufacturer}
                  {selectedMarker.is_rental
                    ? selectedMarker.rental.fleet.name
                    : selectedMarker.aircraft.fleet.name}
                  <br />
                  {selectedMarker.is_rental
                    ? selectedMarker.rental.registration
                    : selectedMarker.aircraft.registration}
                  <br />
                  <b>Altitude:</b> {selectedMarker.current_altitude} ft
                  <br />
                  <b>Ind. Speed:</b> {selectedMarker.current_indicated_speed}{' '}
                  kts
                  <br />
                  <b>Heading:</b> {selectedMarker.current_heading}&#176;
                  <br />
                </CardBody>
              </Card>
            </Popup>
          )}
        </Map>
      </Box>
    </>
  )
}

export default LiveFlightMap
