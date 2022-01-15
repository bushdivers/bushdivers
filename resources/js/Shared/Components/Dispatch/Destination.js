import React, { useState } from 'react'
import axios from 'axios'

const Destination = (props) => {
  const [airportError, setAirportError] = useState(null)
  const [distance, setDistance] = useState(null)
  const [airport, setAirport] = useState('')
  const [icao, setIcao] = useState('')

  async function handleDestinationChange (e) {
    setAirportError(null)
    setAirport(null)
    setIcao(e.target.value)
    if (e.target.value.length >= 3) {
      const response = await axios.get(`/api/airport/search/${e.target.value}`)
      if (response.data.airport) {
        setAirport(`${response.data.airport.identifier} - ${response.data.airport.name}`)
        props.updateDestinationValue(response.data.airport.identifier)
        setAirportError(null)
        const disResp = await axios.get(`/api/flights/distance/${props.currentAirport}/${response.data.airport.identifier}`)
        if (disResp.status === 200) {
          setDistance(disResp.data.distance)
        } else {
          setAirportError('Cannot calculate distance')
        }
      } else {
        props.updateDestinationValue('')
        setAirportError('No airport found')
      }
    }
  }

  return (
    <div className="shadow rounded p-4 mt-2 mr-2 bg-white">
      Destination (ICAO):
      <div className="w-1/4">
        <input id="icao" type="text" className="form-input form" value={icao} onChange={handleDestinationChange} />
      </div>
      {airport && <div className="text-sm mt-1">{airport}</div>}
      {distance && <span className="text-sm">Distance: {distance.toLocaleString(navigator.language)}nm</span>}
      {airportError && <div className="text-sm text-red-500 mt-1">{airportError}</div>}
    </div>
  )
}

export default Destination
