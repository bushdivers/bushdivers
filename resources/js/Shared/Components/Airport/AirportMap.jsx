import React, { useRef, useEffect } from 'react'
import maplibre from 'maplibre-gl'
import { parseMapStyle } from '../../../Helpers/general.helpers'

const accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const AirportMap = (props) => {
  const mapContainer = useRef(null)
  const map = useRef(null)

  useEffect(() => {
    if (map.current) return
    map.current = new maplibre.Map({
      container: mapContainer.current,
      style: parseMapStyle(props.mapStyle),
      center: [props.airport.lon, props.airport.lat],
      zoom: 14,
      accessToken
    })
  })

  useEffect(() => {
    if (props.airport) {
      const airportLngLat = [props.airport.lon, props.airport.lat]

      map.current.on('load', function () {
        new maplibre.Marker({
          color: '#F97316'
        })
          .setLngLat(airportLngLat)
          .addTo(map.current)
      })
    }
  }, [props.airport])

  return (
    <>
      <div ref={mapContainer} className={`map-container-${props.size} rounded`} />
    </>
  )
}

export default AirportMap
