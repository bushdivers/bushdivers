import React, { useEffect, useRef } from 'react'
import PageTitle from '../../Shared/Navigation/PageTitle'
import Layout from '../../Shared/Layout'
import maplibre from 'maplibre-gl'

const accessToken = 'pk.eyJ1IjoicnVzc2VsbHd3ZXN0IiwiYSI6ImNrc29vZm5paDEweGIzMnA3MXAzYTFuMDQifQ.7veU-ARmzYClHDFsVQvT5g'

const RouteMap = ({ flights }) => {
  const mapContainer = useRef(null)
  const map = useRef(null)

  useEffect(() => {
    if (map.current) return
    map.current = new maplibre.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [143.23070, -6.36188],
      zoom: 6,
      accessToken
    })
  })

  useEffect(() => {
    if (flights) {
      map.current.on('load', function () {
        const coords = []
        flights.forEach((flight) => {
          const depLngLat = [flight.dep_airport.lon, flight.dep_airport.lat]
          const arrLngLat = [flight.arr_airport.lon, flight.arr_airport.lat]
          coords.push([depLngLat, arrLngLat])

          const depPopup = new maplibre.Popup({ offset: 25 }).setText(
            flight.dep_airport_id
          )

          const arrPopup = new maplibre.Popup({ offset: 25 }).setText(
            flight.arr_airport_id
          )

          const depMarkerColor = flight.dep_airport.is_hub ? '#F97316' : '#ffffff'
          const arrMarkerColor = flight.arr_airport.is_hub ? '#F97316' : '#ffffff'

          const dep = new maplibre.Marker({
            color: depMarkerColor,
            scale: 0.5
          })
            .setLngLat(depLngLat)
            .setPopup(depPopup)
            .addTo(map.current)

          const arr = new maplibre.Marker({
            color: arrMarkerColor,
            scale: 0.5
          })
            .setLngLat(arrLngLat)
            .setPopup(arrPopup)
            .addTo(map.current)
        })

        // const depLngLat = [flights[0].dep_airport.lon, flights[0].dep_airport.lat]
        // const arrLngLat = [flights[0].arr_airport.lon, flights[0].arr_airport.lat]

        map.current.addSource('routes', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'MultiLineString',
              coordinates: coords
            }
          }
        })

        // coords = JSON.stringify(coords)
        // const newc = JSON.parse(coords)

        map.current.addLayer({
          id: 'routes',
          type: 'line',
          source: 'routes',
          paint: {
            'line-color': '#F97316',
            'line-width': 2,
            'line-opacity': 0.6
          }
        })
      })
    }
  }, [flights])

  return (
    <div>
      <PageTitle title="Route Map" />
      <div ref={mapContainer} className="map-container-xl" />
    </div>
  )
}

RouteMap.layout = page => <Layout children={page} title="Route Map" />

export default RouteMap
