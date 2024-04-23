import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Link as ChakraLink,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
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
import { Link, router } from '@inertiajs/react'
import { ArrowUp } from 'lucide-react'
import React from 'react'

import DispatchSummary from '../../components/dispatch/DispatchSummary'
import AppLayout from '../../components/layout/AppLayout'
import { displayNumber, personWeight } from '../../helpers/number.helpers'

const ActiveDispatch = ({
  cargo,
  aircraft,
  cargoWeight,
  fuelWeight,
  passengerCount,
  pirep,
}) => {
  function handleCancel() {
    const res = window.confirm(
      'You have an active flight, if you cancel now you will lose all progress'
    )
    if (res) {
      router.post('/dispatch/cancel', { pirep: pirep.id })
    }
  }

  return (
    <Box>
      <Flex alignItems="center">
        {pirep.id}{' '}
        <ChakraLink as={Link} href="/pireps/submit">
          <Button colorScheme="gray">Submit Manual Pirep</Button>
        </ChakraLink>
        <Box ml={2}>
          {pirep.tour_id && <Tag>Tour Flight: {pirep.tour.title}</Tag>}
        </Box>
      </Flex>
      {pirep.state === 2 && (
        <Box>
          <Text color="green.600">Current flight in progress</Text>
        </Box>
      )}
      <Flex mt={4} justifyContent="space-between">
        <SimpleGrid columns={2} spacing={10}>
          <Box>
            <Card>
              <CardHeader>
                <Heading size="sm">Selected Cargo</Heading>
              </CardHeader>
              <CardBody>
                <TableContainer>
                  <Table colorScheme="blackAlpha" size="sm" variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Contract</Th>
                        <Th>Current</Th>
                        <Th>Arrival</Th>
                        <Th>Distance</Th>
                        <Th>Heading</Th>
                        <Th>Type</Th>
                        <Th>Cargo</Th>
                        <Th>Contract Value</Th>
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
                              <span
                                style={{
                                  transform: `rotate(${detail.heading}deg)`,
                                }}
                              >
                                <Icon as={ArrowUp} />
                              </span>
                            </Flex>
                          </Td>
                          <Td>
                            {detail.cargo_type === 1 ? 'Cargo' : 'Passenger'}
                          </Td>
                          <Td>
                            {detail.cargo_type === 1 ? (
                              <Flex gap={2}>
                                <span>{detail.cargo_qty} lbs</span>{' '}
                                <Text size="sm">{detail.cargo}</Text>
                              </Flex>
                            ) : (
                              <Flex gap={2}>
                                <span>{detail.cargo_qty}</span>{' '}
                                <Text size="sm">{detail.cargo}</Text>
                              </Flex>
                            )}
                          </Td>
                          <Td>${displayNumber(detail.contract_value, true)}</Td>
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
              isActive={true}
            />
            <Flex justifyContent="right">
              <Box mt={2}>
                <Button onClick={handleCancel}>Cancel Dispatch</Button>
              </Box>
            </Flex>
          </Box>
        </SimpleGrid>
      </Flex>
    </Box>
  )
}

ActiveDispatch.layout = (page) => (
  <AppLayout
    children={page}
    title="Active Dispatch"
    heading="Active Dispatch"
  />
)

export default ActiveDispatch
