import React, { useRef, useEffect, useState } from 'react'
import maplibre from 'maplibre-gl'

const accessToken = 'pk.eyJ1IjoicnVzc2VsbHd3ZXN0IiwiYSI6ImNrc29vZm5paDEweGIzMnA3MXAzYTFuMDQifQ.7veU-ARmzYClHDFsVQvT5g'

const FlightMap = (props) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [flight, setFlight] = useState({})

  useEffect(() => {
    if (map.current) return
    map.current = new maplibre.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [143.23070, -6.36188],
      zoom: 9,
      accessToken
    })
  })

  useEffect(() => {
    console.log(props.flight)
    if (props.flight) {
      setFlight(props.flight)

      const depPopup = new maplibre.Popup({ offset: 25 }).setText(
        props.flight.dep_airport_id
      )

      const arrPopup = new maplibre.Popup({ offset: 25 }).setText(
        props.flight.arr_airport_id
      )

      const depLngLat = [props.flight.dep_airport.lon, props.flight.dep_airport.lat]
      const arrLngLat = [props.flight.arr_airport.lon, props.flight.arr_airport.lat]

      map.current.on('load', function () {
        const dep = new maplibre.Marker({
          color: '#059669'
        })
          .setLngLat(depLngLat)
          .setPopup(depPopup)
          .addTo(map.current)

        const arr = new maplibre.Marker({
          color: '#F97316'
        })
          .setLngLat(arrLngLat)
          .setPopup(arrPopup)
          .addTo(map.current)

        map.current.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [depLngLat, arrLngLat]
            }
          }
        })
        map.current.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          paint: {
            'line-color': '#F97316',
            'line-width': 2
          }
        })
      })

      const bounds = [depLngLat, arrLngLat]
      map.current.fitBounds(bounds, {
        padding: { top: 25, bottom: 25, left: 25, right: 25 }
      })
    }
  }, [props.flight])

  return (
    <>
      <div ref={mapContainer} className="map-container-small" />
    </>
  )
}

export default FlightMap
