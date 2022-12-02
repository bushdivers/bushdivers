import React, { useState } from 'react'
import { usePage } from '@inertiajs/inertia-react'
import DispatchSummary from '../../Shared/Components/Dispatch/DispatchSummary'
import Destination from '../../Shared/Components/Dispatch/Destination'
import Fuel from '../../Shared/Components/Dispatch/Fuel'
import Cargo from '../../Shared/Components/Dispatch/Cargo'
import Aircraft from '../../Shared/Components/Dispatch/Aircraft'
import { Inertia } from '@inertiajs/inertia'
import AppLayout from '../../Shared/AppLayout'

const Dispatch = ({ cargo, aircraft }) => {
  const { auth } = usePage().props
  const [personWeight] = useState(170.00)
  const [avgasWeight] = useState(5.99)
  const [jetFuelWeight] = useState(6.79)
  const [selectedAircraft, setSelectedAircraft] = useState('')
  const [selectedCargo, setSelectedCargo] = useState([])
  const [fuel, setFuel] = useState(0)
  const [destination, setDestination] = useState('')
  const [fuelWeight, setFuelWeight] = useState(0)
  const [cargoWeight, setCargoWeight] = useState(0)
  const [passengerCount, setPassengerCount] = useState(0)
  const [error, setError] = useState(null)
  const [submitError, setSubmitError] = useState(null)
  const [deadHead, setDeadHead] = useState(false)

  function handleDeadHead () {
    if (!selectedAircraft.maintenance_status) {
      setDeadHead(!deadHead)
    }
  }

  function handleAircraftSelect (ac) {
    setSubmitError(null)
    setSelectedAircraft(aircraft.find(a => a.registration === ac.registration))
    setFuel(ac.fuel_onboard)
    if (ac.maintenance_status || ac.total_condition <= 25) {
      window.alert('This aircraft is in need of maintenance, and therefore cannot be used for commercial purposes - please head to nearest size 4+ airport or hub for repairs.')
      setDeadHead(true)
    } else {
      setDeadHead(false)
    }
    calculateFuelWeight(ac, ac.fuel_onboard)
  }

  async function handleCargoSelect (cargo) {
    console.log(cargo)
    setSubmitError(null)
    if (selectedCargo.find(sc => sc.id === cargo.id)) {
      await setSelectedCargo(selectedCargo.filter(sc => sc.id !== cargo.id))
      calculateCargoPayload('subtract', cargo)
      if (cargo.cargo_type_id === 2) {
        calculatePax('subtract', cargo)
      }
    } else {
      await setSelectedCargo(sc => sc.concat(cargo))
      calculateCargoPayload('add', cargo)
      if (cargo.cargo_type_id === 2) {
        calculatePax('add', cargo)
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
    let newTotal = 0
    if (method === 'subtract') {
      if (cargo.cargo_type_id === 1) {
        newTotal = cargoWeight - cargo.cargo_qty
      } else {
        newTotal = cargoWeight - (cargo.cargo_qty * personWeight)
      }
    } else if (method === 'add') {
      if (cargo.cargo_type_id === 1) {
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

  function sendDispatch () {
    // create dispatch
    const cargo = []
    if (!deadHead) {
      selectedCargo.forEach((c) => {
        cargo.push(c.id)
      })
    }

    const data = {
      aircraft: selectedAircraft.registration,
      destination,
      fuel,
      cargo,
      is_empty: deadHead
    }
    Inertia.post('/dispatch', data)
  }

  function handleSubmitDispatch () {
    setSubmitError(null)
    if (deadHead && selectedAircraft && fuel > 0 && destination) {
      sendDispatch()
      return
    }
    if (selectedCargo.length > 0 && selectedAircraft && fuel > 0 && destination) {
      if (passengerCount > selectedAircraft.fleet.pax_capacity || cargoWeight > selectedAircraft.fleet.cargo_capacity || (personWeight + fuelWeight + cargoWeight) > (selectedAircraft.fleet.mtow - selectedAircraft.fleet.zfw)) {
        setSubmitError('You are overweight!')
        return
      }
      sendDispatch()
    } else {
      setSubmitError('Please make sure you have selected an aircraft, cargo, and fuel')
    }
  }

  return (
    <div>
      <h2>{`Dispatch - ${auth.user.current_airport_id}`}</h2>
      <div className="flex flex-col md:flex-row justify-between mt-4">
        <div className="md:w-1/2">
          <Aircraft aircraft={aircraft} selectedAircraft={selectedAircraft} handleAircraftSelect={handleAircraftSelect} />
          <Cargo cargo={cargo} selectedCargo={selectedCargo} handleCargoSelect={handleCargoSelect} deadHead={deadHead} handleDeadHead={handleDeadHead} />
          <Destination currentAirport={auth.user.current_airport_id} updateDestinationValue={setDestination} />
          <Fuel selectedAircraft={selectedAircraft} fuel={fuel} handleUpdateFuel={handleUpdateFuel} error={error} />
        </div>
        <div className="md:w-1/2 mt-2">
          <div className="md:ml-2">
            <DispatchSummary
              selectedAircraft={selectedAircraft}
              selectedCargo={selectedCargo}
              personWeight={personWeight}
              cargoWeight={cargoWeight}
              fuelWeight={fuelWeight}
              passengerCount={passengerCount}
              destination={destination}
              fuel={fuel}
              deadHead={deadHead}
            />
            <div className="mt-2 text-right">
              <button onClick={() => handleSubmitDispatch()} className="btn btn-primary">File Dispatch</button><br />
              {submitError && <div className="text-error text-xs">{submitError}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Dispatch.layout = page => <AppLayout children={page} title="Dispatch" heading="Flight Dispatch" />

export default Dispatch
