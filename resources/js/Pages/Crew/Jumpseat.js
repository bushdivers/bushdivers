import React, { useState } from 'react'
import { Inertia } from '@inertiajs/inertia'
import axios from 'axios'
import AppLayout from '../../Shared/AppLayout'

const Jumpseat = ({ user, spent, balance }) => {
  const [airport, setAirport] = useState('')
  const [icao, setIcao] = useState('')
  const [transfer, setTransfer] = useState('')
  const [error, setError] = useState(null)
  const [distance, setDistance] = useState(null)
  const [price, setPrice] = useState(-1)

  const handleChange = async (e) => {
    setError(null)
    setAirport(null)
    setIcao(e.target.value)
    if (e.target.value.length >= 3) {
      const response = await axios.get(`/api/airport/search/${e.target.value}`)
      if (response.data.airport) {
        setAirport(`${response.data.airport.identifier} - ${response.data.airport.name}`)
        setTransfer(response.data.airport.identifier)
        setError(null)
        const priceResp = await axios.get(`/api/jumpseat/cost/${user.current_airport_id}/${response.data.airport.identifier}`)
        console.log(priceResp)
        if (priceResp.status === 200) {
          setPrice(priceResp.data.cost)
          setDistance(priceResp.data.distance)
        } else {
          setError('Cannot calculate price')
        }
      } else {
        setError('No airport found')
      }
    }
  }

  const processJumpseat = () => {
    if (!transfer) {
      setError('Please specify an airport to transfer to')
      return
    }
    if (balance < price) {
      setError('You do not have sufficient funds to transfer here')
      return
    }
    Inertia.post('/jumpseat', {
      cost: price,
      icao: transfer
    })
    setAirport('')
    setIcao('')
    setTransfer('')
    setPrice(-1)
    setDistance(null)
  }

  return (
    <div className="p-4">
      <div className="flex flex-col lg:flex-row justify-between">
        <div className="lg:w-1/2 rounded shadow p-4 mx-2 mt-4 bg-white">
          <div className="flex justify-between">
            <div className="w-1/2">
              <div>Current Location:</div>
              <div className="text-lg">{user.location.identifier} - {user.location.name}</div>
            </div>
            <div className="md:w-1/2">
              <label htmlFor="dep"><span className="text-gray-700">Transfer to (ICAO)</span></label>
              <input id="dep" type="text" className="form-input form" value={icao} onChange={handleChange} />
              {error && <div className="text-sm text-red-500 mt-1">{error}</div>}
              {airport && <div className="text-sm mt-1">{airport}</div>}
            </div>
          </div>
          <div className="flex mt-4">
            {distance && (
              <div className="w-1/2 mx-4 text-center">
                <div>Distance</div>
                <div>{distance.toLocaleString(navigator.language)} nm</div>
              </div>
            )}
            {price >= 0
              ? (
                  <div className="w-1/2 mx-4 text-center">
                    <div>Price</div>
                    <div>${price.toLocaleString(navigator.language)}</div>
                  </div>
                )
              : <></>
            }
          </div>
          <div className="flex justify-end mt-12">
            <button className="btn btn-primary" onClick={() => processJumpseat()}>Purchase Ticket</button>
          </div>
        </div>
        <div className="lg:w-1/4 rounded shadow p-4 mx-2 mt-4 bg-white flex justify-center items-center">
          <div className="flex flex-col text-center">
            <div>Current Balance</div>
            <div className="text-xl mt-2">${balance.toLocaleString(navigator.language)}</div>
          </div>
        </div>
        <div className="lg:w-1/4 rounded shadow p-4 mx-2 mt-4 bg-white flex justify-center items-center">
          <div className="flex flex-col text-center">
            <div>Spent on Jumpseats</div>
            <div className="text-xl mt-2">${spent.toLocaleString(navigator.language)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

Jumpseat.layout = page => <AppLayout title="Jumpseat" children={page} heading="Jumpseat" />

export default Jumpseat
