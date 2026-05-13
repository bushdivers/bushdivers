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
      const fuelCap = props.variant?.fuel_capacity ?? 0
      setMaxFuel(parseInt(fuelCap))
      setFuelPrice(0.0)
      setFuelAmount(props.selectedAircraft.fuel_onboard)
      const perc = (props.selectedAircraft.fuel_onboard / fuelCap) * 100
      setSliderValue(perc)
    }
  }, [props.selectedAircraft, props.variant])

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
    const fuelCap = props.variant?.fuel_capacity ?? 0
    if (val > 0) setFuelAmount(Math.round((val / 100.0) * fuelCap, 2))
  }

  function onNumberChange(val) {
    setFuelAmount(val)
    const fuelCap = props.variant?.fuel_capacity ?? 0
    setSliderValue((val / fuelCap) * 100)
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
        <CardHeader pb={0}>
          <Flex justifyContent="space-between" alignItems="start">
            <Heading size="md">Fuel</Heading>
            <AvailableFuel airport={props.airport} />
          </Flex>
        </CardHeader>
        <CardBody>
          <Box>
            <Flex justifyContent="space-between" alignItems="baseline">
              <Text fontSize="sm" color="gray.400">
                Fuel capacity
              </Text>
              <Text fontSize="sm">
                {displayNumber(props.variant?.fuel_capacity ?? 0, true, true)}{' '}
                gal
              </Text>
            </Flex>
            <Flex justifyContent="space-between" alignItems="baseline" mt={1}>
              <Text fontSize="sm" color="gray.400">
                Current fuel
              </Text>
              <Text
                fontSize="sm"
                color={
                  props.fuel > (props.variant?.fuel_capacity ?? Infinity)
                    ? 'red.300'
                    : ''
                }
              >
                {displayNumber(
                  props.fuel !== null ? props.fuel : '',
                  true,
                  true
                )}{' '}
                gal
              </Text>
            </Flex>
            <Flex justifyContent="space-between" alignItems="baseline" mt={1}>
              <Text fontSize="sm" color="gray.400">
                Fuel weight
              </Text>
              <Text fontSize="sm" color="green.400">
                {props.fuelWeight !== null
                  ? displayNumber(parseFloat(props.fuelWeight), true, true) +
                    ' lbs'
                  : '—'}
              </Text>
            </Flex>
            {props.selectedAircraft && shouldWeRenderAddFuel() && (
              <Box mt={3}>
                <Text fontSize="sm" fontWeight="medium">
                  Adjust Fuel (
                  {props.selectedAircraft.fleet.fuel_type === 1
                    ? '100LL'
                    : 'Jet Fuel'}
                  )
                </Text>
                <Text fontSize="xs" as="i" color="gray.400">
                  Fuel will be charged when dispatching
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
                <Flex alignItems="center" gap={2} mt={2}>
                  <NumberInput
                    flex={1}
                    value={fuelAmount}
                    min={5}
                    max={maxFuel}
                    precision={2}
                    onChange={(val) => onNumberChange(val)}
                    allowMouseWheel
                    size="sm"
                  >
                    <NumberInputField data-testid="btn-add-fuel" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Text pl={6} fontSize="sm" color="gray.400">
                    ${displayNumber(fuelPrice, true, true)}
                  </Text>
                </Flex>
                {props.error && (
                  <Text fontSize="xs" color="red.500" mt={1}>
                    {props.error}
                  </Text>
                )}
              </Box>
            )}
            <Flex justifyContent="space-between" alignItems="center" mt={3}>
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
                <Box />
              )}
              {props.selectedAircraft && shouldWeRenderAddFuel() && (
                <Button
                  onClick={() => props.handleUpdateFuel(fuelAmount, fuelPrice)}
                  size="sm"
                >
                  Refuel
                </Button>
              )}
            </Flex>
          </Box>
        </CardBody>
      </Card>
    </Box>
  )
}

export default Fuel
