import React, { useEffect, useState } from 'react'
import Layout from '../../Shared/Layout'
import PageTitle from '../../Shared/Navigation/PageTitle'
import NoContent from '../../Shared/Elements/NoContent'
import axios from 'axios'
import { usePage } from '@inertiajs/inertia-react'

const EmptyData = (props) => {
  return (
    <>
      <i className="material-icons md-48">airplane_ticket</i>
      <div>There are no available {props.content}</div>
    </>
  )
}

const Dispatch = ({ cargo, aircraft }) => {
  const { auth } = usePage().props
  const personWeight = 80.00
  const avgasWeight = 2.72
  const jetFuelWeight = 3.08
  const [selectedAircraft, setSelectedAircraft] = useState('')
  const [selectedCargo, setSelectedCargo] = useState([])
  const [fuel, setFuel] = useState(0)
  const [airportError, setAirportError] = useState(null)
  const [distance, setDistance] = useState(null)
  const [airport, setAirport] = useState('')
  const [icao, setIcao] = useState('')
  const [destination, setDestination] = useState('')
  const [fuelWeight, setFuelWeight] = useState(0)
  const [cargoWeight, setCargoWeight] = useState(0)
  const [contractValue, setContractValue] = useState(0)
  const [passengerCount, setPassengerCount] = useState(0)
  const [error, setError] = useState(null)
  const [submitError, setSubmitError] = useState(null)

  function handleAircraftSelect (ac) {
    setSubmitError(null)
    setSelectedAircraft(aircraft.find(a => a.id === ac.id))
    setFuel(ac.fuel_onboard)
    calculateFuelWeight(ac, ac.fuel_onboard)
  }

  async function handleCargoSelect (cargo) {
    console.log(cargo)
    setSubmitError(null)
    if (selectedCargo.find(sc => sc.id === cargo.id)) {
      await setSelectedCargo(selectedCargo.filter(sc => sc.id !== cargo.id))
      calculateCargoPayload('subtract', cargo)
      if (cargo.contract_type_id === 2) {
        calculatePax('subtract', cargo)
      }
    } else {
      await setSelectedCargo(sc => sc.concat(cargo))
      calculateCargoPayload('add', cargo)
      if (cargo.contract_type_id === 2) {
        calculatePax('add', cargo)
      }
    }
  }

  async function handleDestinationChange (e) {
    setAirportError(null)
    setAirport(null)
    setIcao(e.target.value)
    if (e.target.value.length >= 3) {
      const response = await axios.get(`/api/airport/search/${e.target.value}`)
      if (response.data.airport) {
        setAirport(`${response.data.airport.identifier} - ${response.data.airport.name}`)
        setDestination(response.data.airport.identifier)
        setAirportError(null)
        const disResp = await axios.get(`/api/flights/distance/${auth.user.current_airport_id}/${response.data.airport.identifier}`)
        if (disResp.status === 200) {
          setDistance(disResp.data.distance)
        } else {
          setAirportError('Cannot calculate distance')
        }
      } else {
        setDestination('')
        setAirportError('No airport found')
      }
    }
  }

  function calculateFuelWeight (ac, f) {
    const fw = ac.fleet.fuel_type === 1 ? f * avgasWeight : f * jetFuelWeight
    setFuelWeight(fw)
  }

  function calculatePax (method, pax) {
    let newTotal = 0
    if (method === 'subtract') {
      newTotal = passengerCount - pax.cargo_qty
    } else if (method === 'add') {
      newTotal = passengerCount + pax.cargo_qty
    }
    setPassengerCount(newTotal)
  }

  function calculateCargoPayload (method, cargo) {
    console.log(selectedCargo)
    let newTotal = 0
    let newValue = 0
    if (method === 'subtract') {
      if (cargo.contract_type_id === 1) {
        newTotal = cargoWeight - cargo.cargo_qty
      } else {
        newTotal = cargoWeight - (cargo.cargo_qty * personWeight)
      }
      newValue = parseFloat(contractValue) - parseFloat(cargo.contract.contract_value)
    } else if (method === 'add') {
      if (cargo.contract_type_id === 1) {
        newTotal = cargoWeight + cargo.cargo_qty
      } else {
        newTotal = cargoWeight + (cargo.cargo_qty * personWeight)
      }
      newValue = parseFloat(contractValue) + parseFloat(cargo.contract.contract_value)
    }
    setCargoWeight(newTotal)
    setContractValue(newValue)
  }

  function handleUpdateFuel (e) {
    setSubmitError(null)
    setError(null)
    const qty = e.target.value
    if (qty > selectedAircraft.fleet.fuel_capacity) {
      setError('Cannot specify more than the aircraft fuel capacity')
      setFuel(selectedAircraft.fleet.fuel_capacity)
      return
    }
    setFuel(qty)
    calculateFuelWeight(selectedAircraft, qty)
  }

  function handleSubmitDispatch () {
    setSubmitError(null)
    if (selectedCargo.length > 0 && selectedAircraft && fuel > 0 && destination) {
      if (passengerCount > selectedAircraft.fleet.pax_capacity || cargoWeight > selectedAircraft.fleet.cargo_capacity || (personWeight + fuelWeight + cargoWeight) > (selectedAircraft.fleet.mtow - selectedAircraft.fleet.zfw)) {
        setSubmitError('You are overweight!')
        return
      }
      // create dispacth
      window.alert('Hello')
    } else {
      setSubmitError('Please make sure you have selected an aircraft, cargo, and fuel')
    }
  }

  return (
    <div>
      <PageTitle title={`Dispatch - ${auth.user.current_airport_id}`} />
      <div className="flex justify-between mt-4">
        <div className="w-1/2">
          <div className="shadow rounded p-4 mt-2 mr-2 bg-white">
            {aircraft.length === 0
              ? <NoContent content={<EmptyData content="Aircraft" />} />
              : (
                <div>
                  <div className="mb-2 text-xl">Select Aircraft</div>
                  <table className="table table-auto table-condensed">
                    <thead>
                    <tr>
                      <th>Registration</th>
                      <th>Aircraft</th>
                      <th>Current Fuel</th>
                    </tr>
                    </thead>
                    <tbody>
                    {aircraft.map((ac) => (
                      <tr key={ac.id} onClick={() => handleAircraftSelect(ac)} className={selectedAircraft.id === ac.id ? 'bg-orange-200 hover:bg-orange-100' : ''}>
                        <td>{ac.registration}</td>
                        <td>{ac.fleet.manufacturer} {ac.fleet.name} ({ac.fleet.type})</td>
                        <td>{ac.fuel_onboard}</td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
                )
            }
          </div>
          <div className="shadow rounded p-4 mt-2 mr-2 bg-white">
            {cargo.length === 0
              ? <NoContent content={<EmptyData content="Cargo" />} />
              : (
                <div>
                  <div className="mb-2 text-xl">Select Cargo</div>
                  <table className="table table-auto table-condensed">
                    <thead>
                    <tr>
                      <td></td>
                      {/* <td></td> */}
                      <th>Contract</th>
                      <th>Current</th>
                      <th>Arrival</th>
                      <th>Distance</th>
                      <th>Heading</th>
                      <th>Type</th>
                      <th>Cargo</th>
                      <th>Pay</th>
                    </tr>
                    </thead>
                    <tbody>
                    {cargo.map((detail) => (
                      <tr key={detail.id} className={selectedCargo.some(s => s.id === detail.id) ? 'bg-orange-200 hover:bg-orange-100' : ''}>
                        <td><input id="remember" checked={selectedCargo.some(s => s.id === detail.id)} onChange={() => handleCargoSelect(detail)} type="checkbox" className="form-checkbox rounded border-gray-300 text-orange-500 shadow-sm focus:border-orange-300 focus:ring focus:ring-offset-0 focus:ring-orange-200 focus:ring-opacity-50" /></td>
                        {/* <td><button onClick={() => toggleShowSplit} className="btn btn-secondary btn-small">Split</button></td> */}
                        <td>{detail.id}</td>
                        <td>{detail.current_airport_id}</td>
                        <td>{detail.contract.arr_airport_id}</td>
                        <td>{detail.contract.distance}</td>
                        <td>{detail.contract.heading}</td>
                        <td>{detail.contract_type_id === 1 ? 'Cargo' : 'Passenger'}</td>
                        <td>
                          {detail.contract_type_id === 1
                            ? <div><span>{detail.cargo_qty} kg</span> <span className="text-xs">{detail.cargo}</span></div>
                            : <div><span>{detail.cargo_qty}</span> <span className="text-xs">{detail.cargo}</span></div>
                          }
                        </td>
                        <td>${detail.contract.contract_value.toLocaleString()}</td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
                )
            }
          </div>
          <div className="shadow rounded p-4 mt-2 mr-2 bg-white">
            <div className="text-xl">Select Fuel</div>
            {selectedAircraft && (
              <div>
                <div>Useable Fuel (gal): {selectedAircraft.fleet.fuel_capacity}</div>
                <div>
                  Current Fuel (gal):
                  <div className="w-1/4">
                    <input id="fuel" type="text" className="form-input form" value={fuel} onChange={handleUpdateFuel} />
                  </div>
                  Destination (ICAO):
                  <div className="w-1/4">
                    <input id="icao" type="text" className="form-input form" value={icao} onChange={handleDestinationChange} />
                  </div>
                  {airport && <div className="text-sm mt-1">{airport}</div>}
                  {distance && <span className="text-sm">Distance: {distance}nm</span>}
                  {airportError && <div className="text-sm text-red-500 mt-1">{airportError}</div>}
                </div>
                <div>

                </div>
              </div>
            )}
          </div>
        </div>
        <div className="w-1/2 mt-2">
          <div className="shadow rounded p-4 ml-2 bg-white">
            <div className="text-xl">Dispatch Summary</div>
            <div className="mt-2">
              <div>
                {selectedAircraft && <div className="flex justify-start items-center"><i className="material-icons mr-2">flight</i><span>{selectedAircraft.registration} - {selectedAircraft.fleet.manufacturer} {selectedAircraft.fleet.name} ({selectedAircraft.fleet.type})</span></div>}
              </div>
            </div>
            <div className="mt-2">
              <div className="text-lg mb-1">Payload:</div>
              <div>Pilot & payload weight (inc. fuel): {selectedAircraft && <span className={selectedAircraft && (personWeight + fuelWeight + cargoWeight) > (selectedAircraft.fleet.mtow - selectedAircraft.fleet.zfw) ? 'text-red-500' : ''}>{(personWeight + fuelWeight + cargoWeight)} kg / {(selectedAircraft.fleet.mtow - selectedAircraft.fleet.zfw)} kg</span>}</div>
              <div>Cargo payload: {selectedAircraft && <span className={selectedAircraft && cargoWeight > selectedAircraft.fleet.cargo_capacity ? 'text-red-500' : ''}>{cargoWeight} kg / {selectedAircraft.fleet.cargo_capacity} kg</span>}</div>
              <div>Passenger count: {selectedAircraft && <span className={selectedAircraft && passengerCount > selectedAircraft.fleet.pax_capacity ? 'text-red-500' : ''}>{passengerCount} / {selectedAircraft.fleet.pax_capacity}</span>}</div>
            </div>
            <div className="mt-2">
              <div>Contracts:</div>
              <div>Total contracts: {selectedCargo && selectedCargo.length}</div>
              <div>Total value: ${contractValue}</div>
            </div>
            <div className="mt-2 text-right">
              <button onClick={() => handleSubmitDispatch()} className="btn btn-secondary">Load Dispatch</button><br />
              {submitError && <div className="text-red-500 text-xs">{submitError}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Dispatch.layout = page => <Layout children={page} title="Dispatch" />

export default Dispatch
