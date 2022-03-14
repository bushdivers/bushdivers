import React, { useEffect, useRef, useState } from 'react'
import maplibre from 'maplibre-gl'
import { parseMapStyle } from '../../../Helpers/general.helpers'

const accessToken = 'pk.eyJ1IjoicnVzc2VsbHd3ZXN0IiwiYSI6ImNrc29vZm5paDEweGIzMnA3MXAzYTFuMDQifQ.7veU-ARmzYClHDFsVQvT5g'

const MyContractMap = (props) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const marker = useRef(null)
  const depMarker = useRef(null)
  const [sourceSet, setSourceSet] = useState(false)

  useEffect(() => {
    if (map.current) return
    map.current = new maplibre.Map({
      container: mapContainer.current,
      style: parseMapStyle(props.mapStyle),
      center: [143.23070, -6.36188],
      zoom: 9,
      accessToken
    })
  })

  useEffect(() => {
    if (props.data) {
      let depLngLat = []
      let arrLngLat = []

      if (sourceSet) {
        map.current.removeLayer('route')
        map.current.removeSource('route')
        setSourceSet(false)
      }

      depLngLat = [props.data.dep_airport.lon, props.data.dep_airport.lat]
      arrLngLat = [props.data.arr_airport.lon, props.data.arr_airport.lat]

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
          padding: 50
        })

        setSourceSet(true)
      }

      loadDeparture(depLngLat)
      loadDestination(arrLngLat)
    }
  }, [props.data])

  const loadDestination = (arrLngLat) => {
    if (marker.current !== null) {
      marker.current.remove()
    }

    const arrPopup = new maplibre.Popup({ offset: 25 }).setText(
      `${props.data.arr_airport.identifier} - ${props.data.arr_airport.name}`
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
      `${props.data.dep_airport.identifier} - ${props.data.dep_airport.name}`
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
      <div ref={mapContainer} className={('map-container-' + props.size)} />
    </>
  )
}

export default MyContractMap
