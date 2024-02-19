import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Image,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { Link, usePage } from '@inertiajs/react'
import { Wrench } from 'lucide-react'
import React from 'react'

import AircraftCondition from './AircraftCondition'

const FleetCardContent = ({ fleet }) => {
  const { auth } = usePage().props

  const renderAircraftStatus = (status) => {
    switch (status) {
      case 1:
        return 'Available'
      case 2:
        return 'Reserved'
      case 3:
        return 'In Use'
    }
  }

  const shouldShowMaintenance = () => {
    return auth.user.user_roles.includes('fleet_manager')
  }

  return (
    <Box>
      <Flex alignItems="start" justifyContent="start" gap={8}>
        <Flex direction="column" className="flex flex-col">
          <Box>
            <Heading size="md">
              {fleet.type} - {fleet.manufacturer} {fleet.name}
            </Heading>
            <Text>{fleet.aircraft.length} aircraft in fleet</Text>
          </Box>
          <Image borderRadius="md" src={fleet.image_url} />
        </Flex>
        <Box ml={2}>
          <Flex mt={2} gap={8}>
            <Box>
              <Text as="b">Powerplants:</Text>
              <Text>
                {fleet.number_of_engines}x {fleet.powerplants}
              </Text>
            </Box>
            <Box className="md:mr-8">
              <Text as="b" className="text-md font-bold text-base">
                Fuel Type:{' '}
              </Text>
              <Text>
                {fleet.fuel_type === 1 ? (
                  <span>Avgas</span>
                ) : (
                  <span>Jet Fuel</span>
                )}
              </Text>
            </Box>
            <Box className="mr-8">
              <Text as="b" className="text-md font-bold text-base">
                Fuel Capacity:
              </Text>
              <Text>
                {fleet.fuel_capacity.toLocaleString(navigator.language)} gal
              </Text>
            </Box>
          </Flex>
          <Box className="mr-8">
            <Text as="b" className="text-md font-bold text-base">
              Service Ceiling:
            </Text>
            <Text>
              {fleet.service_ceiling.toLocaleString(navigator.language)} ft
            </Text>
          </Box>
          <Box className="mr-8">
            <Text as="b" className="text-md font-bold text-base">
              Max Range:{' '}
            </Text>
            <Text>{fleet.range.toLocaleString(navigator.language)} nm</Text>
          </Box>
          <Box className="mr-8">
            <Text as="b" className="text-md font-bold text-base">
              Max Cruise Speed:
            </Text>
            <Text>
              {fleet.cruise_speed.toLocaleString(navigator.language)} kts
            </Text>
          </Box>
          <Box className="mr-8">
            <Text as="b" className="text-md font-bold text-base">
              PAX Capacity:
            </Text>
            <Text>{fleet.pax_capacity}</Text>
          </Box>
          <Box className="mr-8">
            <Text as="b" className="text-md font-bold text-base">
              Cargo Capacity:
            </Text>
            <Text>
              {fleet.cargo_capacity.toLocaleString(navigator.language)} lbs
            </Text>
          </Box>
        </Box>
      </Flex>
      {auth.user && (
        <Box>
          {fleet.aircraft.length > 0 && (
            <TableContainer mt={4}>
              <Table>
                <Thead>
                  <Tr>
                    <Th scope="col">Registration</Th>
                    <Th scope="col">Hub</Th>
                    <Th scope="col">Current Location</Th>
                    <Th scope="col">Flight Time (minutes)</Th>
                    <Th scope="col">Status</Th>
                    <Th scope="col">Overall Condition</Th>
                    {shouldShowMaintenance() && <th scope="col">Action</th>}
                  </Tr>
                </Thead>
                <Tbody>
                  {fleet.aircraft.map((aircraft) => (
                    <Tr key={aircraft.id}>
                      <Td>
                        <Link href={`/aircraft/${aircraft.id}`}>
                          {aircraft.registration}
                        </Link>
                      </Td>
                      <Td>
                        <Link href={`/airports/${aircraft.hub_id}`}>
                          {aircraft.hub_id}
                        </Link>
                      </Td>
                      <Td>
                        <Link href={`/airports/${aircraft.current_airport_id}`}>
                          {aircraft.current_airport_id}
                        </Link>
                      </Td>
                      <Td>{aircraft.flight_time_mins}</Td>
                      <Td>
                        {renderAircraftStatus(aircraft.state)}{' '}
                        {aircraft.maintenance_status && (
                          <Icon ml={2} color="orange.500" as={Wrench} />
                        )}
                      </Td>
                      <Td>
                        <AircraftCondition
                          aircraftCondition={aircraft.total_condition}
                        />
                      </Td>
                      {shouldShowMaintenance() && (
                        <Td>
                          <Link href={`/aircraft/${aircraft.id}`}>
                            <Button size="xs">Maintenance</Button>
                          </Link>
                        </Td>
                      )}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}
    </Box>
  )
}

export default FleetCardContent
