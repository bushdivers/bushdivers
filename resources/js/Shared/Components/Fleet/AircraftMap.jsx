import React, { useRef, useEffect } from 'react'
import maplibre from 'maplibre-gl'
import { parseMapStyle } from '../../../Helpers/general.helpers'

const accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const AircraftMap = (props) => {
  const mapContainer = useRef(null)
  const map = useRef(null)

  useEffect(() => {
    if (map.current) return
    map.current = new maplibre.Map({
      container: mapContainer.current,
      style: parseMapStyle(props.mapStyle),
      center: [props.aircraft.last_lon, props.aircraft.last_lat],
      zoom: 14,
      accessToken
    })
  })

  useEffect(() => {
    if (props.aircraft) {
      const aircraftLngLat = [props.aircraft.last_lon, props.aircraft.last_lat]

      map.current.on('load', function () {
        new maplibre.Marker({
          color: '#F97316'
        })
          .setLngLat(aircraftLngLat)
          .addTo(map.current)
      })
    }
  }, [props.aircraft])

  return (
    <>
      <div ref={mapContainer} className={`map-container-${props.size} rounded`} />
    </>
  )
}

export default AircraftMap
