import React, { useRef, useEffect } from 'react'
import maplibre from 'maplibre-gl'
import { parseMapStyle } from '../../../Helpers/general.helpers'

const accessToken = 'pk.eyJ1IjoicnVzc2VsbHd3ZXN0IiwiYSI6ImNrc29vZm5paDEweGIzMnA3MXAzYTFuMDQifQ.7veU-ARmzYClHDFsVQvT5g'

const HubMap = (props) => {
  const mapContainer = useRef(null)
  const map = useRef(null)

  useEffect(() => {
    if (map.current) return
    map.current = new maplibre.Map({
      container: mapContainer.current,
      style: parseMapStyle(props.mapStyle),
      center: [165.272614, 29.530900],
      zoom: 2,
      accessToken
    })
  })

  useEffect(() => {
    console.log(props.hubs)
    if (props.hubs) {
      map.current.on('load', function () {
        props.hubs.forEach((hub) => {
          const hubLonLat = [hub.lon, hub.lat]
          console.log(hubLonLat)
          const locationPopup = new maplibre.Popup({ offset: 25 }).setHTML(`
            <b>ICAO:</b> ${hub.identifier}<br/>
            <b>Name:</b> ${hub.name}<br/>
            <b>Alitude:</b> ${hub.altitude}ft<br/>
            <b>Longest Runway Length:</b> ${hub.longest_runway_length}ft
         `)

          const ap = new maplibre.Marker({
            color: '#F97316'
          })
            .setLngLat(hubLonLat)
            .setPopup(locationPopup)
            .addTo(map.current)
        })
      })
    }
  }, [])

  return (
    <>
      <div ref={mapContainer} className={('map-container-' + props.size)} />
    </>
  )
}

export default HubMap
