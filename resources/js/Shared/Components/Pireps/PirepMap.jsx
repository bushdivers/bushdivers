import React, { useRef, useEffect, useState } from 'react'
import maplibre from 'maplibre-gl'
import { parseMapStyle } from '../../../Helpers/general.helpers'

const accessToken = 'pk.eyJ1IjoicnVzc2VsbHd3ZXN0IiwiYSI6ImNrc29vZm5paDEweGIzMnA3MXAzYTFuMDQifQ.7veU-ARmzYClHDFsVQvT5g'

const PirepMap = (props) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [flight, setFlight] = useState({})

  useEffect(() => {
    if (map.current) return
    map.current = new maplibre.Map({
      container: mapContainer.current,
      style: parseMapStyle(props.mapStyle),
      center: [props.pirep.arr_airport.lon, props.pirep.arr_airport.lat],
      zoom: 5,
      accessToken
    })
  })

  useEffect(() => {
    if (props.pirep) {
      // setFlight(props.pirep.flight)

      const depPopup = new maplibre.Popup({ offset: 25 }).setText(
        props.pirep.departure_airport_id
      )

      const arrPopup = new maplibre.Popup({ offset: 25 }).setText(
        props.pirep.destination_airport_id
      )

      const depLngLat = [props.pirep.dep_airport.lon, props.pirep.dep_airport.lat]
      const arrLngLat = [props.pirep.arr_airport.lon, props.pirep.arr_airport.lat]

      map.current.on('load', function () {
        const dep = new maplibre.Marker({
          color: '#22C55E'
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

        const coords = []
        props.coords.map((log) => (
          coords.push(new maplibre.LngLat(log.lon, log.lat).toArray())
        ))

        // coords = JSON.stringify(coords)
        // const newc = JSON.parse(coords)

        console.log(coords)

        map.current.addSource('coords', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'MultiLineString',
              coordinates: [
                coords
              ]
            }
          }
        })

        map.current.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          paint: {
            'line-color': '#fff',
            'line-width': 4,
            'line-opacity': 0.6
          }
        })

        map.current.addLayer({
          id: 'coords',
          type: 'line',
          source: 'coords',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#F97316',
            'line-width': 4,
            'line-opacity': 0.6
          }
        })
      })

      const bounds = [depLngLat, arrLngLat]
      map.current.fitBounds(bounds, {
        padding: 80
      })
    }
  }, [props.pirep])

  return (
    <>
      <div ref={mapContainer} className={('map-container-' + props.size)} />
    </>
  )
}

export default PirepMap
