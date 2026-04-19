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
import {
  Anchor,
  Archive,
  ArrowUp,
  Package,
  Share2,
  Split,
  X,
} from 'lucide-react'
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
  const [sliderCargoValue, setSliderCargoValue] = useState(null)
  const { auth } = usePage().props
  const [showCustom, setShowCustom] = useState(false)

  function updateSlideValue(val) {
    setSliderCargoValue(val)
  }

  function handleSplitClick(cargo) {
    const step = cargo.min_cargo_split ?? 1
    const half = Math.round(cargo.cargo_qty / 2 / step) * step
    const clamped = Math.min(Math.max(half, step), cargo.cargo_qty - step)
    if (cargoForSplit !== cargo.id) {
      setSliderCargoValue(clamped)
    }
    setCargoForSplit(cargo.id)
  }

  async function splitContract(contractId) {
    console.log(props.selectedCargo)
    if (
      props.selectedCargo.length > 0 &&
      props.selectedCargo.find((sc) => sc.id === contractId)
    ) {
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
    }
    try {
      await axios.post('/api/contracts/split', data)
      router.reload()
    } catch (e) {
      if (e.response.status >= 400) {
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
                              isChecked={props.selectedCargo.some(
                                (s) => s.id === detail.id
                              )}
                              onChange={() => props.handleCargoSelect(detail)}
                            />
                          </Td>
                          <Td>
                            {props.currentAirport.identifier}{' '}
                            {props.currentAirport.longest_runway_surface ===
                              'W' && <Icon as={Anchor} color="blue.500" />}
                            {props.currentAirport.is_thirdparty && (
                              <Icon as={Package} color="green.500" />
                            )}
                          </Td>
                          <Td>
                            <Flex alignItems="center" gap={2}>
                              {detail.arr_airport.identifier}{' '}
                              {detail.arr_airport.longest_runway_surface ===
                                'W' && <Icon as={Anchor} color="blue.500" />}
                              {detail.arr_airport.is_thirdparty && (
                                <Icon as={Package} color="green.500" />
                              )}
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
                              {detail.hub_airport_id ? <Tag>Hub</Tag> : <></>}
                              {detail.community_job_contract_id ? (
                                <Tag>Community</Tag>
                              ) : (
                                <></>
                              )}
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
                              {!detail.is_fuel &&
                                (() => {
                                  const step = detail.min_cargo_split ?? 1
                                  const canSplit = detail.cargo_qty >= step * 2
                                  return (
                                    <Popover>
                                      <Tooltip
                                        label={
                                          canSplit
                                            ? 'Split contract'
                                            : `Min split is ${step} units`
                                        }
                                        placement="top"
                                      >
                                        {/* random box hack needed as worked around to tooltip and popover*/}
                                        <Box display="inline-block">
                                          <PopoverTrigger>
                                            <Button
                                              onClick={() =>
                                                canSplit &&
                                                handleSplitClick(detail)
                                              }
                                              isDisabled={!canSplit}
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
                                          {(() => {
                                            const minVal = step
                                            const maxVal = Math.max(
                                              detail.cargo_qty - step,
                                              step
                                            )
                                            return (
                                              <Slider
                                                value={
                                                  sliderCargoValue ?? minVal
                                                }
                                                my={2}
                                                min={minVal}
                                                max={maxVal}
                                                step={step}
                                                aria-label="split-slider"
                                                onChange={(val) =>
                                                  updateSlideValue(val)
                                                }
                                              >
                                                <SliderTrack>
                                                  <SliderFilledTrack />
                                                </SliderTrack>
                                                <SliderThumb />
                                              </Slider>
                                            )
                                          })()}
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
                                              {detail.cargo_type === 1
                                                ? ' lbs'
                                                : ' pax'}
                                              {step > 1 && (
                                                <Text
                                                  as="span"
                                                  fontSize="xs"
                                                  color="gray.500"
                                                  ml={1}
                                                >
                                                  (
                                                  {Math.round(
                                                    parseInt(sliderCargoValue) /
                                                      step
                                                  )}{' '}
                                                  units)
                                                </Text>
                                              )}
                                            </Text>
                                          </Flex>
                                        </PopoverFooter>
                                      </PopoverContent>
                                    </Popover>
                                  )
                                })()}
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
                        <Td>
                          {detail.current_airport.identifier}{' '}
                          {detail.current_airport.longest_runway_surface ===
                            'W' && <Icon as={Anchor} color="blue.500" />}
                          {detail.current_airport.is_thirdparty && (
                            <Icon as={Package} color="green.500" />
                          )}
                        </Td>
                        <Td>
                          <Flex alignItems="center" gap={2}>
                            {detail.arr_airport.identifier}{' '}
                            {detail.arr_airport.longest_runway_surface ===
                              'W' && <Icon as={Anchor} color="blue.500" />}
                            {detail.arr_airport.is_thirdparty && (
                              <Icon as={Package} color="green.500" />
                            )}
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
                            {detail.community_job_contract_id ? (
                              <Tag>Community</Tag>
                            ) : (
                              <></>
                            )}
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
