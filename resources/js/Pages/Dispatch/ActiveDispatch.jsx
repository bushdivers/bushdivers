import React from 'react'
import DispatchSummary from '../../Shared/Components/Dispatch/DispatchSummary'
import { Inertia } from '@inertiajs/inertia'
import AppLayout from '../../Components/Layout/AppLayout'
import { Link } from '@inertiajs/inertia-react'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Card, CardHeader, CardBody, Text, Heading, Box, Button, Flex, Link as ChakraLink, TableContainer, Table, Thead, Th, Tr, Tbody, Td, SimpleGrid } from '@chakra-ui/react'
import { personWeight } from '../../Helpers/number.helpers'

const ActiveDispatch = ({ cargo, aircraft, cargoWeight, fuelWeight, passengerCount, pirep }) => {
  function handleCancel () {
    const res = window.confirm('You have an active flight, if you cancel now you will lose all progress')
    if (res) {
      Inertia.post('/dispatch/cancel', { pirep: pirep.id })
    }
  }

  return (
    <Box>
      <Box>{pirep.id} <ChakraLink as={Link} href="/pireps/submit"><Button colorScheme="gray">Submit Manual Pirep</Button></ChakraLink></Box>
      {pirep.state === 2 && <Box><Text color="green.600">Current flight in progress</Text></Box>}
      <Flex mt={4} justifyContent="space-between">
      <SimpleGrid columns={2} spacing={10}>
          <Box>
            <Card>
              <CardHeader><Heading size="sm">Selected Cargo</Heading></CardHeader>
              <CardBody>
              <TableContainer>
                <Table colorScheme='blackAlpha' size="sm" variant="simple">
                  <Thead>
                  <Tr>
                    <Th>Contract</Th>
                    <Th>Current</Th>
                    <Th>Arrival</Th>
                    <Th>Distance</Th>
                    <Th>Heading</Th>
                    <Th>Type</Th>
                    <Th>Cargo</Th>
                  </Tr>
                  </Thead>
                  <Tbody>
                  {cargo.map((detail) => (
                    <Tr key={detail.id}>
                      <Td>{detail.id}</Td>
                      <Td>{detail.current_airport_id}</Td>
                      <Td>{detail.arr_airport_id}</Td>
                      <Td>{detail.distance} nm</Td>
                      <Td>
                        <Flex alignItems="center">
                            <span className="mr-2">{detail.heading}</span>
                            <span style={{ transform: `rotate(${detail.heading}deg)` }}><FontAwesomeIcon icon={faArrowUp} /></span>
                        </Flex>
                      </Td>
                      <Td>{detail.cargo_type_id === 1 ? 'Cargo' : 'Passenger'}</Td>
                      <Td>
                        {detail.cargo_type_id === 1
                          ? <Flex gap={2}><span>{detail.cargo_qty} lbs</span> <Text size="sm">{detail.cargo}</Text></Flex>
                          : <Flex gap={2}><span>{detail.cargo_qty}</span> <Text size="sm">{detail.cargo}</Text></Flex>
                        }
                      </Td>
                    </Tr>
                  ))}
                  </Tbody>
                </Table>
                </TableContainer>
              </CardBody>
            </Card>
          </Box>
          <Box>
            <DispatchSummary
              selectedAircraft={aircraft}
              selectedCargo={cargo}
              personWeight={personWeight}
              cargoWeight={cargoWeight}
              fuelWeight={fuelWeight}
              passengerCount={passengerCount}
              pirep={pirep}
              deadHead={pirep.is_empty}
            />
            <Flex justifyContent="right">
              <Box mt={2}><Button onClick={handleCancel}>Cancel Dispatch</Button></Box>
            </Flex>
          </Box>
          </SimpleGrid>
      </Flex>
    </Box>
  )
}

ActiveDispatch.layout = page => <AppLayout children={page} title="Active Dispatch" heading="Active Dispatch" />

export default ActiveDispatch
