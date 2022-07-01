import React, { useRef, useEffect } from 'react'
import maplibre from 'maplibre-gl'

const accessToken = 'pk.eyJ1IjoicnVzc2VsbHd3ZXN0IiwiYSI6ImNrc29vZm5paDEweGIzMnA3MXAzYTFuMDQifQ.7veU-ARmzYClHDFsVQvT5g'

const FleetMap = (props) => {
  const mapContainer = useRef(null)
  const map = useRef(null)

  useEffect(() => {
    if (map.current) return
    map.current = new maplibre.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [143.23070, -6.36188],
      zoom: 5,
      accessToken
    })
  })

  useEffect(() => {
    console.log(props.aircraft)
    if (props.aircraft) {
      map.current.on('load', function () {
        props.aircraft.forEach((a) => {
          const hubLonLat = [a.location.lon, a.location.lat]
          console.log(hubLonLat)
          const locationPopup = new maplibre.Popup({ offset: 25 }).setHTML(`
            <b>Aircraft:</b> ${a.fleet.manufacturer} ${a.fleet.name} (${a.fleet.icao})<br/>
            <b>Reg:</b> ${a.registration}<br/>
            <b>Fuel:</b> ${a.fuel_onboard} gal<br/>
            <b>Location:</b> ${a.current_airport_id} - ${a.location.name}
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

export default FleetMap
