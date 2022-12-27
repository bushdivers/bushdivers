import React, { useState } from 'react'
import maplibre from 'maplibre-gl'
import { parseMapStyle, transformRequest } from '../../../Helpers/general.helpers'
import Map, { Marker, Popup } from 'react-map-gl'

const accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const CrewMap = (props) => {
  const [selectedMarker, setSelectedMarker] = useState(null)
  // const mapContainer = useRef(null)
  // const map = useRef(null)
  //
  // useEffect(() => {
  //   if (map.current) return
  //   map.current = new maplibre.Map({
  //     container: mapContainer.current,
  //     // style: 'mapbox://styles/mapbox/dark-v10',
  //     style: parseMapStyle(props.mapStyle),
  //     center: [145.0, -5.8],
  //     zoom: 4,
  //     accessToken
  //   })
  // })
  //
  // useEffect(() => {
  //   if (props.locations) {
  //     map.current.on('load', function () {
  //       props.locations.forEach((location) => {
  //         const locationLonLat = [location.lon, location.lat]
  //         console.log(locationLonLat)
  //         const locationPopup = new maplibre.Popup({ offset: 25 }).setText(`${location.identifier} ${location.name}`)
  //         //   .setHtml(
  //         //   `<h3>${location.identifier} ${location.name}</h3>`
  //         // )
  //
  //         new maplibre.Marker({
  //           color: '#F97316',
  //           scale: 0.5
  //         })
  //           .setLngLat(locationLonLat)
  //           .setPopup(locationPopup)
  //           .addTo(map.current)
  //       })
  //     })
  //   }
  // }, [props.locations])

  const handleClick = (loc) => {
    setSelectedMarker(loc)
  }

  return (
    <>
      <div className={`map-container-${props.size} relative`}>
        <Map
          mapLib={maplibre}
          mapboxAccessToken={accessToken}
          initialViewState={{
            longitude: 145.0,
            latitude: -5.8,
            zoom: 4
          }}
          mapStyle={parseMapStyle(props.mapStyle)}
          transformRequest={transformRequest}
        >
          {props.locations.length > 0 && props.locations.map((loc) => (
            <Marker onClick={(e) => {
              e.originalEvent.stopPropagation()
              handleClick(loc)
            }} key={loc.identifier} color="#f97316" scale={0.75} longitude={loc.lon} latitude={loc.lat} anchor="bottom" />
          ))}
          {selectedMarker && (
            <Popup longitude={Number(selectedMarker.lon)} latitude={Number(selectedMarker.lat)}
                   anchor="top"
                   onClose={() => setSelectedMarker(null)}
            >
              <p>{selectedMarker.identifier}</p>
            </Popup>
          )}
        </Map>
      </div>
      {/* <div ref={mapContainer} className={`map-container-${props.size} rounded relative overflow-hidden`} /> */}
    </>
  )
}

export default CrewMap
