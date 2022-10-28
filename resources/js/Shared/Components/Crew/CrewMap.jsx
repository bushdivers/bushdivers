import React, { useRef, useEffect } from 'react'
import maplibre from 'maplibre-gl'
import { parseMapStyle } from '../../../Helpers/general.helpers'

const accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const CrewMap = (props) => {
  const mapContainer = useRef(null)
  const map = useRef(null)

  useEffect(() => {
    if (map.current) return
    map.current = new maplibre.Map({
      container: mapContainer.current,
      // style: 'mapbox://styles/mapbox/dark-v10',
      style: parseMapStyle(props.mapStyle),
      center: [145.0, -5.8],
      zoom: 4,
      accessToken
    })
  })

  useEffect(() => {
    if (props.locations) {
      map.current.on('load', function () {
        props.locations.forEach((location) => {
          const locationLonLat = [location.lon, location.lat]
          console.log(locationLonLat)
          const locationPopup = new maplibre.Popup({ offset: 25 }).setText(`${location.identifier} ${location.name}`)
          //   .setHtml(
          //   `<h3>${location.identifier} ${location.name}</h3>`
          // )

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
      <div ref={mapContainer} className={`map-container-${props.size} rounded relative overflow-hidden`} />
    </>
  )
}

export default CrewMap
