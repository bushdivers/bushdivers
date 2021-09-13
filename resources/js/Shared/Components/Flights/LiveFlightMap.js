import React, { useRef, useEffect, useState } from 'react'
import maplibre from 'maplibre-gl'
import { useInterval } from '../../../Helpers/useInterval'
import axios from 'axios'

const accessToken = 'pk.eyJ1IjoicnVzc2VsbHd3ZXN0IiwiYSI6ImNrc29vZm5paDEweGIzMnA3MXAzYTFuMDQifQ.7veU-ARmzYClHDFsVQvT5g'

const LiveFlightMap = (props) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const markers = useRef([])
  // const [flights, setFlights] = useState([])

  useInterval(async () => {
    await loadMarkers()
  }, 30000)

  const loadMarkers = async () => {
    let flights = []
    console.log(markers.current.length)
    if (markers.current.length > 0) {
      await markers.current.forEach((marker) => marker.remove())
      markers.current = []
    }
    const res = await axios.get('/api/liveflights')
    if (res.status === 200) {
      flights = res.data.flights
    }

    flights.forEach(f => {
      const flightLngLat = [f.current_lon, f.current_lat]

      const flightPopup = new maplibre.Popup({ offset: 25 })
        .setHTML(`
            <b>Pilot:</b> ${f.pilot.pilot_id} ${f.pilot.private_name}<br/>
            <b>Route:</b> ${f.flight.dep_airport_id} - ${f.flight.arr_airport_id}<br/>
            <b>Aircraft:</b><br/>
            ${f.aircraft.fleet.manufacturer} ${f.aircraft.fleet.name}<br/>
            ${f.aircraft.registration}<br/>
            <b>Altitude:</b> ${f.current_altitude} ft<br/>
            <b>Ground Speed:</b> ${f.current_ground_speed} kts<br/>
            <b>Vertical Speed:</b> ${f.current_vs} fpm<br/>
         `)
        // .setText(
        //   `${f.pilot.pilot_id} ${f.pilot.private_name} - ${f.flight.dep_airport_id} ${f.flight.arr_airport_id}`
        // )
      const el = document.createElement('img')
      el.className = 'marker'
      el.width = 30
      el.height = 30
      el.src = 'https://res.cloudinary.com/dji0yvkef/image/upload/v1631525263/BDVA/icon_c208_orangekFus_whiteWings_revnmm.png'

      const flightMarker = new maplibre.Marker(el, {
        rotation: f.current_heading
      })
        .setLngLat(flightLngLat)
        .setPopup(flightPopup)
        .addTo(map.current)

      markers.current.push(flightMarker)
    })
  }

  useEffect(async () => {
    if (map.current) return
    map.current = new maplibre.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [143.23070, -6.36188],
      zoom: 5,
      accessToken
    })

    await map.current.on('load', function () {
      console.log('loaded!')
      loadMarkers()
    })
  }, [])

  // useEffect(() => {
  //   loadMarkers()
  // }, [flights])

  return (
    <>
      <div ref={mapContainer} className={('map-container-' + props.size)} />
    </>
  )
}

export default LiveFlightMap
