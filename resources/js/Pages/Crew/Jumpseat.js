import React, { useEffect, useState } from 'react'
import PageTitle from '../../Shared/Navigation/PageTitle'
import Layout from '../../Shared/Layout'
import { Inertia } from '@inertiajs/inertia'
import axios from 'axios'

const Jumpseat = ({ user, spent }) => {
  const [airport, setAirport] = useState('')
  const [icao, setIcao] = useState('')
  const [transfer, setTransfer] = useState('')
  const [error, setError] = useState(null)
  const [distance, setDistance] = useState(null)
  const [price, setPrice] = useState(null)

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
    if (user.account_balance < price) {
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
    setPrice(null)
    setDistance(null)
  }

  return (
    <div>
      <PageTitle title="Jumpseat" />
      <div className="flex justify-between">
        <div className="w-1/2 rounded shadow p-4 mx-2 mt-4 bg-white">
          <div className="flex justify-between">
            <div className="w-1/2">
              <div>Current Location:</div>
              <div className="text-lg">{user.location.identifier} - {user.location.name}</div>
            </div>
            <div className="w-1/2">
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
                <div>{distance} nm</div>
              </div>
            )}
            {price && (
            <div className="w-1/2 mx-4 text-center">
              <div>Price</div>
              <div>${price}</div>
            </div>
            )}
          </div>
          <div className="flex justify-center mt-12">
            <button className="btn btn-primary" onClick={() => processJumpseat()}>Purchase Ticket</button>
          </div>
        </div>
        <div className="w-1/4 rounded shadow p-4 mx-2 mt-4 bg-white flex justify-center items-center">
          <div className="flex flex-col text-center">
            <div>Current Balance</div>
            <div className="text-xl mt-2">${user.account_balance}</div>
          </div>
        </div>
        <div className="w-1/4 rounded shadow p-4 mx-2 mt-4 bg-white flex justify-center items-center">
          <div className="flex flex-col text-center">
            <div>Spent on Jumpseats</div>
            <div className="text-xl mt-2">${spent}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

Jumpseat.layout = page => <Layout title="Jumpseat" children={page} />

export default Jumpseat
