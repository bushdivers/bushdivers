import React, { useEffect, useRef, useState } from 'react'
import maplibre from 'maplibre-gl'
import { parseMapStyle } from '../../../Helpers/general.helpers'

const accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const MyContractMap = ({ data, size, mapStyle }) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const marker = useRef(null)
  const depMarker = useRef(null)
  const [sourceSet, setSourceSet] = useState(false)

  useEffect(() => {
    if (map.current) return
    map.current = new maplibre.Map({
      container: mapContainer.current,
      style: parseMapStyle(mapStyle),
      center: [143.23070, -6.36188],
      zoom: 10,
      accessToken
    })
  })

  useEffect(() => {
    if (data) {
      let depLngLat = []
      let arrLngLat = []

      if (sourceSet) {
        map.current.removeLayer('route')
        map.current.removeSource('route')
        setSourceSet(false)
      }

      depLngLat = [data.dep_airport.lon, data.dep_airport.lat]
      arrLngLat = [data.arr_airport.lon, data.arr_airport.lat]

      if (map.current.isStyleLoaded()) {
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

        const bounds = [depLngLat, arrLngLat]
        map.current.fitBounds(bounds, {
          padding: 140
        })

        setSourceSet(true)
      }

      loadDeparture(depLngLat)
      loadDestination(arrLngLat)
    }
  }, [data])

  const loadDestination = (arrLngLat) => {
    if (marker.current !== null) {
      marker.current.remove()
    }

    const arrPopup = new maplibre.Popup({ offset: 25 }).setText(
      `${data.arr_airport.identifier} - ${data.arr_airport.name}`
    )

    const des = new maplibre.Marker({
      color: '#F97316'
    }).setLngLat(arrLngLat)
      .setPopup(arrPopup)
      .addTo(map.current)

    marker.current = des
  }

  const loadDeparture = (depLngLat) => {
    if (depMarker.current !== null) {
      depMarker.current.remove()
    }

    const depPopup = new maplibre.Popup({ offset: 25 }).setText(
      `${data.dep_airport.identifier} - ${data.dep_airport.name}`
    )

    const dep = new maplibre.Marker({
      color: '#059669'
    }).setLngLat(depLngLat)
      .setPopup(depPopup)
      .addTo(map.current)

    depMarker.current = dep
  }

  return (
    <>
      <div ref={mapContainer} className={`map-container-${size}`} />
    </>
  )
}

export default MyContractMap
