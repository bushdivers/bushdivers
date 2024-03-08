import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

import { displayNumber } from '../../helpers/number.helpers.js'
import AvailableFuel from '../airport/AvailableFuel.jsx'

const Fuel = (props) => {
  const [minFuel, setMinFuel] = useState(5)
  const [sliderValue, setSliderValue] = useState(0)
  const [sliderFuelValue, setSliderFuelValue] = useState(0)
  const [fuelPrice, setFuelPrice] = useState(0.0)

  useEffect(() => {
    updateFuelPrice()
  }, [sliderFuelValue])

  useEffect(() => {
    if (props.selectedAircraft) {
      setFuelPrice(0.0)
      setSliderFuelValue(props.selectedAircraft.fuel_onboard)
      const perc =
        (props.selectedAircraft.fuel_onboard /
          props.selectedAircraft.fleet.fuel_capacity) *
        100
      setMinFuel(perc)
      setSliderValue(0)
    }
  }, [props.selectedAircraft])

  function updateFuelPrice() {
    if (props.selectedAircraft) {
      const fuelCost =
        props.selectedAircraft.fleet.fuel_type === 1
          ? props.airport.avgas_price
          : props.airport.jetfuel_price
      const calcPrice =
        sliderFuelValue > 0
          ? (sliderFuelValue - props.selectedAircraft.fuel_onboard) * fuelCost
          : 0
      setFuelPrice(calcPrice)
    }
  }

  function updateSlideValue(val) {
    setSliderValue(val)
    if (val > 0)
      setSliderFuelValue(
        (val / 100) * props.selectedAircraft.fleet.fuel_capacity
      )
  }

  function shouldWeRenderFuelActions(fuelType) {
    let shouldIRenderFuelSlider = false
    if (fuelType === 1) {
      shouldIRenderFuelSlider =
        props.airport.avgas_qty > 0 || props.airport.avgas_qty === null
    } else {
      shouldIRenderFuelSlider =
        props.airport.jetfuel_qty > 0 || props.airport.jetfuel_qty === null
    }
    return shouldIRenderFuelSlider
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
                    Current Fuel (gal): {props.fuel !== null ? props.fuel : ''}
                  </Text>
                  {shouldWeRenderFuelActions(
                    props.selectedAircraft?.fleet?.fuel_type
                  ) ? (
                    <Popover>
                      <PopoverTrigger>
                        <Button size="xs" variant="link">
                          Add fuel
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>
                          <Heading size="sm">
                            Add Fuel{' '}
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
                            defaultValue={sliderValue}
                            my={2}
                            min={minFuel}
                            max={100}
                            step={5}
                            aria-label="slider-ex-6"
                            onChange={(val) => updateSlideValue(val)}
                          >
                            <SliderTrack>
                              <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb />
                          </Slider>
                        </PopoverBody>
                        <PopoverFooter>
                          <Flex justifyContent="space-between" alignItems="end">
                            <Button
                              onClick={() =>
                                props.handleUpdateFuel(
                                  sliderFuelValue,
                                  fuelPrice
                                )
                              }
                              size="sm"
                            >
                              Refuel
                            </Button>
                            <Flex direction="column" gap={1}>
                              <Text>
                                {displayNumber(
                                  parseInt(sliderFuelValue),
                                  false
                                )}{' '}
                                gal
                              </Text>
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
                {/*<Input*/}
                {/*  id="fuel"*/}
                {/*  type="text"*/}
                {/*  value={props.fuel}*/}
                {/*  onChange={props.handleUpdateFuel}*/}
                {/*  error={props.error}*/}
                {/*/>*/}
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
              {shouldWeRenderFuelActions(
                props.selectedAircraft?.fleet?.fuel_type
              ) ? (
                <Button colorScheme="gray" size="sm">
                  Create Fuel Cargo
                </Button>
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
