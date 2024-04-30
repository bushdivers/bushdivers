import { useAtomValue } from 'jotai'
import React, { useEffect, useState } from 'react'
import { Layer, Marker, Source } from 'react-map-gl'

import { selectedFlightAtom } from '../../state/flight.state.js'

const FlightTrail = () => {
  const selectedFlight = useAtomValue(selectedFlightAtom)
  const [flightRoute, setFlightRoute] = useState(null)

  useEffect(() => {
    let pirepFlight = null
    if (selectedFlight.logs?.length > 0) {
      const coords = []
      selectedFlight.logs.map((log) => coords.push([log.lon, log.lat]))

      pirepFlight = {
        type: 'Feature',
        id: 'coords',
        geometry: { type: 'LineString', coordinates: coords },
      }
      setFlightRoute(pirepFlight)
    }
  }, [selectedFlight])

  return (
    <>
      <Marker
        color="#F97316"
        longitude={selectedFlight?.arr_airport.lon}
        latitude={selectedFlight?.arr_airport.lat}
      />
      <Marker
        color="#22C55E"
        longitude={selectedFlight?.dep_airport.lon}
        latitude={selectedFlight?.dep_airport.lat}
      />
      <Source id="live-flight" type="geojson" data={flightRoute}>
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
            'line-width': 3,
          }}
        />
      </Source>
    </>
  )
}

export default FlightTrail
