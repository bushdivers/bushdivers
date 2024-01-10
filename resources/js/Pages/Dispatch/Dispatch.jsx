import { Box, Button, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react'
import { Inertia, usePage } from '@inertiajs/react'
import React, { useState } from 'react'

import Aircraft from '../../components/dispatch/Aircraft'
import Cargo from '../../components/dispatch/Cargo'
import Destination from '../../components/dispatch/Destination'
import DispatchSummary from '../../components/dispatch/DispatchSummary'
import Fuel from '../../components/dispatch/Fuel'
import AppLayout from '../../components/layout/AppLayout'

const Dispatch = ({ cargo, aircraft }) => {
  const { auth } = usePage().props
  const [personWeight] = useState(170.0)
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

  function handleDeadHead() {
    if (!selectedAircraft.maintenance_status) {
      setDeadHead(!deadHead)
    }
  }

  function handleAircraftSelect(ac) {
    setSubmitError(null)
    setSelectedAircraft(
      aircraft.find((a) => a.registration === ac.registration)
    )
    setFuel(ac.fuel_onboard)
    if (ac.maintenance_status || ac.total_condition <= 25) {
      window.alert(
        'This aircraft is in need of maintenance, and therefore cannot be used for commercial purposes - please head to nearest size 4+ airport or hub for repairs.'
      )
      setDeadHead(true)
    } else {
      setDeadHead(false)
    }
    calculateFuelWeight(ac, ac.fuel_onboard)
  }

  async function handleCargoSelect(cargo) {
    console.log(cargo)
    setSubmitError(null)
    if (selectedCargo.find((sc) => sc.id === cargo.id)) {
      await setSelectedCargo(selectedCargo.filter((sc) => sc.id !== cargo.id))
      calculateCargoPayload('subtract', cargo)
      if (cargo.cargo_type === 2) {
        calculatePax('subtract', cargo)
      }
    } else {
      await setSelectedCargo((sc) => sc.concat(cargo))
      calculateCargoPayload('add', cargo)
      if (cargo.cargo_type === 2) {
        calculatePax('add', cargo)
      }
    }
  }

  function calculateFuelWeight(ac, f) {
    const fw = ac.fleet.fuel_type === 1 ? f * avgasWeight : f * jetFuelWeight
    setFuelWeight(fw)
  }

  function calculatePax(method, pax) {
    let newTotal = 0
    if (method === 'subtract') {
      newTotal = passengerCount - pax.cargo_qty
    } else if (method === 'add') {
      newTotal = passengerCount + pax.cargo_qty
    }
    setPassengerCount(newTotal)
  }

  function calculateCargoPayload(method, cargo) {
    let newTotal = 0
    if (method === 'subtract') {
      if (cargo.cargo_type === 1) {
        newTotal = cargoWeight - cargo.cargo_qty
      } else {
        newTotal = cargoWeight - cargo.cargo_qty * personWeight
      }
    } else if (method === 'add') {
      if (cargo.cargo_type === 1) {
        newTotal = cargoWeight + cargo.cargo_qty
      } else {
        newTotal = cargoWeight + cargo.cargo_qty * personWeight
      }
    }
    setCargoWeight(newTotal)
  }

  function handleUpdateFuel(e) {
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

  function sendDispatch() {
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
      is_empty: deadHead,
    }
    Inertia.post('/dispatch', data)
  }

  function handleSubmitDispatch() {
    setSubmitError(null)
    if (deadHead && selectedAircraft && fuel > 0 && destination) {
      sendDispatch()
      return
    }
    if (
      selectedCargo.length > 0 &&
      selectedAircraft &&
      fuel > 0 &&
      destination
    ) {
      if (
        passengerCount > selectedAircraft.fleet.pax_capacity ||
        cargoWeight > selectedAircraft.fleet.cargo_capacity ||
        personWeight + fuelWeight + cargoWeight >
          selectedAircraft.fleet.mtow - selectedAircraft.fleet.zfw
      ) {
        setSubmitError('You are overweight!')
        return
      }
      sendDispatch()
    } else {
      setSubmitError(
        'Please make sure you have selected an aircraft, cargo, and fuel'
      )
    }
  }

  return (
    <div>
      <Heading size="md">{`Dispatch - ${auth.user.current_airport_id}`}</Heading>
      <Flex justifyContent="space-between" mt={4}>
        <SimpleGrid columns={2} spacing={10}>
          <Box>
            <Aircraft
              aircraft={aircraft}
              selectedAircraft={selectedAircraft}
              handleAircraftSelect={handleAircraftSelect}
            />
            <Cargo
              cargo={cargo}
              selectedCargo={selectedCargo}
              handleCargoSelect={handleCargoSelect}
              deadHead={deadHead}
              handleDeadHead={handleDeadHead}
            />
            <Destination
              currentAirport={auth.user.current_airport_id}
              updateDestinationValue={setDestination}
            />
            <Fuel
              selectedAircraft={selectedAircraft}
              fuel={fuel}
              fuelWeight={fuelWeight}
              handleUpdateFuel={handleUpdateFuel}
              error={error}
            />
          </Box>
          <Box>
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
            <Box textAlign="right" mt={2}>
              <Button onClick={() => handleSubmitDispatch()}>
                File Dispatch
              </Button>
              {submitError && (
                <Text fontSize="xs" mt={2} color="red.300">
                  {submitError}
                </Text>
              )}
            </Box>
          </Box>
        </SimpleGrid>
      </Flex>
    </div>
  )
}

Dispatch.layout = (page) => (
  <AppLayout children={page} title="Dispatch" heading="Flight Dispatch" />
)

export default Dispatch
