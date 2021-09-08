import React, { useRef, useEffect, useState } from 'react'
import maplibre from 'maplibre-gl'

const accessToken = 'pk.eyJ1IjoicnVzc2VsbHd3ZXN0IiwiYSI6ImNrc29vZm5paDEweGIzMnA3MXAzYTFuMDQifQ.7veU-ARmzYClHDFsVQvT5g'

const PirepMap = (props) => {
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
    if (props.pirep.flight) {
      setFlight(props.pirep.flight)

      const depPopup = new maplibre.Popup({ offset: 25 }).setText(
        props.pirep.flight.dep_airport_id
      )

      const arrPopup = new maplibre.Popup({ offset: 25 }).setText(
        props.pirep.flight.arr_airport_id
      )

      const depLngLat = [props.pirep.flight.dep_airport.lon, props.pirep.flight.dep_airport.lat]
      const arrLngLat = [props.pirep.flight.arr_airport.lon, props.pirep.flight.arr_airport.lat]

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

        const plot = Object.keys(props.coords).map((key) => [Number(key), props.coords[key]])
        console.log(plot)
        map.current.addSource('log', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [
                [plot]
              ]
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

        map.current.addLayer({
          id: 'log',
          type: 'line',
          source: 'log',
          paint: {
            'line-color': '#fff',
            'line-width': 1
          }
        })
      })

      const bounds = [depLngLat, arrLngLat]
      map.current.fitBounds(bounds, {
        padding: 100
      })
    }
  }, [props.flight])

  return (
    <>
      <div ref={mapContainer} className={('map-container-' + props.size)} />
    </>
  )
}

export default PirepMap
