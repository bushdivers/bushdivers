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
  }

  useEffect(() => {
    updateFlightCount(flights.length)
  }, [flights])

  useEffect(() => {
    async function asyncSetup() {
      await loadMarkers()
    }

    asyncSetup()
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
