import React, { useState } from 'react'
import AppLayout from '../../Shared/AppLayout'
import { usePage } from '@inertiajs/inertia-react'
import axios from 'axios'
import { Inertia } from '@inertiajs/inertia'

const PurchaseNew = ({ fleet }) => {
  const { auth } = usePage().props
  const [deliver, setDeliver] = useState(false)
  const [price, setPrice] = useState(0.00)
  const [error, setError] = useState(null)
  const [airport, setAirport] = useState(null)
  const [icao, setIcao] = useState('')
  const [deliveryLocation, setDeliveryLocation] = useState(fleet.hq)
  const [distance, setDistance] = useState(null)
  const [hub, setHub] = useState(null)
  const [hubError, setHubError] = useState(null)
  const [reg, setReg] = useState(null)
  const [regError, setRegError] = useState(null)

  const handleDeliveryChange = (e) => {
    setDeliver(e.target.checked)
    setError(null)
    setAirport(null)
    setDeliveryLocation(null)
    setIcao('')
    if (!e.target.checked) setPrice(0.00)
  }

  const handleChange = async (e) => {
    setError(null)
    setAirport(null)
    setIcao(e.target.value)
    if (e.target.value.length >= 3) {
      const response = await axios.get(`/api/airport/search/${e.target.value}`)
      if (response.data.airport) {
        setAirport(`${response.data.airport.identifier} - ${response.data.airport.name}`)
        setDeliveryLocation(response.data.airport.identifier)
        setError(null)
        const priceResp = await axios.get(`/api/jumpseat/cost/${fleet.hq}/${response.data.airport.identifier}`)
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

  const handleHubChange = (e) => {
    setHub(e.target.value)
  }

  const handleRegChange = (e) => {
    setReg(e.target.value)
  }

  const purchase = () => {
    setError(null)
    setHubError(null)
    setRegError(null)
    console.log(reg)
    const total = parseFloat(fleet.new_price) + parseFloat(price)
    if (reg == null || reg.length > 7) {
      setRegError('Registration must be at least 1 character and no more than 7')
      return
    }
    if (hub == null) {
      setHubError('Please enter home hub ICAO')
      return
    }
    if (total > auth.user.balance) {
      window.alert('You do not have sufficient funds')
    } else {
      const data = {
        total,
        fleetId: fleet.id,
        deliveryIcao: deliveryLocation,
        hub,
        reg
      }
      Inertia.post('/marketplace/purchase', data)
    }
  }

  return (
    <div className="p-4">
      <div className="text-lg">Purchase New - {fleet.manufacturer} {fleet.name}</div>
      <div className="mt-2 bg-white rounded shadow p-4">
        <div className="text-lg mb-2">Invoice</div>
        <div className="flex justify-start items-center space-x-2">
          <label htmlFor="delivery" className="inline-flex items-center">
            <input id="delivery" checked={deliver} onChange={handleDeliveryChange} type="checkbox" className="form-checkbox rounded border-gray-300 text-orange-500 shadow-sm focus:border-orange-300 focus:ring focus:ring-offset-0 focus:ring-orange-200 focus:ring-opacity-50" />
            <span className="text-gray-700 ml-2">Deliver?</span>
          </label>
          {deliver && (
            <div className="flex justify-start items-center">
              <input id="dep" placeholder="Deliver to ICAO" type="text" className="form-input form" value={icao} onChange={handleChange} />
            </div>
          )}
          {airport &&
            <div className="text-sm mt-1">{airport}</div>
          }
          {error && <div className="text-sm text-red-500 mt-1">{error}</div>}
        </div>
        {!deliver && <div>Deliver to {fleet.hq}</div>}
        {deliver && airport && <div>Deliver from: {fleet.hq} to: {airport}</div>}
        <div>
          <div className="flex justify-between"><span>Base Price</span><span>${fleet.new_price}</span></div>
          <div className="flex justify-between"><span>Delivery</span><span>${price.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Total</span><span>${(parseFloat(fleet.new_price) + parseFloat(price)).toFixed(2)}</span></div>
        </div>
        <div className="w-1/4">
          <div className="mt-2">
            <label htmlFor="hub"><span className="text-gray-700">Home Hub (ICAO)</span></label>
            <input id="hub" type="text" className="form-input form" value={hub} onChange={handleHubChange} />
            {hubError && <span className="text-sm text-red-500">{hubError}</span>}
          </div>
          <div className="mt-2">
            <label htmlFor="reg"><span className="text-gray-700">Registration</span></label>
            <input id="reg" type="text" className="form-input form" value={reg} onChange={handleRegChange} />
            {regError && <span className="text-sm text-red-500">{regError}</span>}
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={() => purchase()} className="btn btn-secondary">Purchase</button>
        </div>
      </div>
    </div>
  )
}

PurchaseNew.layout = page => <AppLayout children={page} title="Marketplace - Invoice" heading="Marketplace - Invoice" />

export default PurchaseNew
