import React, { useRef, useEffect } from 'react'
import maplibre from 'maplibre-gl'

const accessToken = 'pk.eyJ1IjoicnVzc2VsbHd3ZXN0IiwiYSI6ImNrc29vZm5paDEweGIzMnA3MXAzYTFuMDQifQ.7veU-ARmzYClHDFsVQvT5g'

const CrewMap = (props) => {
  const mapContainer = useRef(null)
  const map = useRef(null)

  useEffect(() => {
    if (map.current) return
    map.current = new maplibre.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [0, 0],
      zoom: 1,
      accessToken
    })
  })

  useEffect(() => {
    if (props.locations) {
      map.current.on('load', function () {
        props.locations.forEach((location) => {
          const locationLonLat = [location.lon, location.lat]
          console.log(locationLonLat)
          const locationPopup = new maplibre.Popup({ offset: 25 }).setText(
            location.identifier
          )

          const ap = new maplibre.Marker({
            color: '#F97316',
            scale: 0.5
          })
            .setLngLat(locationLonLat)
            .setPopup(locationPopup)
            .addTo(map.current)
        })
      })
    }
  }, [props.locations])

  return (
    <>
      <div ref={mapContainer} className={('map-container-' + props.size)} />
    </>
  )
}

export default CrewMap
