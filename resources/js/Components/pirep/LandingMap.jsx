import maplibre from 'maplibre-gl'
import React, { useEffect, useRef } from 'react'

import { mapboxToken, parseMapStyle } from '../../helpers/geo.helpers'

const LandingMap = (props) => {
  const mapContainer = useRef(null)
  const map = useRef(null)

  useEffect(() => {
    if (map.current) return
    map.current = new maplibre.Map({
      container: mapContainer.current,
      style: parseMapStyle(props.mapStyle),
      center: [props.pirep.landing_lon, props.pirep.landing_lat],
      zoom: 16,
      accessToken: mapboxToken,
    })
  })

  useEffect(() => {
    if (props.pirep) {
      // setFlight(props.pirep.flight)

      const landingLngLat = [props.pirep.landing_lon, props.pirep.landing_lat]

      map.current.on('load', function () {
        new maplibre.Marker({
          color: '#22C55E',
        })
          .setLngLat(landingLngLat)
          .addTo(map.current)
      })
    }
  }, [props.pirep])

  return (
    <>
      <div
        ref={mapContainer}
        className={`map-container-${props.size} rounded`}
      />
    </>
  )
}

export default LandingMap
