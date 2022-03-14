import React, { useRef, useEffect, useState } from 'react'
import maplibre from 'maplibre-gl'
import { parseMapStyle } from '../../../Helpers/general.helpers'

const accessToken = 'pk.eyJ1IjoicnVzc2VsbHd3ZXN0IiwiYSI6ImNrc29vZm5paDEweGIzMnA3MXAzYTFuMDQifQ.7veU-ARmzYClHDFsVQvT5g'

const AirportMap = (props) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [airport, setAirport] = useState({})

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
      setAirport(props.airport)

      const airportLngLat = [props.airport.lon, props.airport.lat]

      map.current.on('load', function () {
        const ap = new maplibre.Marker({
          color: '#F97316'
        })
          .setLngLat(airportLngLat)
          .addTo(map.current)
      })
    }
  }, [props.airport])

  return (
    <>
      <div ref={mapContainer} className={('map-container-' + props.size)} />
    </>
  )
}

export default AirportMap
