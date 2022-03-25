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
  const [deposit, setDeposit] = useState(0.2 * fleet.new_price)
  const [term, setTerm] = useState(3)
  const [financeAmount, setFinanceAmount] = useState(0)
  const [monthlyPayments, setMonthlyPayments] = useState(0)
  const [showFinanceCalc, setShowFinanceCalc] = useState(false)
  const [financeCost, setFinanceCost] = useState(0)
  const [purchaseMethod, setPurchaseMethod] = useState('buy')

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
        if (priceResp.status === 200) {
          const p = (priceResp.data.cost * 10)
          setPrice(parseFloat(p))
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

  const handlePurchaseMethodChange = (e) => {
    const method = e.target.checked ? 'finance' : 'buy'
    setPurchaseMethod(method)
  }

  const handleDepositChange = (e) => {
    if (typeof e.target.value === 'string') {
      setDeposit(e.target.value === '' ? 0 : parseFloat(e.target.value))
    } else {
      setDeposit(e.target.value)
    }
  }

  const handleTermChange = (e) => {
    if (typeof e.target.value === 'string') {
      const val = e.target.value === '' ? 0 : parseFloat(e.target.value)
      setTerm(val < 3 ? 3 : parseFloat(e.target.value))
    } else {
      console.log(e.target.value)
      setTerm(e.target.value < 3 ? 3 : e.target.value)
    }
  }

  const calculate = () => {
    if (typeof deposit !== 'number') {
      setDeposit(0)
    }
    if (parseInt(term) < 3 || parseInt(term) > 24) {
      setTerm(3)
      window.alert('Term must be between 3 and 24 months')
      return
    }
    const subTotal = parseFloat(fleet.new_price) + parseFloat(price)
    // subtotal less deposit = principal
    const principal = subTotal - deposit
    const termInYears = term / 12
    const interestRate = 8 / 100
    const interest = (principal * interestRate * termInYears)
    const amount = (principal + interest).toFixed(2)
    const monthly = (amount / term).toFixed(2)
    setFinanceCost(interest)
    setFinanceAmount(amount)
    setMonthlyPayments(monthly)
    setShowFinanceCalc(true)
  }

  const purchase = (pMethod) => {
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

    const total = pMethod === 'buy' ? parseFloat(fleet.new_price) + parseFloat(price) : deposit

    if (total > auth.user.balance) {
      window.alert('You do not have sufficient funds')
      return
    }

    if (pMethod === 'buy') {
      const data = {
        total,
        fleetId: fleet.id,
        deliveryIcao: deliveryLocation,
        hub,
        reg
      }
      Inertia.post('/marketplace/purchase', data)
    } else if (pMethod === 'finance') {
      const data = {
        fleetId: fleet.id,
        deliveryIcao: deliveryLocation,
        hub,
        reg,
        deposit,
        financeAmount,
        term,
        monthlyPayments
      }
      Inertia.post('/marketplace/finance', data)
    }
  }

  return (
    <div className="p-4">
      <div className="text-lg">Purchase New - {fleet.manufacturer} {fleet.name} {purchaseMethod === 'finance' ? <span>- On Finance</span> : <></>}</div>
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
        {!deliver && <div className="mt-2">Deliver to {fleet.hq}</div>}
        {deliver && airport && <div className="mt-2">Deliver from: {fleet.hq} to: {airport}</div>}

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

        <div className="my-4">
          <div className="flex justify-between"><span>Base Price</span><span>${fleet.new_price}</span></div>
          <div className="flex justify-between"><span>Delivery</span><span>${price.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Total</span><span>${(parseFloat(fleet.new_price) + parseFloat(price)).toFixed(2)}</span></div>
        </div>

        <label htmlFor="method" className="inline-flex items-center">
          <input id="method" checked={purchaseMethod === 'finance'} onChange={handlePurchaseMethodChange} type="checkbox" className="form-checkbox rounded border-gray-300 text-orange-500 shadow-sm focus:border-orange-300 focus:ring focus:ring-offset-0 focus:ring-orange-200 focus:ring-opacity-50" />
          <span className="text-gray-700 ml-2">Finance purchase?</span>
        </label>

        {purchaseMethod === 'finance'
          ? (
            <div className="mt-4">
              <div className="text-lg">Finance Details</div>
              <div className="w-1/4">
                <div className="mt-2">
                  <label htmlFor="deposit"><span className="text-gray-700">Deposit amount</span></label>
                  <input id="deposit" type="text" className="form-input form" value={deposit} onChange={handleDepositChange} />
                </div>
                <div className="mt-2">
                  <label htmlFor="term"><span className="text-gray-700">Term (months) - min: 3; max: 24</span></label>
                  <input id="term" type="text" className="form-input form" value={term} onChange={handleTermChange} />
                </div>
                <button onClick={calculate} className="btn btn-primary mt-2">Calculate</button>
              </div>
              <div className="mt-2">
                <div className="flex justify-between"><span>Deposit (due now)</span><span>{deposit > 0 ? `$${(deposit)}` : '-'}</span></div>
                <div className="flex justify-between"><span>Monthly Payments</span><span>${monthlyPayments}</span></div>
                <div className="flex justify-between"><span>Total Amount Payable</span><span>${financeAmount}</span></div>
                <div className="flex justify-between"><span>Cost of Finance (interest @ 8%)</span><span>${(financeCost).toFixed(2)}</span></div>
              </div>
              <div className="mt-4 flex justify-end">
                <button onClick={() => purchase('finance')} className="btn btn-secondary">Confirm Finance</button>
              </div>
            </div>
            )
          : (
            <div className="mt-4 flex justify-end">
              <button onClick={() => purchase('buy')} className="btn btn-secondary">Purchase</button>
            </div>
            )
        }
      </div>
    </div>
  )
}

PurchaseNew.layout = page => <AppLayout children={page} title="Marketplace - Invoice" heading="Marketplace - Invoice" />

export default PurchaseNew
