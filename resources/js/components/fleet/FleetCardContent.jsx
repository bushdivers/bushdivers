import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Image,
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
import { Link, usePage } from '@inertiajs/react'
import { Globe, Wrench } from 'lucide-react'
import React from 'react'

import { formatDate } from '../../helpers/date.helpers.js'
import { displayFileSize } from '../../helpers/generic.helpers.js'
import {
  displayDurationHrMin,
  displayNumber,
} from '../../helpers/number.helpers.js'
import { SimTypeColors } from '../../helpers/simtype.helpers.js'
import AirportLabel from '../airport/AirportLabel.jsx'
import AircraftCondition from './AircraftCondition'

const SpecRow = ({ label, value }) => (
  <Flex
    justifyContent="space-between"
    py={1.5}
    borderBottomWidth="1px"
    borderColor="gray.100"
    _dark={{ borderColor: 'gray.700' }}
  >
    <Text fontSize="sm" color="gray.500" _dark={{ color: 'gray.400' }}>
      {label}
    </Text>
    <Text fontSize="sm" fontWeight="medium">
      {value}
    </Text>
  </Flex>
)

const SectionLabel = ({ children }) => (
  <Text
    fontSize="xs"
    fontWeight="bold"
    textTransform="uppercase"
    color="gray.400"
    mb={2}
  >
    {children}
  </Text>
)

const FleetCardContent = ({ fleet }) => {
  const { auth } = usePage().props
  const variant = fleet.default_variant

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
      {/* Title row with optional thumbnail */}
      <Flex alignItems="flex-start" gap={4} mb={4}>
        {fleet.image_url && (
          <Box position="relative" flexShrink={0}>
            <Image
              src={fleet.image_url}
              alt={fleet.name}
              w="140px"
              h="90px"
              objectFit="cover"
              borderRadius="md"
            />
            {!!fleet.fleet_image_credit && (
              <Box
                position="absolute"
                bottom={1}
                right={1}
                bg="blackAlpha.500"
                borderRadius="sm"
                px={1}
                py={0.5}
              >
                <Text fontSize="2xs" color="whiteAlpha.800">
                  {fleet.fleet_image_credit}
                </Text>
              </Box>
            )}
          </Box>
        )}
        <Flex flex={1} alignItems="flex-start" justifyContent="space-between">
          <Box>
            <Text fontSize="xl" fontWeight="bold" lineHeight="short">
              {fleet.manufacturer} {fleet.name}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {fleet.type}
            </Text>
          </Box>
          <Badge colorScheme="blue" alignSelf="center">
            {fleet.aircraft.length} aircraft
          </Badge>
        </Flex>
      </Flex>

      {/* Specs grid */}
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} mb={4}>
        <Box>
          <SectionLabel>Powerplant</SectionLabel>
          <SpecRow
            label="Engines"
            value={`${fleet.number_of_engines} × ${fleet.powerplants}`}
          />
          <SpecRow
            label="Fuel type"
            value={fleet.fuel_type === 1 ? 'Avgas' : 'Jet Fuel'}
          />
          <SpecRow
            label="Fuel capacity"
            value={`${displayNumber(variant?.fuel_capacity)} gal`}
          />
        </Box>

        <Box>
          <SectionLabel>Performance</SectionLabel>
          <SpecRow
            label="Cruise speed"
            value={`${displayNumber(fleet.cruise_speed, false)} KTAS`}
          />
          <SpecRow
            label="Service ceiling"
            value={`${displayNumber(fleet.service_ceiling, false)} ft`}
          />
          <SpecRow
            label="Range"
            value={`${displayNumber(variant?.range, false)} nm`}
          />
        </Box>

        <Box>
          <SectionLabel>Liveries</SectionLabel>
          {fleet.uploads?.length > 0 ? (
            <Flex direction="column" gap={1.5}>
              {fleet.uploads.map((u) => (
                <Flex gap={2} key={u.id} alignItems="center">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={u.url}
                    title={u.author ? u.display_name + ' by ' + u.author : ''}
                  >
                    <Text fontSize="sm">{u.display_name}</Text>
                  </a>
                  {u.size != null ? (
                    <Text fontSize="xs" color="gray.500">
                      {displayFileSize(u.size)}
                    </Text>
                  ) : (
                    <Icon as={Globe} boxSize={3} color="gray.400" />
                  )}
                  {u.sim_type?.map((type) => (
                    <Tag
                      key={type}
                      size="sm"
                      colorScheme={SimTypeColors[type] ?? 'gray'}
                      textTransform="uppercase"
                    >
                      {type}
                    </Tag>
                  ))}
                </Flex>
              ))}
            </Flex>
          ) : (
            <Text fontSize="sm" color="gray.500">
              No liveries available
            </Text>
          )}
        </Box>

        <Box>
          <SectionLabel>Capacity</SectionLabel>
          <SpecRow label="PAX" value={variant?.pax_capacity ?? 0} />
          <SpecRow
            label="Cargo"
            value={`${displayNumber(variant?.cargo_capacity)} lbs`}
          />
        </Box>
      </SimpleGrid>

      {/* Aircraft table */}
      {auth.user && fleet.aircraft.length > 0 && (
        <>
          <Divider mb={3} />
          <TableContainer>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th scope="col">Registration</Th>
                  <Th scope="col">Hub</Th>
                  <Th scope="col">Location</Th>
                  <Th scope="col">Last Flight</Th>
                  <Th scope="col">Flight Time</Th>
                  <Th scope="col">Status</Th>
                  <Th scope="col">Condition</Th>
                  {shouldShowMaintenance() && <Th scope="col">Action</Th>}
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
                      <AirportLabel airport={aircraft.hub} />
                    </Td>
                    <Td>
                      <AirportLabel airport={aircraft.location} />
                    </Td>
                    <Td>
                      {aircraft.last_pirep
                        ? formatDate(aircraft.last_pirep.submitted_at)
                        : 'N/A'}
                    </Td>
                    <Td>{displayDurationHrMin(aircraft.flight_time_mins)}</Td>
                    <Td>
                      {renderAircraftStatus(aircraft.state)}{' '}
                      {aircraft.maintenance_status && (
                        <Icon ml={2} color="orange.400" as={Wrench} />
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
        </>
      )}
    </Box>
  )
}

export default FleetCardContent
