import {
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Heading,
  Icon,
  Progress,
  Tag,
  Text,
} from '@chakra-ui/react'
import { usePage } from '@inertiajs/react'
import { useAtom } from 'jotai'
import { Plane, Undo2 } from 'lucide-react'
import React, { useEffect } from 'react'
import { useMap } from 'react-map-gl'

import { getDistance } from '../../helpers/geo.helpers.js'
import { selectedFlightAtom } from '../../state/flight.state.js'

const renderStatus = (status) => {
  switch (status) {
    case 0:
      return 'Dispatch'
    case 1:
      return 'Boarding/Loading'
    case 2:
      return 'Departed'
    case 4:
      return 'Landed'
    case 5:
      return 'Arrived'
    default:
      return 'Unknown'
  }
}

const FlightDetails = ({ flights }) => {
  const [selectedFlight, setSelectedFlight] = useAtom(selectedFlightAtom)
  const { current: map } = useMap()
  const { auth } = usePage().props

  function calcFlightProgress() {
    const totalDistance = getDistance(
      selectedFlight.arr_airport.lat,
      selectedFlight.arr_airport.lon,
      selectedFlight.dep_airport.lat,
      selectedFlight.dep_airport.lon
    )
    const distanceFromStart = getDistance(
      selectedFlight.current_lat,
      selectedFlight.current_lon,
      selectedFlight.dep_airport.lat,
      selectedFlight.dep_airport.lon
    )
    return (distanceFromStart / totalDistance) * 100
  }

  function calcFlightETA() {
    const distanceFromEnd = getDistance(
      selectedFlight.current_lat,
      selectedFlight.current_lon,
      selectedFlight.arr_airport.lat,
      selectedFlight.arr_airport.lon
    )
    return selectedFlight.current_indicated_speed === null ||
      selectedFlight.current_indicated_speed === 0
      ? 'N/A'
      : Math.round(
          (distanceFromEnd / selectedFlight.current_indicated_speed) * 60
        ) + ' min'
  }

  useEffect(() => {
    if (selectedFlight) {
      map.flyTo({
        center: [selectedFlight.current_lon, selectedFlight.current_lat],
        zoom: 8,
      })
    } else {
      map.flyTo({
        center: [auth.user.location.lon, auth.user.location.lat],
        zoom: 4,
      })
    }
  }, [selectedFlight])

  return (
    <Box position="absolute" left={4} top={12} bottom={12} w={300}>
      <Card overflowY="auto">
        <Flex mt={2} px={2} alignItems="center" justifyContent="space-between">
          <Heading size="sm">
            {selectedFlight
              ? 'Flight Details'
              : `Live Flights (${flights?.length > 0 ? flights?.length : 0})`}
          </Heading>
          {selectedFlight && (
            <Button onClick={() => setSelectedFlight(null)} variant="link">
              <Flex alignItems="center" gap={1}>
                <Icon as={Undo2} />
                <Text fontSize="xs">Back</Text>
              </Flex>
            </Button>
          )}
        </Flex>
        <Box p={2} overflowY="auto">
          {selectedFlight && (
            <Box>
              <Flex mt={2} justifyContent="center" alignItems="center" gap={3}>
                <Flex alignItems="center" direction="column">
                  <Heading size="md">
                    {selectedFlight.dep_airport.identifier}
                  </Heading>
                  <Text fontSize="xs">{selectedFlight.dep_airport.name}</Text>
                </Flex>
                <Icon boxSize={6} as={Plane} />
                <Flex alignItems="center" direction="column">
                  <Heading size="md">
                    {selectedFlight.arr_airport.identifier}
                  </Heading>
                  <Text fontSize="xs">{selectedFlight.arr_airport.name}</Text>
                </Flex>
              </Flex>
              <Progress
                size="sm"
                mt={2}
                hasStripe
                value={calcFlightProgress()}
              />
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize="xs">
                  {getDistance(
                    selectedFlight.current_lat,
                    selectedFlight.current_lon,
                    selectedFlight.dep_airport.lat,
                    selectedFlight.dep_airport.lon
                  )}{' '}
                  nm
                </Text>
                <Flex alignItems="center" gap={1}>
                  <Text fontSize="xs">ETA {calcFlightETA()}</Text>
                  <Text fontSize="xs">
                    {getDistance(
                      selectedFlight.current_lat,
                      selectedFlight.current_lon,
                      selectedFlight.arr_airport.lat,
                      selectedFlight.arr_airport.lon
                    )}{' '}
                    nm
                  </Text>
                </Flex>
              </Flex>
              <Flex mt={1} justifyContent="center" alignItems="center" gap={2}>
                <Heading textAlign="center" size="xs">
                  {selectedFlight.pilot.pilot_id}
                </Heading>
                <Text fontSize="xs" textAlign="center">
                  {selectedFlight.pilot.discord_username
                    ? selectedFlight.pilot.discord_username
                    : selectedFlight.pilot.private_name}
                </Text>
              </Flex>
              <Divider mt={2} />
              <Flex mt={2} alignItems="center" gap={1}>
                <Heading size="xs">Aircraft Type</Heading>
                <Text fontSize="xs">
                  (
                  {selectedFlight.is_rental
                    ? selectedFlight.rental.fleet.type
                    : selectedFlight.aircraft.fleet.type}
                  )
                </Text>
              </Flex>
              <Flex justifyContent="space-between">
                <Text fontSize="sm">
                  {selectedFlight.is_rental
                    ? selectedFlight.rental.fleet.manufacturer +
                      ' ' +
                      selectedFlight.rental.fleet.name
                    : selectedFlight.aircraft.fleet.manufacturer +
                      ' ' +
                      selectedFlight.aircraft.fleet.name}
                </Text>
                <Text fontSize="sm">
                  {selectedFlight.is_rental
                    ? selectedFlight.rental.registration
                    : selectedFlight.aircraft.registration}
                </Text>
              </Flex>
              <Divider mt={2} />
              <Flex mt={2} justifyContent="space-between" alignItems="center">
                <Flex direction="column">
                  <Heading size="xs">Altitude</Heading>
                  <Text fontSize="xs">
                    {selectedFlight.current_altitude} ft
                  </Text>
                </Flex>
                <Flex direction="column">
                  <Heading size="xs">IAS</Heading>
                  <Text fontSize="xs">
                    {selectedFlight.current_indicated_speed} kts
                  </Text>
                </Flex>
                <Flex direction="column">
                  <Heading size="xs">Track</Heading>
                  <Text fontSize="xs">
                    {selectedFlight.current_heading}&deg;
                  </Text>
                </Flex>
              </Flex>
            </Box>
          )}
          {!selectedFlight &&
            flights &&
            flights.length > 0 &&
            flights.map((flight) => (
              <Card
                my={1}
                cursor="pointer"
                p={2}
                key={flight.id}
                onClick={() =>
                  setSelectedFlight(
                    flight.id === selectedFlight?.id ? null : flight
                  )
                }
              >
                <Flex
                  mt={2}
                  justifyContent="center"
                  alignItems="center"
                  gap={3}
                >
                  <Flex alignItems="center" direction="column">
                    <Heading size="md">{flight.dep_airport.identifier}</Heading>
                    <Text fontSize="xs">{flight.dep_airport.name}</Text>
                  </Flex>
                  <Icon boxSize={6} as={Plane} />
                  <Flex alignItems="center" direction="column">
                    <Heading size="md">{flight.arr_airport.identifier}</Heading>
                    <Text fontSize="xs">{flight.arr_airport.name}</Text>
                  </Flex>
                </Flex>
                <Flex justifyContent="center" alignItems="center" gap={2}>
                  <Heading textAlign="center" size="xs">
                    {flight.pilot.pilot_id}
                  </Heading>
                  <Text fontSize="xs" textAlign="center">
                    {flight.pilot.discord_username
                      ? flight.pilot.discord_username
                      : flight.pilot.private_name}
                  </Text>
                </Flex>
                <Flex justifyContent="end">
                  <Tag
                    size="sm"
                    colorScheme={flight.status === 0 ? 'gray' : 'orange'}
                  >
                    {renderStatus(flight.status)}
                  </Tag>
                </Flex>
              </Card>
            ))}
        </Box>
      </Card>
    </Box>
  )
}

export default FlightDetails
