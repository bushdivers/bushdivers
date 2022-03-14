import React, { useRef, useEffect, useState } from 'react'
import maplibre from 'maplibre-gl'
import { parseMapStyle } from '../../../Helpers/general.helpers'

const accessToken = 'pk.eyJ1IjoicnVzc2VsbHd3ZXN0IiwiYSI6ImNrc29vZm5paDEweGIzMnA3MXAzYTFuMDQifQ.7veU-ARmzYClHDFsVQvT5g'

const AircraftMap = (props) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [aircraft, setAircraft] = useState({})

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
      setAircraft(props.aircraft)

      const aircraftLngLat = [props.aircraft.last_lon, props.aircraft.last_lat]

      map.current.on('load', function () {
        const ap = new maplibre.Marker({
          color: '#F97316'
        })
          .setLngLat(aircraftLngLat)
          .addTo(map.current)
      })
    }
  }, [props.aircraft])

  return (
    <>
      <div ref={mapContainer} className={('map-container-' + props.size)} />
    </>
  )
}

export default AircraftMap
