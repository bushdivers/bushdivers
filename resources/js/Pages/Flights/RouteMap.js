import React, { useEffect, useRef } from 'react'
import PageTitle from '../../Shared/Navigation/PageTitle'
import Layout from '../../Shared/Layout'
import maplibre from 'maplibre-gl'

const accessToken = 'pk.eyJ1IjoicnVzc2VsbHd3ZXN0IiwiYSI6ImNrc29vZm5paDEweGIzMnA3MXAzYTFuMDQifQ.7veU-ARmzYClHDFsVQvT5g'

const RouteMap = ({ flights, airports, hubs }) => {
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
    map.current.on('load', function () {
      if (hubs) {
        hubs.forEach((hub) => {
          const hubLngLat = [hub.lon, hub.lat]

          const hubPopup = new maplibre.Popup({ offset: 25 }).setText(
            `${hub.identifier} - ${hub.name}`
          )

          const hubMarker = new maplibre.Marker({
            color: '#F97316',
            scale: 0.5
          })
            .setLngLat(hubLngLat)
            .setPopup(hubPopup)
            .addTo(map.current)
        })
      }

      if (airports) {
        airports.forEach((airport) => {
          const markerLngLat = [airport.lon, airport.lat]

          const markerPopup = new maplibre.Popup({ offset: 25 }).setText(
            `${airport.identifier} - ${airport.name}`
          )

          const marker = new maplibre.Marker({
            color: '#ffffff',
            scale: 0.5
          })
            .setLngLat(markerLngLat)
            .setPopup(markerPopup)
            .addTo(map.current)
        })
      }

      if (flights) {
        const coords = []
        flights.forEach((flight) => {
          const depLngLat = [flight.dep_airport.lon, flight.dep_airport.lat]
          const arrLngLat = [flight.arr_airport.lon, flight.arr_airport.lat]
          coords.push([depLngLat, arrLngLat])
        })

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
      }
    })
  }, [])

  return (
    <div>
      <PageTitle title="Route Map" />
      <div className="rounded shadow p-4 mt-2 bg-white mx-2">
        <div ref={mapContainer} className="map-container-xl" />
      </div>
    </div>
  )
}

RouteMap.layout = page => <Layout children={page} title="Route Map" />

export default RouteMap
