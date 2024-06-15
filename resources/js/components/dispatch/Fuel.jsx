import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Radio,
  RadioGroup,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
} from '@chakra-ui/react'
import { router } from '@inertiajs/react'
import React, { useEffect, useState } from 'react'

import { displayNumber } from '../../helpers/number.helpers.js'
import AvailableFuel from '../airport/AvailableFuel.jsx'

const Fuel = (props) => {
  const [maxFuel, setMaxFuel] = useState(5.0) // max tank capacity
  const [sliderValue, setSliderValue] = useState(0) // slider val (as percent)
  const [fuelAmount, setFuelAmount] = useState(0) // fuel value (gal)
  const [fuelPrice, setFuelPrice] = useState(0.0)
  const [fuelCargoData, setFuelCargoData] = useState({
    destination: '',
    fuel_qty: 0,
  })
  const [fuelCargoType, setFuelCargoType] = useState('')
  const [fuelWeight, setFuelWeight] = useState(0)
  const [fuelCargoError, setFuelCargoError] = useState(null)

  useEffect(() => {
    updateFuelPrice()
  }, [fuelAmount])

  useEffect(() => {
    if (props.selectedAircraft) {
      setMaxFuel(parseInt(props.selectedAircraft.fleet.fuel_capacity))
      setFuelPrice(0.0)
      setFuelAmount(props.selectedAircraft.fuel_onboard)
      const perc =
        (props.selectedAircraft.fuel_onboard /
          props.selectedAircraft.fleet.fuel_capacity) *
        100
      setSliderValue(perc)
    }
  }, [props.selectedAircraft])

  function updateFuelPrice() {
    if (props.selectedAircraft) {
      const fuelCost =
        props.selectedAircraft.fleet.fuel_type === 1
          ? props.airport.avgas_price
          : props.airport.jetfuel_price
      const calcPrice =
        fuelAmount > 0
          ? (fuelAmount - props.selectedAircraft.fuel_onboard) * fuelCost
          : 0
      setFuelPrice(calcPrice)
    }
  }

  function onSliderChange(val) {
    val = Math.max(val, 5)
    setSliderValue(val)
    if (val > 0)
      setFuelAmount(
        Math.round(
          (val / 100.0) * props.selectedAircraft.fleet.fuel_capacity,
          2
        )
      )
  }

  function onNumberChange(val) {
    setFuelAmount(val)
    setSliderValue((val / props.selectedAircraft.fleet.fuel_capacity) * 100)
  }

  function shouldWeRenderAddFuel() {
    if (!props.selectedAircraft) return false
    let shouldIRenderAddFuel = false
    if (props.selectedAircraft.fleet.fuel_type === 1) {
      shouldIRenderAddFuel =
        props.airport.avgas_qty > 0 || props.airport.avgas_qty === null
    } else {
      shouldIRenderAddFuel =
        props.airport.jetfuel_qty > 0 || props.airport.jetfuel_qty === null
    }
    return shouldIRenderAddFuel
  }

  function shouldWeRenderCreateFuelCargo() {
    return (
      props.airport.avgas_qty > 0 ||
      props.airport.avgas_qty === null ||
      props.airport.jetfuel_qty > 0 ||
      props.airport.jetfuel_qty === null
    )
  }

  function handleFuelCargoChange(e) {
    const key = e.target.id
    const value = e.target.value
    setFuelCargoData((values) => ({
      ...values,
      [key]: value,
    }))
  }

  useEffect(() => {
    let weight = 0
    weight =
      fuelCargoType === '1'
        ? fuelCargoData.fuel_qty * 5.99
        : fuelCargoData.fuel_qty * 6.79
    setFuelWeight(parseInt(weight))
  }, [fuelCargoData.fuel_qty, fuelCargoType])

  async function handleCreateFuelCargo() {
    setFuelCargoError(null)
    if (
      fuelCargoData.destination &&
      fuelCargoData.fuel_qty > 0 &&
      fuelCargoType
    ) {
      if (fuelCargoType === '1') {
        if (
          props.airport.avgas_qty !== null &&
          fuelCargoData.fuel_qty > props.airport.avgas_qty
        ) {
          setFuelCargoError('Not enough 100LL')
          return
        }
      } else {
        if (
          props.airport.jetfuel_qty !== null &&
          fuelCargoData.fuel_qty > props.airport.jetfuel_qty
        ) {
          setFuelCargoError('Not enough Jet Fuel')
          return
        }
      }
      const data = {
        destination: fuelCargoData.destination,
        qty: parseInt(fuelCargoData.fuel_qty),
        weight: parseInt(fuelWeight),
        fuel_type: parseInt(fuelCargoType),
      }
      await router.post('/contracts/fuel', data)
    } else {
      setFuelCargoError('Please enter a destination, fuel type and fuel qty')
    }
  }

  return (
    <Box my={2}>
      <Card>
        <CardHeader>
          <Flex justifyContent="space-between" alignItems="start">
            <Heading size="md">Fuel</Heading>
            <AvailableFuel airport={props.airport} />
          </Flex>
        </CardHeader>
        <CardBody>
          <Box>
            <Text>
              Useable Fuel (gal): {props.selectedAircraft?.fleet?.fuel_capacity}
            </Text>
            <Flex justifyContent="space-between" alignItems="end">
              <Box>
                <Flex alignItems="center" gap={2}>
                  <Text>
                    Current Fuel (gal):{' '}
                    {displayNumber(props.fuel !== null ? props.fuel : '')}
                  </Text>
                  {shouldWeRenderAddFuel() ? (
                    <Popover>
                      <PopoverTrigger>
                        <Button
                          size="xs"
                          variant="link"
                          data-testid="btn-add-fuel"
                        >
                          Add fuel
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>
                          <Heading size="sm">
                            Adjust Fuel{' '}
                            {props.selectedAircraft?.fleet?.fuel_type === 1
                              ? '(100LL)'
                              : '(Jet Fuel)'}
                          </Heading>
                        </PopoverHeader>
                        <PopoverBody>
                          <Text fontSize="xs" as="i">
                            The fuel will be charged when dispatching flight
                          </Text>
                          <Slider
                            value={sliderValue}
                            my={2}
                            min={0}
                            max={100}
                            step={1}
                            aria-label="slider-ex-6"
                            focusThumbOnChange={false}
                            onChange={(val) => onSliderChange(val)}
                          >
                            <SliderTrack>
                              <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb />
                          </Slider>
                          <NumberInput
                            value={fuelAmount}
                            min={5}
                            max={maxFuel}
                            precision={2}
                            onChange={(val) => onNumberChange(val)}
                            allowMouseWheel
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </PopoverBody>
                        <PopoverFooter>
                          <Text mx={2} fontSize="xs" color="red.500">
                            {props.error}
                          </Text>
                          <Flex justifyContent="space-between" alignItems="end">
                            <Button
                              onClick={() =>
                                props.handleUpdateFuel(fuelAmount, fuelPrice)
                              }
                              size="sm"
                            >
                              Refuel
                            </Button>
                            <Flex direction="column" gap={1}>
                              <Text>{displayNumber(fuelAmount)} gal</Text>
                              <Text>${displayNumber(fuelPrice)}</Text>
                            </Flex>
                          </Flex>
                        </PopoverFooter>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <></>
                  )}
                </Flex>
                <Flex alignItems="center" gap={2}>
                  <Text fontSize="xs" color="green.500">
                    {props.fuelWeight !== null
                      ? parseFloat(props.fuelWeight).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })
                      : ''}{' '}
                    lbs (estimated)
                  </Text>
                </Flex>
              </Box>
              {shouldWeRenderCreateFuelCargo() ? (
                <Popover>
                  <PopoverTrigger>
                    <Button
                      data-testid="btn-fuel-cargo"
                      colorScheme="gray"
                      size="sm"
                    >
                      Create Fuel Cargo
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>Create a Fuel Cargo Contract</PopoverHeader>
                    <PopoverBody>
                      <FormControl>
                        <FormLabel>Destination ICAO</FormLabel>
                        <Input
                          id="destination"
                          name="destination"
                          value={fuelCargoData.destination}
                          type="text"
                          onChange={handleFuelCargoChange}
                        />
                      </FormControl>
                      <FormControl mt={2}>
                        <FormLabel>Fuel Type</FormLabel>
                        <RadioGroup
                          id="fuel_type"
                          name="fuel_type"
                          onChange={setFuelCargoType}
                          value={fuelCargoType}
                        >
                          <Stack direction="row">
                            {props.airport.avgas_qty > 0 ||
                            props.airport.avgas_qty === null ? (
                              <Radio value="1">100LL</Radio>
                            ) : (
                              <></>
                            )}
                            {props.airport.jetfuel_qty > 0 ||
                            props.airport.jetfuel_qty === null ? (
                              <Radio value="2">Jet Fuel</Radio>
                            ) : (
                              <></>
                            )}
                          </Stack>
                        </RadioGroup>
                      </FormControl>
                      <FormControl mt={2}>
                        <FormLabel>Fuel Qty (gal)</FormLabel>
                        <Input
                          id="fuel_qty"
                          name="fuel_qty"
                          value={fuelCargoData.fuel_qty}
                          type="text"
                          onChange={handleFuelCargoChange}
                        />
                      </FormControl>
                    </PopoverBody>
                    <PopoverFooter>
                      <Flex justifyContent="space-between" alignItems="end">
                        <Button onClick={() => handleCreateFuelCargo()}>
                          Create
                        </Button>
                        <Text>{fuelWeight} lbs</Text>
                      </Flex>
                      {fuelCargoError && (
                        <Text fontSize="xs" color="red.500">
                          {fuelCargoError}
                        </Text>
                      )}
                    </PopoverFooter>
                  </PopoverContent>
                </Popover>
              ) : (
                <></>
              )}
            </Flex>
          </Box>
        </CardBody>
      </Card>
    </Box>
  )
}

export default Fuel
