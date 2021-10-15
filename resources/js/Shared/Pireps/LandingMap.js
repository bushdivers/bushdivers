import React, { useRef, useEffect, useState } from 'react'
import maplibre from 'maplibre-gl'

const accessToken = 'pk.eyJ1IjoicnVzc2VsbHd3ZXN0IiwiYSI6ImNrc29vZm5paDEweGIzMnA3MXAzYTFuMDQifQ.7veU-ARmzYClHDFsVQvT5g'

const LandingMap = (props) => {
  const mapContainer = useRef(null)
  const map = useRef(null)

  useEffect(() => {
    if (map.current) return
    map.current = new maplibre.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [props.pirep.landing_lon, props.pirep.landing_lat],
      zoom: 16,
      accessToken
    })
  })

  useEffect(() => {
    if (props.pirep) {
      // setFlight(props.pirep.flight)

      const landingLngLat = [props.pirep.landing_lon, props.pirep.landing_lat]

      map.current.on('load', function () {
        const landing = new maplibre.Marker({
          color: '#22C55E'
        })
          .setLngLat(landingLngLat)
          .addTo(map.current)
      })
    }
  }, [props.pirep])

  return (
    <>
      <div ref={mapContainer} className={('map-container-' + props.size)} />
    </>
  )
}

export default LandingMap
