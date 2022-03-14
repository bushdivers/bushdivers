import React, { useRef, useEffect } from 'react'
import maplibre from 'maplibre-gl'
import { useInterval } from '../../../Helpers/useInterval'
import axios from 'axios'
import { parseMapStyle } from '../../../Helpers/general.helpers'

const accessToken = 'pk.eyJ1IjoicnVzc2VsbHd3ZXN0IiwiYSI6ImNrc29vZm5paDEweGIzMnA3MXAzYTFuMDQifQ.7veU-ARmzYClHDFsVQvT5g'

const LiveFlightMap = ({ size, updateFlightCount, mapStyle }) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const markers = useRef([])
  // const [flights, setFlights] = useState([])

  useInterval(async () => {
    await loadMarkers()
  }, 30000)

  const loadMarkers = async () => {
    let flights = []
    if (markers.current.length > 0) {
      await markers.current.forEach((marker) => marker.remove())
      markers.current = []
    }
    const res = await axios.get('/api/liveflights')
    if (res.status === 200) {
      flights = res.data.flights
    }

    updateFlightCount(flights.length)

    flights.forEach(f => {
      const flightLngLat = [f.current_lon, f.current_lat]

      const flightPopup = new maplibre.Popup({ offset: 25 })
        .setHTML(`
            <b>Pilot:</b> ${f.pilot.pilot_id} ${f.pilot.private_name}<br/>
            <b>Route:</b> ${f.departure_airport_id} - ${f.destination_airport_id}<br/>
            <b>Aircraft:</b><br/>
            ${f.is_rental ? f.rental.fleet.manufacturer : f.aircraft.fleet.manufacturer}
            ${f.is_rental ? f.rental.fleet.name : f.aircraft.fleet.name}
            <br/>
            ${f.is_rental ? f.rental.registration : f.aircraft.registration}<br/>
            <b>Altitude:</b> ${f.current_altitude} ft<br/>
            <b>Ground Speed:</b> ${f.current_indicated_speed} kts<br/>
            <b>Heading:</b> ${f.current_heading}&#176;<br/>
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
      style: parseMapStyle(mapStyle),
      // center: [143.23070, -6.36188],
      center: [165.272614, 29.530900],
      zoom: 2,
      accessToken
    })

    await map.current.on('load', function () {
      loadMarkers()
    })
  }, [])

  // useEffect(() => {
  //   loadMarkers()
  // }, [flights])

  return (
    <>
      <div ref={mapContainer} className={('map-container-' + size)} />
    </>
  )
}

export default LiveFlightMap
