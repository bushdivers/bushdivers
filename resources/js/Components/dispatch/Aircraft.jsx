import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Icon,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { Link, usePage } from '@inertiajs/react'
import { Wrench } from 'lucide-react'
import React from 'react'

import AircraftCondition from '../../components/fleet/AircraftCondition'
import NoContent from '../elements/NoContent'
import Tooltip from '../elements/Tooltip'

const EmptyData = (props) => {
  return (
    <>
      <div>There are no available {props.content}</div>
    </>
  )
}

const Aircraft = (props) => {
  const { auth } = usePage().props
  return (
    <Box>
      <Card>
        <CardHeader>
          <Heading size="md">Select Aircraft</Heading>
        </CardHeader>
        <CardBody>
          {props.aircraft.length === 0 ? (
            <NoContent content={<EmptyData content="Aircraft" />} />
          ) : (
            <TableContainer>
              <Table colorScheme="blackAlpha" size="sm" variant="simple">
                <Thead>
                  <Tr>
                    <Th>Registration</Th>
                    <Th>Type</Th>
                    <Th>Current Fuel</Th>
                    <Th>Condition</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {props.aircraft.map((ac) => (
                    <Tr
                      key={ac.id}
                      onClick={() => props.handleAircraftSelect(ac)}
                      className={
                        props.selectedAircraft.registration === ac.registration
                          ? 'text-primary cursor-pointer'
                          : 'cursor-pointer'
                      }
                    >
                      <Td>
                        <Tooltip
                          content={`Hub: ${ac.hub_id}`}
                          direction="right"
                        >
                          <Flex alignItems="center">
                            {ac.hub_id && (
                              <Link href={`/aircraft/${ac.id}`}>
                                {ac.registration}
                              </Link>
                            )}
                            {ac.maintenance_status && (
                              <Box mx={2}>
                                <Box color="orange.400">
                                  <Icon as={Wrench} />
                                </Box>
                              </Box>
                            )}
                            {ac.rental_airport_id && (
                              <span>{ac.registration}</span>
                            )}
                            {ac.owner_id === auth.user.id ? (
                              <Box mx={2}>
                                <Tag>Private</Tag>
                              </Box>
                            ) : (
                              <></>
                            )}
                            {ac.rental_airport_id && (
                              <Box mx={2}>
                                <Tag>Rental</Tag>
                              </Box>
                            )}
                          </Flex>
                        </Tooltip>
                      </Td>
                      <Td>
                        {ac.fleet.manufacturer} {ac.fleet.name} ({ac.fleet.type}
                        )
                      </Td>
                      <Td>
                        {ac.fuel_onboard.toLocaleString(navigator.language)}
                      </Td>
                      <Td>
                        <AircraftCondition
                          aircraftCondition={ac.total_condition}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </CardBody>
      </Card>
    </Box>
  )
}

export default Aircraft
