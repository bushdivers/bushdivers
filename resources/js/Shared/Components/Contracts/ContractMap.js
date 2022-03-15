import React, { useEffect, useRef, useState } from 'react'
import maplibre from 'maplibre-gl'
import { parseMapStyle } from '../../../Helpers/general.helpers'

const accessToken = 'pk.eyJ1IjoicnVzc2VsbHd3ZXN0IiwiYSI6ImNrc29vZm5paDEweGIzMnA3MXAzYTFuMDQifQ.7veU-ARmzYClHDFsVQvT5g'

const ContractMap = (props) => {
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
    if (props.departure) {
      if (sourceSet) {
        map.current.removeLayer('route')
        map.current.removeSource('route')
        setSourceSet(false)
      }
      if (marker.current !== null) {
        marker.current.remove()
      }
      const depLngLat = [props.departure.lon, props.departure.lat]
      loadDeparture(depLngLat)
    }
  }, [props.departure])

  useEffect(() => {
    if (props.destination) {
      let depLngLat = []
      let arrLngLat = []

      if (sourceSet) {
        map.current.removeLayer('route')
        map.current.removeSource('route')
        setSourceSet(false)
      }

      if (props.destination !== null) {
        depLngLat = [props.departure.lon, props.departure.lat]
        arrLngLat = [props.destination.lon, props.destination.lat]

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
          loadDestination(arrLngLat)
          setSourceSet(true)

          const bounds = [depLngLat, arrLngLat]
          map.current.fitBounds(bounds, {
            padding: { top: 70, bottom: 70, right: 70, left: 500 }
          })
        }
      }
    }
  }, [props.destination])

  const loadDestination = (arrLngLat) => {
    if (marker.current !== null) {
      marker.current.remove()
    }

    const arrPopup = new maplibre.Popup({ offset: 25 }).setText(
      `${props.destination.identifier} - ${props.destination.name}`
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
      `${props.departure.identifier} - ${props.departure.name}`
    )

    const dep = new maplibre.Marker({
      color: '#059669'
    }).setLngLat(depLngLat)
      .setPopup(depPopup)
      .addTo(map.current)

    depMarker.current = dep
    map.current.setCenter(depLngLat)
  }

  return (
    <>
      <div ref={mapContainer} className={('map-container-' + props.size)} />
    </>
  )
}

export default ContractMap
