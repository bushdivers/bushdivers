import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Flex,
  Heading,
  Icon,
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
  SliderMark,
  SliderThumb,
  SliderTrack,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useToast,
} from '@chakra-ui/react'
import { router, usePage } from '@inertiajs/react'
import axios from 'axios'
import { Anchor, Archive, ArrowUp, Share2, Split, X } from 'lucide-react'
import React, { useState } from 'react'

import { displayNumber } from '../../helpers/number.helpers.js'
import AvailableFuel from '../airport/AvailableFuel.jsx'
import CustomContract from '../contracts/CustomContract'
import NoContent from '../elements/NoContent'

const EmptyData = (props) => {
  return (
    <>
      <Icon color="gray.50" as={Archive} />
      <Text>There is no available {props.content}</Text>
    </>
  )
}

const Cargo = (props) => {
  const toast = useToast()
  const [cargoForSplit, setCargoForSplit] = useState(null)
  const [sliderValue, setSliderValue] = useState(100)
  const [sliderCargoValue, setSliderCargoValue] = useState(null)
  const { auth } = usePage().props
  const [showCustom, setShowCustom] = useState(false)

  function updateSlideValue(val, cargo) {
    setSliderValue(val)
    if (val > 0) setSliderCargoValue((val / 100) * cargo)
  }

  function handleSplitClick(cargo) {
    if (cargoForSplit !== cargo.id) {
      setSliderCargoValue(cargo.cargo_qty)
    } else {
      if (sliderCargoValue !== cargo.cargo_qty) {
        setSliderCargoValue(sliderCargoValue)
      } else {
        setSliderCargoValue(cargo.cargo_qty)
      }
    }
    setCargoForSplit(cargo.id)
  }

  async function splitContract(contractId) {
    if (props.selectedCargo.length > 0) {
      alert('Cannot split when cargo is selected!')
      return
    }
    if (sliderCargoValue < 1) {
      alert('Cannot have zero cargo!')
      return
    }
    const data = {
      id: contractId,
      qty: parseInt(sliderCargoValue),
      userId: auth.user.id,
    }
    try {
      await axios.post('/api/contracts/split', data)
      router.reload()
    } catch (e) {
      if (e.response.status === 422) {
        toast({
          title: e.response.data.message,
          status: 'error',
          isClosable: true,
        })
      }
    }
  }

  async function handleShareContract(contract) {
    const data = {
      id: contract.id,
    }

    try {
      await axios.post('/api/contracts/share', data)
      router.reload()
    } catch (e) {
      if (e.response.status === 422) {
        toast({
          title: e.response.data.message,
          status: 'error',
          isClosable: true,
        })
      }
    }
  }

  async function removeFromFlight(contract) {
    // If cargo already selected, deselect first
    if (props.selectedCargo.find((sc) => sc.id === contract.id))
      props.handleCargoSelect(contract)

    const data = {
      id: contract.id,
      userId: auth.user.id,
      action: 'remove',
    }
    await axios.post('/api/contracts/bid', data)

    router.reload()
  }

  const labelStyles = {
    mt: '2',
    ml: '-2.5',
    fontSize: 'sm',
  }

  return (
    <Box mt={2}>
      <Card>
        <CardHeader>
          <Heading size="md">Select Cargo</Heading>
        </CardHeader>
        <CardBody>
          <Flex justifyContent="space-between">
            <Box>
              <Checkbox
                isChecked={props.deadHead}
                onChange={props.handleDeadHead}
              >
                <Text>Deadhead - Run empty</Text>
              </Checkbox>
            </Box>
            <Button
              mb={1}
              size="sm"
              colorScheme="gray"
              onClick={() => setShowCustom(!showCustom)}
            >
              {showCustom ? <Icon as={X} /> : 'Create Custom Contract'}
            </Button>
          </Flex>
          {showCustom && (
            <CustomContract hideSection={() => setShowCustom(false)} />
          )}
          {props.cargo.cargoAtAirport.length === 0 ? (
            <NoContent content={<EmptyData content="Cargo" />} />
          ) : (
            !props.deadHead && (
              <div className="overflow-x-auto">
                <Heading size="sm">Cargo at Current Location</Heading>
                <TableContainer mt={2}>
                  <Table colorScheme="blackAlpha" size="sm" variant="simple">
                    <Thead>
                      <Tr>
                        <Th></Th>
                        <Th>Current</Th>
                        <Th>Arrival</Th>
                        <Th>Distance</Th>
                        <Th>Heading</Th>
                        <Th>Cargo</Th>
                        <Th>Value</Th>
                        <Th></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {props.cargo.cargoAtAirport.map((detail) => (
                        <Tr
                          key={detail.id}
                          color={
                            props.selectedCargo.some((s) => s.id === detail.id)
                              ? 'orange.500'
                              : ''
                          }
                        >
                          <Td>
                            <Checkbox
                              id="sel"
                              isChecked={props.selectedCargo.some(
                                (s) => s.id === detail.id
                              )}
                              onChange={() => props.handleCargoSelect(detail)}
                            />
                          </Td>
                          <Td>{detail.current_airport_id}</Td>
                          <Td>
                            <Flex alignItems="center" gap={2}>
                              {detail.arr_airport_id}{' '}
                              {detail.arr_airport.longest_runway_surface ===
                                'W' && <Icon as={Anchor} color="blue.500" />}
                              <AvailableFuel
                                airport={detail.arr_airport}
                                stack={true}
                              />
                            </Flex>
                          </Td>
                          <Td>
                            {detail.distance.toLocaleString(navigator.language)}{' '}
                            nm
                          </Td>
                          <Td>
                            <Flex alignItems="center">
                              <Box className="mr-2">{detail.heading}</Box>
                              <Box
                                style={{
                                  transform: `rotate(${detail.heading}deg)`,
                                }}
                              >
                                <Icon as={ArrowUp} />
                              </Box>
                            </Flex>
                          </Td>
                          <Td>
                            {detail.cargo_type === 1 ? (
                              <div>
                                <span>
                                  {detail.cargo_qty.toLocaleString(
                                    navigator.language
                                  )}{' '}
                                  lbs
                                </span>
                                <Text fontSize="xs">{detail.cargo}</Text>
                              </div>
                            ) : (
                              <div>
                                <span>{detail.cargo_qty}</span>{' '}
                                <Text fontSize="xs">{detail.cargo}</Text>
                              </div>
                            )}
                            {detail.is_custom ? (
                              <Tag size="sm">Custom</Tag>
                            ) : (
                              <></>
                            )}
                            {detail.is_fuel ? <Tag size="sm">Fuel</Tag> : <></>}
                          </Td>
                          <Td>${displayNumber(detail.contract_value, true)}</Td>
                          <Td>
                            <Flex align="center" gap={1}>
                              {detail.is_shared ? <Tag>Shared</Tag> : <></>}
                              {detail.airport ? <Tag>Hub</Tag> : <></>}
                              {!detail.is_shared && (
                                <Tooltip label="Share contract" placement="top">
                                  <Button
                                    onClick={() => handleShareContract(detail)}
                                    size="xs"
                                    colorScheme="gray"
                                  >
                                    <Icon as={Share2} />
                                  </Button>
                                </Tooltip>
                              )}
                              {!detail.is_fuel && (
                                <Popover>
                                  <Tooltip
                                    label="Split contract"
                                    placement="top"
                                  >
                                    {/* random box hack needed as worked around to tooltip and popover*/}
                                    <Box display="inline-block">
                                      <PopoverTrigger>
                                        <Button
                                          onClick={() =>
                                            handleSplitClick(detail)
                                          }
                                          size="xs"
                                          colorScheme="gray"
                                        >
                                          <Icon as={Split} />
                                        </Button>
                                      </PopoverTrigger>
                                    </Box>
                                  </Tooltip>
                                  <PopoverContent>
                                    <PopoverArrow />
                                    <PopoverCloseButton />
                                    <PopoverHeader>
                                      Split Contract
                                    </PopoverHeader>
                                    <PopoverBody>
                                      <Slider
                                        defaultValue={sliderValue}
                                        my={2}
                                        min={5}
                                        max={100}
                                        step={5}
                                        aria-label="slider-ex-6"
                                        onChange={(val) =>
                                          updateSlideValue(
                                            val,
                                            detail.cargo_qty
                                          )
                                        }
                                      >
                                        <SliderMark value={25} {...labelStyles}>
                                          25%
                                        </SliderMark>
                                        <SliderMark value={50} {...labelStyles}>
                                          50%
                                        </SliderMark>
                                        <SliderMark value={75} {...labelStyles}>
                                          75%
                                        </SliderMark>
                                        <SliderTrack>
                                          <SliderFilledTrack />
                                        </SliderTrack>
                                        <SliderThumb />
                                      </Slider>
                                    </PopoverBody>
                                    <PopoverFooter>
                                      <Flex
                                        justifyContent="space-between"
                                        alignItems="center"
                                      >
                                        <Button
                                          onClick={() =>
                                            splitContract(detail.id)
                                          }
                                          size="sm"
                                        >
                                          Save Split
                                        </Button>
                                        <Text>
                                          {displayNumber(
                                            parseInt(sliderCargoValue),
                                            false
                                          )}
                                        </Text>
                                      </Flex>
                                    </PopoverFooter>
                                  </PopoverContent>
                                </Popover>
                              )}
                              {!detail.is_shared && (
                                <Tooltip
                                  label="Cancel contract"
                                  placement="top"
                                >
                                  <Button
                                    onClick={() => removeFromFlight(detail)}
                                    size="xs"
                                    colorScheme="gray"
                                  >
                                    <Icon as={X} />
                                  </Button>
                                </Tooltip>
                              )}
                            </Flex>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </div>
            )
          )}
          {props.cargo.cargoElsewhere && (
            <div>
              <Heading mt={2} size="sm">
                Cargo Elsewhere
              </Heading>
              <TableContainer mt={2}>
                <Table colorScheme="blackAlpha" size="sm" variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Current</Th>
                      <Th>Arrival</Th>
                      <Th>Distance</Th>
                      <Th>Heading</Th>
                      <Th>Cargo</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {props.cargo.cargoElsewhere.map((detail) => (
                      <Tr key={detail.id}>
                        <Td>{detail.current_airport_id}</Td>
                        <Td>
                          <Flex alignItems="center" gap={2}>
                            {detail.arr_airport_id}{' '}
                            {detail.arr_airport.longest_runway_surface ===
                              'W' && <Icon as={Anchor} color="blue.500" />}
                          </Flex>
                        </Td>
                        <Td>
                          {detail.distance.toLocaleString(navigator.language)}{' '}
                          nm
                        </Td>
                        <Td>
                          <Flex alignItems="center">
                            <Box className="mr-2">{detail.heading}</Box>
                            <Box
                              style={{
                                transform: `rotate(${detail.heading}deg)`,
                              }}
                            >
                              <Icon as={ArrowUp} />
                            </Box>
                          </Flex>
                        </Td>
                        <Td>
                          {detail.cargo_type === 1 ? (
                            <div>
                              <span>
                                {detail.cargo_qty.toLocaleString(
                                  navigator.language
                                )}{' '}
                                lbs
                              </span>
                              <Text fontSize="xs">{detail.cargo}</Text>
                            </div>
                          ) : (
                            <div>
                              <span>{detail.cargo_qty}</span>{' '}
                              <Text fontSize="xs">{detail.cargo}</Text>
                            </div>
                          )}
                        </Td>
                        <Td>
                          <Flex gap={1}>
                            {detail.is_shared ? <Tag>Shared</Tag> : <></>}
                            {detail.airport ? <Tag>Hub</Tag> : <></>}
                          </Flex>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </div>
          )}
        </CardBody>
      </Card>
    </Box>
  )
}

export default Cargo
