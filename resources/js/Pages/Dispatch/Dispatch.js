import React, { useEffect, useState } from 'react'
import Layout from '../../Shared/Layout'
import PageTitle from '../../Shared/Navigation/PageTitle'
import NoContent from '../../Shared/Elements/NoContent'
import axios from 'axios'
import { usePage } from '@inertiajs/inertia-react'
import DispatchSummary from '../../Shared/Components/Dispatch/DispatchSummary'
import Destination from '../../Shared/Components/Dispatch/Destination'
import Fuel from '../../Shared/Components/Dispatch/Fuel'
import Cargo from '../../Shared/Components/Dispatch/Cargo'
import Aircraft from '../../Shared/Components/Dispatch/Aircraft'
import { Inertia } from '@inertiajs/inertia'

const Dispatch = ({ cargo, aircraft }) => {
  const { auth } = usePage().props
  const personWeight = 80.00
  const avgasWeight = 2.72
  const jetFuelWeight = 3.08
  const [selectedAircraft, setSelectedAircraft] = useState('')
  const [selectedCargo, setSelectedCargo] = useState([])
  const [fuel, setFuel] = useState(0)
  const [destination, setDestination] = useState('')
  const [fuelWeight, setFuelWeight] = useState(0)
  const [cargoWeight, setCargoWeight] = useState(0)
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

  async function splitCargo (cargo) {
    const amount = window.prompt('Enter quantity to split (this will create a new cargo entry with that amount)')
    if (amount) {
      if (amount < cargo.cargo_qty) {
        // make api call
        const data = {
          id: cargo.id,
          qty: amount
        }
        const res = await axios.post('/api/cargo/split', data)
        // reload
        if (res.status === 201) {
          Inertia.reload({ only: ['cargo'] })
        } else {
          window.alert('Issue splitting cargo')
        }
      } else {
        window.alert(`New cargo amount must be less than total cargo: ${cargo.cargo_qty}`)
      }
    } else {
      window.alert('Cargo split has been cancelled')
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
    let newTotal = 0
    if (method === 'subtract') {
      if (cargo.contract_type_id === 1) {
        newTotal = cargoWeight - cargo.cargo_qty
      } else {
        newTotal = cargoWeight - (cargo.cargo_qty * personWeight)
      }
    } else if (method === 'add') {
      if (cargo.contract_type_id === 1) {
        newTotal = cargoWeight + cargo.cargo_qty
      } else {
        newTotal = cargoWeight + (cargo.cargo_qty * personWeight)
      }
    }
    setCargoWeight(newTotal)
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
      // create dispatch
      const cargo = []
      selectedCargo.forEach((c) => {
        cargo.push(c.id)
      })
      const data = {
        aircraft: selectedAircraft.id,
        destination,
        fuel,
        cargo
      }
      Inertia.post('/dispatch', data)
    } else {
      setSubmitError('Please make sure you have selected an aircraft, cargo, and fuel')
    }
  }

  return (
    <div>
      <PageTitle title={`Dispatch - ${auth.user.current_airport_id}`} />
      <div className="flex justify-between mt-4">
        <div className="w-1/2">
          <Aircraft aircraft={aircraft} selectedAircraft={selectedAircraft} handleAircraftSelect={handleAircraftSelect} />
          <Cargo cargo={cargo} selectedCargo={selectedCargo} handleCargoSelect={handleCargoSelect} splitCargo={splitCargo} />
          <Destination currentAirport={auth.user.current_airport_id} updateDestinationValue={setDestination} />
          <Fuel selectedAircraft={selectedAircraft} fuel={fuel} handleUpdateFuel={handleUpdateFuel} error={error} />
        </div>
        <div className="w-1/2 mt-2">
          <div className="shadow rounded p-4 ml-2 bg-white">
            <DispatchSummary
              selectedAircraft={selectedAircraft}
              selectedCargo={selectedCargo}
              personWeight={personWeight}
              cargoWeight={cargoWeight}
              fuelWeight={fuelWeight}
              passengerCount={passengerCount}
              destination={destination}
              fuel={fuel}
            />
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
