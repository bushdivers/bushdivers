import { Box, Image, useColorMode } from '@chakra-ui/react'
import { usePage } from '@inertiajs/react'
import axios from 'axios'
import { useAtom } from 'jotai'
import maplibre from 'maplibre-gl'
import React, { useEffect, useState } from 'react'
import Map, { Marker } from 'react-map-gl'

import {
  mapboxToken,
  parseMapStyle,
  transformRequest,
} from '../../helpers/geo.helpers'
import { useInterval } from '../../hooks/useInterval'
import { selectedFlightAtom } from '../../state/flight.state.js'
import FlightDetails from './FlightDetails.jsx'
import FlightTrail from './FlightTrail.jsx'

const renderAircraftIcon = (flight) => {
  if (flight.status === 0) {
    return 'https://d1z4ruc262gung.cloudfront.net/assets/bd_flight_gray.png'
  } else if (flight.tour_id) {
    return 'https://d1z4ruc262gung.cloudfront.net/assets/bd_flight_black.png'
  } else {
    return 'https://d1z4ruc262gung.cloudfront.net/assets/bd_flight_white.png'
  }
}
const LiveFlightMap = () => {
  const { colorMode } = useColorMode()
  const { auth } = usePage().props
  const [selectedFlight, setSelectedFlight] = useAtom(selectedFlightAtom)

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
    async function asyncSetup() {
      await loadMarkers()
    }

    asyncSetup()
  }, [])

  return (
    <>
      <Box position="relative" className="map-container-full">
        <Map
          mapLib={maplibre}
          mapboxAccessToken={mapboxToken}
          initialViewState={{
            longitude: auth.user.location.lon,
            latitude: auth.user.location.lat,
            zoom: 4,
          }}
          mapStyle={parseMapStyle(colorMode)}
          transformRequest={transformRequest}
        >
          {selectedFlight && <FlightTrail />}
          {flights.length > 0 &&
            flights.map((flight) => (
              <Marker
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  e.originalEvent.stopPropagation()
                  setSelectedFlight(flight)
                }}
                key={flight.id}
                color="#f97316"
                scale={0.75}
                longitude={flight.current_lon}
                latitude={flight.current_lat}
                anchor="center"
                rotation={flight.current_heading}
              >
                <Image boxSize="30px" src={renderAircraftIcon(flight)} />
              </Marker>
            ))}
          <FlightDetails flights={flights} />
        </Map>
      </Box>
    </>
  )
}

export default LiveFlightMap
