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
  Tr,
} from '@chakra-ui/react'
import { router, usePage } from '@inertiajs/react'
import axios from 'axios'
import { Archive, ArrowUp, X } from 'lucide-react'
import React, { useState } from 'react'

import { displayNumber } from '../../helpers/number.helpers.js'
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
    if (sliderCargoValue < 1) {
      alert('Cannot have zero cargo!')
      return
    }
    const data = {
      id: contractId,
      qty: parseInt(sliderCargoValue),
      userId: auth.user.id,
    }
    await axios.post('/api/contracts/split', data)

    router.reload()
  }

  async function removeFromFlight(contract) {
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
              colorScheme="gray"
              onClick={() => setShowCustom(!showCustom)}
            >
              {showCustom ? <Icon as={X} /> : 'Create Custom Contract'}
            </Button>
          </Flex>
          {showCustom && (
            <div className="my-4 flex justify-center">
              <CustomContract hideSection={() => setShowCustom(false)} />
            </div>
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
                            {detail.arr_airport_id}{' '}
                            {detail.arr_airport.longest_runway_surface ===
                              'W' && (
                              <span className="material-icons md-18">
                                anchor
                              </span>
                            )}
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
                                </span>{' '}
                                <span className="text-xs">{detail.cargo}</span>
                              </div>
                            ) : (
                              <div>
                                <span>{detail.cargo_qty}</span>{' '}
                                <span className="text-xs">{detail.cargo}</span>
                              </div>
                            )}
                            {detail.is_custom ? <Tag>Custom</Tag> : <></>}
                          </Td>
                          <Td>
                            <Flex align="center" gap={2}>
                              <Popover>
                                <PopoverTrigger>
                                  <Button
                                    onClick={() => handleSplitClick(detail)}
                                    size="xs"
                                    colorScheme="gray"
                                  >
                                    Split
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                  <PopoverArrow />
                                  <PopoverCloseButton />
                                  <PopoverHeader>Split Contract</PopoverHeader>
                                  <PopoverBody>
                                    <Slider
                                      defaultValue={sliderValue}
                                      my={2}
                                      min={5}
                                      max={100}
                                      step={5}
                                      aria-label="slider-ex-6"
                                      onChange={(val) =>
                                        updateSlideValue(val, detail.cargo_qty)
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
                                        onClick={() => splitContract(detail.id)}
                                        size="sm"
                                      >
                                        Save Split
                                      </Button>
                                      <Text>
                                        {displayNumber(sliderCargoValue, false)}
                                      </Text>
                                    </Flex>
                                  </PopoverFooter>
                                </PopoverContent>
                              </Popover>

                              <Button
                                onClick={() => removeFromFlight(detail)}
                                size="xs"
                                colorScheme="gray"
                              >
                                <Icon as={X} />
                              </Button>
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
                          {detail.arr_airport_id}{' '}
                          {detail.arr_airport.longest_runway_surface ===
                            'W' && (
                            <span className="material-icons md-18">anchor</span>
                          )}
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
                              </span>{' '}
                              <span className="text-xs">{detail.cargo}</span>
                            </div>
                          ) : (
                            <div>
                              <span>{detail.cargo_qty}</span>{' '}
                              <span className="text-xs">{detail.cargo}</span>
                            </div>
                          )}
                        </Td>
                        <Td>
                          <Button
                            size="xs"
                            colorScheme="gray"
                            onClick={() => removeFromFlight(detail)}
                          >
                            <Icon as={X} />
                          </Button>
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
