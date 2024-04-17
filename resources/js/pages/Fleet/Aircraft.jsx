import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
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
import { router, usePage } from '@inertiajs/react'
import { format } from 'date-fns'
import { Wrench } from 'lucide-react'
import React from 'react'

import StatDisplay from '../../components/elements/StatDisplay.jsx'
import AircraftCondition from '../../components/fleet/AircraftCondition'
import AircraftMap from '../../components/fleet/AircraftMap'
import AppLayout from '../../components/layout/AppLayout'
import { convertMinuteDecimalToHoursAndMinutes } from '../../helpers/date.helpers'

const Aircraft = ({ aircraft, maintenanceStatus, pireps }) => {
  const { auth } = usePage().props

  const calculateDistanceFlown = (p) => {
    return p.reduce((a, pirep) => {
      return a + pirep.distance
    }, 0)
  }

  const shouldShowMaintenance = () => {
    if (aircraft.owner_id > 0) {
      return aircraft.owner_id === auth.user.id
    } else {
      return auth.user.user_roles.includes('fleet_manager')
    }
  }

  const renderMaintenanceType = (maintenanceType) => {
    switch (maintenanceType) {
      case 1:
        return 'Engine 100 hour'
      case 2:
        return 'Engine TBO'
      case 3:
        return 'Annual airframe inspection'
      case 4:
        return 'General Maintenance'
      case 5:
        return 'Engine Maintenance'
    }
  }

  const checkAircraftAtHub = (aircraft) => {
    if (aircraft.location.is_hub || aircraft.location.size >= 3) return true
  }

  const handleTBO = (aircraft, engine) => {
    const res = checkAircraftAtHub(aircraft)
    if (!res) {
      window.alert('Maintenance is not available at this airport')
      return
    }
    let cost = 0.0
    switch (aircraft.fleet.size) {
      case 'S':
        cost = 15000.0
        break
      case 'M':
        cost = 30000.0
        break
      case 'L':
        cost = 60000.0
        break
    }
    const accept = window.confirm(
      `TBO will cost $${cost}, do you want to proceed?`
    )
    if (!accept) return
    const data = {
      aircraft: aircraft.id,
      engine,
      type: 2,
      cat: 'Inspection',
    }
    router.post('/aircraft/maintenance', data)
  }
  //
  const handle100hr = (aircraft, engine) => {
    const res = checkAircraftAtHub(aircraft)
    if (!res) {
      window.alert('Maintenance is not available at this airport')
      return
    }

    const accept = window.confirm(
      '100 hour check will cost $2000.00, do you want to proceed?'
    )
    if (!accept) return

    const data = {
      aircraft: aircraft.id,
      engine,
      type: 1,
      cat: 'Inspection',
    }
    router.post('/aircraft/maintenance', data)
  }

  const handleAnnual = (aircraft) => {
    const res = checkAircraftAtHub(aircraft)
    if (!res) {
      window.alert('Maintenance is not available at this airport')
      return
    }

    const accept = window.confirm(
      'Annual airframe check will cost $2000.00, do you want to proceed?'
    )
    if (!accept) return

    const data = {
      aircraft: aircraft.id,
      type: 3,
      cat: 'Inspection',
    }
    router.post('/aircraft/maintenance', data)
  }

  const handleRelocate = (aircraft) => {
    const dest = window.prompt(
      'Enter ICAO of destination airport',
      aircraft.hub_id
    )
    if (!dest || dest.length < 2) return

    const data = {
      aircraft: aircraft.id,
      dest: dest,
    }

    router.post('/aircraft/maintenance/relocate', data)
  }

  const handleGeneralMaintenance = (
    aircraft,
    maintenanceType,
    engine = null
  ) => {
    const res = checkAircraftAtHub(aircraft)
    if (!res) {
      window.alert('Maintenance is not available at this airport')
      return
    }
    const accept = window.confirm(
      `Are you sure you want to proceed with ${
        maintenanceType === 4 ? 'General' : 'Engine'
      } maintenance?`
    )
    if (!accept) return

    const data = {
      aircraft: aircraft.id,
      engine,
      type: maintenanceType,
      cat: 'General',
    }
    router.post('/aircraft/maintenance', data)
  }

  return (
    <>
      <Flex justifyItems="start" alignItems="center">
        <Heading size="md">{`${aircraft.registration} - ${aircraft.fleet.manufacturer} ${aircraft.fleet.name} (${aircraft.fleet.type})`}</Heading>
        {aircraft.maintenance_status && !aircraft.is_rental && (
          <Icon ml={2} color="orange.500" as={Wrench} />
        )}
        {aircraft.is_rental ? <Tag ml={2}>Rental</Tag> : <></>}
        {aircraft.owner_id > 0 && aircraft.owner_id === auth.user.id ? (
          <Tag ml={2}>Private Plane - Owner</Tag>
        ) : aircraft.owner_id > 0 ? (
          <Tag ml={2}>Private Plane</Tag>
        ) : (
          <></>
        )}
      </Flex>
      <SimpleGrid mt={2} columns={5} gap={5}>
        <Card>
          <CardBody>
            <StatDisplay stat={pireps.length} title="Flights" />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <StatDisplay
              stat={calculateDistanceFlown(pireps)}
              title="Distance Flown (nm)"
            />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <StatDisplay
              stat={aircraft.current_airport_id}
              link={'/airports/' + aircraft.current_airport_id}
              title="Current Location"
            />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <StatDisplay
              stat={aircraft.hub_id}
              link={'/airports/' + aircraft.hub_id}
              title="Home Hub"
            />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <StatDisplay
              stat={aircraft.fuel_onboard}
              title="Current Fuel (gal)"
            />
          </CardBody>
        </Card>
      </SimpleGrid>
      <SimpleGrid mt={2} columns={2} gap={5}>
        <Box>
          <Flex gap={5}>
            <Card>
              <CardBody>
                <StatDisplay
                  stat={(aircraft.flight_time_mins / 60).toFixed(2)}
                  title="Airframe Time"
                />
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <StatDisplay
                  stat={format(aircraft.last_inspected_at, 'dd/MM/yyyy')}
                  title="Last Inspection (Annual)"
                />
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <StatDisplay
                  stat={aircraft.fleet.tbo_mins / 60}
                  title="TBO Interval"
                />
              </CardBody>
            </Card>
            {maintenanceStatus['100hr'] ||
            maintenanceStatus.annual ||
            maintenanceStatus.tbo ? (
              <Box color="red.400">
                <Heading size="xs">Maintenance Required:</Heading>
                {maintenanceStatus.annual && (
                  <Text>Airframe Annual Inspection</Text>
                )}
                {maintenanceStatus['100hr'] && <Text>100 Hour Inspection</Text>}
                {maintenanceStatus.tbo && <Text>Engine Overhaul</Text>}
              </Box>
            ) : (
              <></>
            )}
          </Flex>
          <Box>
            {!aircraft.is_rental && (
              <Box mt={2}>
                <Card>
                  <CardHeader>
                    <Heading size="md">Maintenance</Heading>
                  </CardHeader>
                  <CardBody>
                    {shouldShowMaintenance() && (
                      <Flex mt={2} justifyContent="space-between">
                        <Flex gap={2}>
                          <Button
                            size="sm"
                            onClick={() =>
                              handleGeneralMaintenance(aircraft, 4)
                            }
                          >
                            General Maintenance
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAnnual(aircraft)}
                          >
                            Annual Inspection
                          </Button>
                        </Flex>
                        {auth.user.user_roles.includes('fleet_manager') && (
                          <Button
                            size="sm"
                            onClick={() => handleRelocate(aircraft)}
                          >
                            Relocate
                          </Button>
                        )}
                      </Flex>
                    )}
                    <Box mt={2} my={4}>
                      <Heading mb={2} size="sm">
                        Airframe Condition
                      </Heading>
                      <AircraftCondition aircraftCondition={aircraft.wear} />
                    </Box>
                    <TableContainer>
                      <Table className="table table-compact w-full">
                        <Thead>
                          <Tr>
                            <Th>Engine #</Th>
                            <Th>Time since 100 hr</Th>
                            <Th>Time since TBO</Th>
                            <Th>Condition</Th>
                            {shouldShowMaintenance() && <Th>Action</Th>}
                          </Tr>
                        </Thead>
                        <Tbody>
                          {aircraft.engines.map((engine) => (
                            <Tr key={engine.id}>
                              <Td>{engine.engine_no}</Td>
                              <Td>
                                {(engine.mins_since_100hr / 60).toFixed(2)}
                                {shouldShowMaintenance() && (
                                  <Button
                                    ml={2}
                                    colorScheme="gray"
                                    size="xs"
                                    onClick={() =>
                                      handle100hr(aircraft, engine.id)
                                    }
                                  >
                                    100 hr
                                  </Button>
                                )}
                              </Td>
                              <Td>
                                {(engine.mins_since_tbo / 60).toFixed(2)}
                                {shouldShowMaintenance() && (
                                  <Button
                                    ml={2}
                                    colorScheme="gray"
                                    size="xs"
                                    onClick={() =>
                                      handleTBO(aircraft, engine.id)
                                    }
                                  >
                                    TBO
                                  </Button>
                                )}
                              </Td>
                              <Td>
                                <AircraftCondition
                                  aircraftCondition={engine.wear}
                                />
                              </Td>
                              {shouldShowMaintenance() && (
                                <Td>
                                  <Button
                                    onClick={() =>
                                      handleGeneralMaintenance(
                                        aircraft,
                                        5,
                                        engine.id
                                      )
                                    }
                                    ml={2}
                                    colorScheme="gray"
                                    size="xs"
                                  >
                                    Engine Maintenance
                                  </Button>
                                </Td>
                              )}
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </CardBody>
                </Card>
              </Box>
            )}
          </Box>
          <Box>
            {!aircraft.is_rental && (
              <>
                <Card>
                  <CardHeader>
                    <Heading size="md">Maintenance Log</Heading>
                  </CardHeader>
                  <CardBody>
                    <TableContainer>
                      <Table>
                        <Thead>
                          <Tr>
                            <Th>Type</Th>
                            <Th>Cost</Th>
                            <Th>Date</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {aircraft.maintenance.map((maintenance) => (
                            <Tr key={maintenance.id}>
                              <Td>
                                {renderMaintenanceType(
                                  maintenance.maintenance_type
                                )}
                              </Td>
                              <Td>{maintenance.cost}</Td>
                              <Td>
                                {format(maintenance.created_at, 'dd/MM/yyyy')}
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </CardBody>
                </Card>
              </>
            )}
          </Box>
        </Box>
        <Card>
          <CardBody>
            <AircraftMap aircraft={aircraft} size="large" />
          </CardBody>
        </Card>
      </SimpleGrid>
      <Box mt={2}>
        <Card>
          <CardHeader>
            <Heading size="md">Flights</Heading>
          </CardHeader>
          <CardBody>
            <TableContainer>
              <Table>
                <Thead>
                  <Tr>
                    <Th>Date</Th>
                    <Th>Departure</Th>
                    <Th>Arrival</Th>
                    <Th>Distance</Th>
                    <Th>Time</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {pireps &&
                    pireps.map((pirep) => (
                      <Tr key={pirep.id}>
                        <Td>{pirep.submitted_at}</Td>
                        <Td>{pirep.departure_airport_id}</Td>
                        <Td>{pirep.destination_airport_id}</Td>
                        <Td>{pirep.distance}</Td>
                        <Td>
                          {convertMinuteDecimalToHoursAndMinutes(
                            pirep.flight_time
                          )}
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>
      </Box>
    </>
  )
}

Aircraft.layout = (page) => (
  <AppLayout
    children={page}
    title="Aircraft Details"
    heading="Aircraft Details"
  />
)

export default Aircraft
