import React, { useState } from 'react'
import NoContent from '../../Elements/NoContent'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Inertia } from '@inertiajs/inertia'
import { usePage } from '@inertiajs/inertia-react'
import { X, Archive } from 'lucide-react'
import { Box, Card, CardHeader, CardBody, Heading, Text, Flex, Checkbox, Button, Table, Thead, Tbody, Th, Tr, Td, TableContainer, Tag, Icon } from '@chakra-ui/react'
import CustomContract from '../Contracts/CustomContract'

const EmptyData = (props) => {
  return (
    <>
      <Icon color="gray.50" as={Archive} />
      <Text>There is no available {props.content}</Text>
    </>
  )
}

const Cargo = (props) => {
  const { auth } = usePage().props
  const [showCustom, setShowCustom] = useState(false)

  async function removeFromFlight (contract) {
    const data = {
      id: contract.id,
      userId: auth.user.id,
      action: 'remove'
    }
    const assign = axios.post('/api/contracts/assign', data)
    await toast.promise(assign, {
      loading: '...Removing contract',
      success: 'Contract removed!',
      error: 'Issue removing contract'
    }, { position: 'top-right' })
    Inertia.reload()
  }

  return (
    <Box mt={2}>
      <Card>
        <CardHeader>
        <Heading size='md'>Select Cargo</Heading>
        </CardHeader>
        <CardBody>
        <Flex justifyContent="space-between">
          <Box>
            <Checkbox isChecked={props.deadHead} onChange={props.handleDeadHead}><Text>Deadhead - Run empty</Text></Checkbox>
          </Box>
          <Button colorScheme="gray" onClick={() => setShowCustom(!showCustom)}>{showCustom ? <Icon as={X} /> : 'Create Custom Contract'}</Button>
        </Flex>
        {showCustom && (<div className="my-4 flex justify-center"><CustomContract hideSection={() => setShowCustom(false)} /></div>)}
      {props.cargo.cargoAtAirport.length === 0
        ? <NoContent content={<EmptyData content="Cargo" />} />
        : (
            !props.deadHead && (
            <div className="overflow-x-auto">
              <Heading size="sm">Cargo at Current Location</Heading>
              <TableContainer mt={2}>
                <Table colorScheme='blackAlpha' size="sm" variant="simple">
                <Thead>
                <Tr>
                  <Th></Th>
                  <Th>Current</Th>
                  <Th>Arrival</Th>
                  <Th>Distance</Th>
                  <Th>Heading</Th>
                  <Th>Type</Th>
                  <Th>Cargo</Th>
                  <Th></Th>
                </Tr>
                </Thead>
                <Tbody>
                {props.cargo.cargoAtAirport.map((detail) => (
                  <Tr key={detail.id} color={props.selectedCargo.some(s => s.id === detail.id) ? 'orange.500' : ''}>
                    <Td><input id="sel" checked={props.selectedCargo.some(s => s.id === detail.id)} onChange={() => props.handleCargoSelect(detail)} type="checkbox" className="form-checkbox rounded border-gray-300 dark:bg-gray-700 text-orange-500 shadow-sm focus:border-orange-300 focus:ring focus:ring-offset-0 focus:ring-orange-200 focus:ring-opacity-50" /></Td>
                    <Td>{detail.current_airport_id}</Td>
                    <Td>{detail.arr_airport_id} {detail.arr_airport.longest_runway_surface === 'W' && <span className="material-icons md-18">anchor</span>}</Td>
                    <Td>{detail.distance.toLocaleString(navigator.language)} nm</Td>
                    <Td>
                      <Flex alignItems="center">
                        <Box className="mr-2">{detail.heading}</Box>
                        <Box style={{ transform: `rotate(${detail.heading}deg)` }}><FontAwesomeIcon icon={faArrowUp} /></Box>
                      </Flex>
                    </Td>
                    <Td>{detail.cargo_type === 1 ? 'Cargo' : 'Passenger'}</Td>
                    <Td>
                      {detail.cargo_type === 1
                        ? <div><span>{detail.cargo_qty.toLocaleString(navigator.language)} lbs</span> <span className="text-xs">{detail.cargo}</span></div>
                        : <div><span>{detail.cargo_qty}</span> <span className="text-xs">{detail.cargo}</span></div>
                      }
                      {detail.is_custom ? <Tag>Custom</Tag> : <></>}
                    </Td>
                    <Td><Button onClick={() => removeFromFlight(detail)} size="xs" colorScheme="gray"><Icon as={X} /></Button></Td>
                  </Tr>
                ))}
                </Tbody>
              </Table>
              </TableContainer>
            </div>
            )
          )
      }
        {props.cargo.cargoElsewhere && (
        <div className="overflow-x-auto mt-2">
          <Heading size="sm">Cargo Elsewhere</Heading>
          <TableContainer mt={2}>
                <Table colorScheme='blackAlpha' size="sm" variant="simple">
            <Thead>
            <Tr>
              <Th>Current</Th>
              <Th>Arrival</Th>
              <Th>Distance</Th>
              <Th>Heading</Th>
              <Th>Type</Th>
              <Th>Cargo</Th>
              <Th></Th>
            </Tr>
            </Thead>
            <Tbody>
            {props.cargo.cargoElsewhere.map((detail) => (
              <Tr key={detail.id}>
                <Td>{detail.current_airport_id}</Td>
                <Td>{detail.arr_airport_id} {detail.arr_airport.longest_runway_surface === 'W' && <span className="material-icons md-18">anchor</span>}</Td>
                <Td>{detail.distance.toLocaleString(navigator.language)} nm</Td>
                <Td>
                  <div className="flex items-center">
                    <div className="w-1/2">
                      <span className="mr-2">{detail.heading}</span>
                    </div>
                    <div className="w-1/2 flex">
                      <span style={{ transform: `rotate(${detail.heading}deg)` }}><FontAwesomeIcon icon={faArrowUp} /></span>
                    </div>
                  </div>
                </Td>
                <Td>{detail.cargo_type === 1 ? 'Cargo' : 'Passenger'}</Td>
                <Td>
                  {detail.cargo_type === 1
                    ? <div><span>{detail.cargo_qty.toLocaleString(navigator.language)} lbs</span> <span className="text-xs">{detail.cargo}</span></div>
                    : <div><span>{detail.cargo_qty}</span> <span className="text-xs">{detail.cargo}</span></div>
                  }
                </Td>
                <Td><Button size="xs" colorScheme="gray" onClick={() => removeFromFlight(detail)}><Icon as={X} /></Button></Td>
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
