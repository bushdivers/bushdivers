import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Icon,
  Table,
  Tag,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react'
import { Link, usePage } from '@inertiajs/react'
import { Ship, Wrench } from 'lucide-react'
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
  const selectedCol = useColorModeValue('orange.300', 'orange.700')
  const { auth } = usePage().props
  return (
    <Box>
      <Card>
        <CardHeader pb={0}>
          <Heading size="md">Select Aircraft</Heading>
        </CardHeader>
        <CardBody>
          {props.aircraft.length === 0 ? (
            <NoContent content={<EmptyData content="Aircraft" />} />
          ) : (
            <Table colorScheme="blackAlpha" size="sm" variant="simple">
              <Thead>
                <Tr>
                  <Th>Registration</Th>
                  <Th>Type</Th>
                  <Th textAlign={'right'}>Fuel</Th>
                  <Th>Condition</Th>
                </Tr>
              </Thead>
              <Tbody>
                {props.aircraft.map((ac) => (
                  <Tr
                    key={ac.id + ac.registration}
                    onClick={() => props.handleAircraftSelect(ac)}
                    bgColor={
                      props.selectedAircraft?.registration === ac.registration
                        ? selectedCol
                        : ''
                    }
                  >
                    <Td style={{ whiteSpace: 'nowrap' }}>
                      <Tooltip content={`Hub: ${ac.hub_id}`} direction="right">
                        <Flex alignItems="center">
                          {ac.hub_id && (
                            <Link href={`/aircraft/${ac.id}`}>
                              {ac.registration}
                            </Link>
                          )}
                          {ac.is_ferry && (
                            <Box mx={2}>
                              <Box color="orange.400">
                                <Icon as={Ship} />
                              </Box>
                            </Box>
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
                              <Tag size="sm">Private</Tag>
                            </Box>
                          ) : (
                            <></>
                          )}
                          {ac.rental_airport_id && (
                            <Box mx={2}>
                              <Tag size="sm">Rental</Tag>
                            </Box>
                          )}
                        </Flex>
                      </Tooltip>
                    </Td>
                    <Td pr={0}>
                      {ac.fleet.manufacturer} {ac.fleet.name} ({ac.fleet.type})
                    </Td>
                    <Td textAlign={'right'} pl={0}>
                      {ac.fuel_onboard.toLocaleString(navigator.language)}
                    </Td>
                    <Td>
                      {ac.rental_airport_id ? (
                        'N/A'
                      ) : (
                        <AircraftCondition
                          aircraftCondition={ac.total_condition}
                        />
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </CardBody>
      </Card>
    </Box>
  )
}

export default Aircraft
