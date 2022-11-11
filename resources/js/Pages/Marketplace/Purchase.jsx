import React, { useState } from 'react'
import AppLayout from '../../Shared/AppLayout'
import { usePage } from '@inertiajs/inertia-react'
import axios from 'axios'
import { Inertia } from '@inertiajs/inertia'
import Card from '../../Shared/Elements/Card'
import CheckBox from '../../Shared/Elements/Forms/CheckBox'
import TextInput from '../../Shared/Elements/Forms/TextInput'

const Purchase = ({ aircraft, purchaseType }) => {
  const { auth, errors } = usePage().props
  const [deliver, setDeliver] = useState(false)
  const [price, setPrice] = useState(0.00)
  const [error, setError] = useState(null)
  const [airport, setAirport] = useState(null)
  const [icao, setIcao] = useState('')
  const [deliveryLocation, setDeliveryLocation] = useState(aircraft.hq)
  // const [distance, setDistance] = useState(null)
  const [hub, setHub] = useState(null)
  const [hubError, setHubError] = useState(null)
  const [reg, setReg] = useState(purchaseType === 'new' ? null : aircraft.registration)
  const [regError, setRegError] = useState(null)
  // const [showFinanceCalc, setShowFinanceCalc] = useState(false)
  const [basePrice] = useState(purchaseType === 'new' ? aircraft.new_price : aircraft.sale_price)

  const handleDeliveryChange = (e) => {
    setDeliver(e.target.checked)
    setError(null)
    setAirport(null)
    setDeliveryLocation(aircraft.hq)
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
        const priceResp = await axios.get(`/api/jumpseat/cost/${aircraft.hq}/${response.data.airport.identifier}`)
        if (priceResp.status === 200) {
          const p = (priceResp.data.cost * 10)
          setPrice(parseFloat(p))
          // setDistance(priceResp.data.distance)
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
    setRegError(null)
    if (e.target.value.length > 8) {
      setRegError('Registration cannot be more than 8 characters')
      return
    }
    setReg(e.target.value)
  }

  const purchase = () => {
    setError(null)
    setHubError(null)
    setRegError(null)

    if (reg == null || reg.length > 7) {
      setRegError('Registration must be at least 1 character and no more than 7')
      return
    }
    if (hub == null) {
      setHubError('Please enter home hub ICAO')
      return
    }

    const total = parseFloat(aircraft.new_price) + parseFloat(price)

    if (total > auth.user.balance) {
      window.alert('You do not have sufficient funds')
      return
    }
    const data = {
      total,
      id: aircraft.id,
      deliveryIcao: purchaseType === 'new' ? deliveryLocation : aircraft.hq,
      hub,
      reg,
      purchaseType
    }
    Inertia.post('/marketplace/purchase', data)
  }

  return (
    <div>
      <div className="text-lg">Purchase New - {aircraft.manufacturer} {aircraft.name}</div>
      <div className="mt-2">
        <Card title="Invoice">
        {purchaseType === 'new' && (
          <>
          <div className="flex justify-start items-center space-x-2">
            <CheckBox id="delivery" checked={deliver} onChange={handleDeliveryChange} label="Deliver?" />
            {deliver && (
              <div className="flex justify-start items-center">
                <TextInput id="dep" placeHolder="Deliver to ICAO" type="text" value={icao} onChange={handleChange} inline />
              </div>
            )}
            {airport &&
            <div className="text-sm mt-1">{airport}</div>
            }
            {error && <div className="text-sm text-error mt-1">{error}</div>}
          </div>
          {!deliver && <div className="mt-2">Deliver to {aircraft.hq}</div>}
          {deliver && airport && <div className="mt-2">Deliver from: {aircraft.hq} to: {airport}</div>}
          </>
        )}
        <div className="w-1/4">
          <TextInput id="hub" type="text" value={hub} onChange={handleHubChange} error={hubError} label="Home Hub (ICAO)" />
          <TextInput id="reg" type="text" value={reg} onChange={handleRegChange} placeHolder="N1234A" error={regError} label="Registration" />
        </div>

        <div className="my-4">
          <div className="flex justify-between"><span>Base Price</span><span>${basePrice}</span></div>
          <div className="flex justify-between"><span>Delivery</span><span>${price.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Total</span><span>${(parseFloat(basePrice) + parseFloat(price)).toFixed(2).toLocaleString()}</span></div>
        </div>
          <button onClick={() => purchase()} className="btn btn-primary">Purchase</button>
        {errors.reg && <span className="text-sm text-error my-2">The aircraft registration has already exists</span>}
        </Card>
      </div>
    </div>
  )
}

Purchase.layout = page => <AppLayout children={page} title="Marketplace - Invoice" heading="Marketplace - Invoice" />

export default Purchase
