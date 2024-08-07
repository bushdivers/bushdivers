import {
  Card,
  CardBody,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Radio,
  RadioGroup,
  Select,
  Stack,
} from '@chakra-ui/react'
import { router, usePage } from '@inertiajs/react'
import React, { useEffect, useState } from 'react'

import Aircraft from '../../components/dispatch/Aircraft'
import Cargo from '../../components/dispatch/Cargo'
import Destination from '../../components/dispatch/Destination'
import DispatchSummary from '../../components/dispatch/DispatchSummary'
import Fuel from '../../components/dispatch/Fuel'
import AppLayout from '../../components/layout/AppLayout'

const Dispatch = ({ cargo, aircraft, airport, tours }) => {
  const { auth } = usePage().props
  const [personWeight] = useState(170.0)
  const [avgasWeight] = useState(5.99)
  const [jetFuelWeight] = useState(6.79)
  const [selectedAircraft, setSelectedAircraft] = useState('')
  const [selectedCargo, setSelectedCargo] = useState([])
  const [fuel, setFuel] = useState(0)
  const [fuelPrice, setFuelPrice] = useState(0.0)
  const [destination, setDestination] = useState('')
  const [fuelWeight, setFuelWeight] = useState(0)
  const [cargoWeight, setCargoWeight] = useState(0)
  const [passengerCount, setPassengerCount] = useState(0)
  const [error, setError] = useState(null)
  const [deadHead, setDeadHead] = useState(false)
  const [flightType, setFlightType] = useState(
    tours?.length > 0 ? null : 'standard'
  )
  const [selectedTour, setSelectedTour] = useState(null)

  function handleDeadHead() {
    if (!selectedAircraft.maintenance_status) {
      setDeadHead(!deadHead)
    }
  }

  function handleAircraftSelect(ac) {
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

  function handleUpdateFuel(qty, price) {
    setError(null)
    if (qty > selectedAircraft.fleet.fuel_capacity) {
      setError('Cannot specify more than the aircraft fuel capacity')
      setFuel(selectedAircraft.fleet.fuel_capacity)
      return
    }
    if (
      selectedAircraft.fleet.fuel_type === 1 &&
      !airport.is_hub &&
      qty - selectedAircraft.fuel_onboard > airport.avgas_qty
    ) {
      setError('Cannot specify more than the available 100LL at this airport')
      setFuel(selectedAircraft.fuel_onboard)
      return
    }
    if (
      selectedAircraft.fleet.fuel_type === 2 &&
      !airport.is_hub &&
      qty - selectedAircraft.fuel_onboard > airport.jetfuel_qty
    ) {
      setError(
        'Cannot specify more than the available Jet Fuel at this airport'
      )
      setFuel(selectedAircraft.fuel_onboard)
      return
    }
    setFuel(qty)
    setFuelPrice(price)
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
      fuel_price: fuelPrice,
      cargo,
      is_empty: deadHead,
      tour: selectedTour?.id,
    }
    router.post('/dispatch', data)
  }

  function handleSubmitDispatch() {
    if (flightType === null) {
      alert('Please select a flight type')
      return
    }
    if (flightType === 'tour') {
      const compatibleAircraft = selectedTour.aircraft.filter(
        (ac) => ac.fleet.id === selectedAircraft.fleet.id
      )
      if (
        compatibleAircraft === undefined ||
        compatibleAircraft.length === 0 ||
        selectedAircraft.owner_id === 0
      ) {
        alert('This aircraft is not compatible with the tour flight')
        return
      }
    }

    if (
      selectedCargo.length > 0 &&
      selectedCargo.filter((c) => c.community_job_contract_id !== null).length >
        0
    ) {
      if (selectedAircraft.owner_id !== 0) {
        alert(
          'This aircraft is not compatible with a community contract. please select a fleet plane'
        )
        return
      }
    }

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
        alert('You are overweight!')
        return
      }
      sendDispatch()
    } else {
      alert('Please make sure you have selected an aircraft, cargo, and fuel')
    }
  }

  useEffect(() => {
    if (flightType === 'tour') {
      setSelectedTour(tours[0])
    } else {
      setSelectedTour(null)
    }
  }, [flightType])

  function handleTourSelect(e) {
    const tour = tours.filter((t) => t.id == e.target.value)
    setSelectedTour(tour[0] ?? null)
  }

  return (
    <div>
      <Heading size="md">{`Dispatch - ${auth.user.current_airport_id}`}</Heading>
      <Flex justifyContent="space-between" mt={4}>
        <Grid templateColumns="repeat(5, 1fr)" gap={4}>
          <GridItem colSpan={3}>
            <Card mb={2}>
              <CardBody>
                <FormControl>
                  <FormLabel>Flight Type</FormLabel>
                  <RadioGroup onChange={setFlightType} value={flightType}>
                    <Stack direction="row">
                      <Radio value="standard">Standard Flight</Radio>
                      {tours?.length > 0 && (
                        <Radio value="tour">Tour Flight</Radio>
                      )}
                    </Stack>
                  </RadioGroup>
                </FormControl>
                {flightType === 'tour' ? (
                  <Select onChange={handleTourSelect} mt={2} size="sm">
                    {tours.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title}
                      </option>
                    ))}
                  </Select>
                ) : null}
              </CardBody>
            </Card>
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
          </GridItem>
          <GridItem colStart={4} colEnd={6}>
            <Destination
              currentAirport={auth.user.current_airport_id}
              updateDestinationValue={setDestination}
            />
            <Fuel
              airport={airport}
              selectedAircraft={selectedAircraft}
              fuel={fuel}
              fuelWeight={fuelWeight}
              handleUpdateFuel={handleUpdateFuel}
              error={error}
            />
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
              handleSubmitDispatch={handleSubmitDispatch}
              isActive={false}
            />
          </GridItem>
        </Grid>
      </Flex>
    </div>
  )
}

Dispatch.layout = (page) => (
  <AppLayout children={page} title="Dispatch" heading="Flight Dispatch" />
)

export default Dispatch
