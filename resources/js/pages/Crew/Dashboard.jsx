import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Link as ChakraLink,
  Flex,
  Heading,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useColorMode,
} from '@chakra-ui/react'
import { Link } from '@inertiajs/react'
import { formatDistanceToNow } from 'date-fns'
import { Anchor, Package, Plane } from 'lucide-react'
import React from 'react'

import CrewMap from '../../components/crew/CrewMap'
import AppLayout from '../../components/layout/AppLayout'
import {
  convertMinuteDecimalToHoursAndMinutes,
  formatDate,
} from '../../helpers/date.helpers'

const Dashboard = ({ lastFlight, user, locations, distance }) => {
  const { colorMode } = useColorMode()
  return (
    <Box rounded="lg" position="relative">
      <CrewMap
        size="full"
        locations={locations && locations.length > 0 ? locations : []}
        mapStyle={colorMode}
      />
      <Box position="absolute" zIndex={10} w="400px" top={10} left={4}>
        <Card>
          <CardHeader>
            <Flex justifyContent="space-between" alignItems="center">
              <Heading size="md">Last Flight</Heading>
              <Heading size="sm">
                {lastFlight && (
                  <ChakraLink
                    color="orange.400"
                    as={Link}
                    href={`/logbook/${lastFlight.id}`}
                  >
                    {formatDate(lastFlight.submitted_at)}
                  </ChakraLink>
                )}
              </Heading>
            </Flex>
          </CardHeader>
          <CardBody>
            {lastFlight && (
              <Box>
                <Flex justifyContent="space-between" alignItems="center">
                  <Text fontSize="xs">
                    {formatDistanceToNow(new Date(lastFlight.submitted_at))} -{' '}
                    {formatDate(lastFlight.submitted_at)}
                  </Text>
                  <ChakraLink color="orange.400" as={Link} href={`/logbook`}>
                    View Logbook List
                  </ChakraLink>
                </Flex>
                <Box mt={2}>
                  <Flex alignItems="center" gap={2}>
                    <Text fontSize="lg">{lastFlight.dep_airport.name}</Text>
                    {lastFlight.dep_airport.longest_runway_surface === 'W' && (
                      <Icon as={Anchor} color="blue.500" />
                    )}
                    {lastFlight.dep_airport.is_thirdparty && (
                      <Icon as={Package} color="green.500" />
                    )}
                  </Flex>

                  <ChakraLink
                    color="orange.400"
                    as={Link}
                    href={`/airports/${lastFlight.departure_airport_id}`}
                  >
                    {lastFlight.departure_airport_id}
                  </ChakraLink>
                </Box>
                <Box mt={2}>
                  <Flex alignItems="center" gap={2}>
                    <Text fontSize="lg">{lastFlight.arr_airport.name}</Text>
                    {lastFlight.arr_airport.longest_runway_surface === 'W' && (
                      <Icon as={Anchor} color="blue.500" />
                    )}
                    {lastFlight.arr_airport.is_thirdparty && (
                      <Icon as={Package} color="green.500" />
                    )}
                  </Flex>
                  <ChakraLink
                    color="orange.400"
                    as={Link}
                    href={`/airports/${lastFlight.destination_airport_id}`}
                  >
                    {lastFlight.destination_airport_id}
                  </ChakraLink>
                </Box>
                <Flex alignItems="center" mt={2} gap={2}>
                  <Icon as={Plane} />
                  <Box>
                    {lastFlight.is_rental != 0 && lastFlight.rental && (
                      <Text fontSize="sm">
                        {lastFlight.rental.fleet.type} -{' '}
                        {lastFlight.rental.registration}
                      </Text>
                    )}
                    {lastFlight.is_rental == 0 && lastFlight.aircraft && (
                      <ChakraLink
                        as={Link}
                        color="orange.400"
                        href={`/aircraft/${lastFlight.aircraft.id}`}
                      >
                        {lastFlight.aircraft.fleet.type} -{' '}
                        {lastFlight.aircraft.registration}
                      </ChakraLink>
                    )}
                    {!lastFlight.aircraft && !lastFlight.rental && (
                      <Text fontSize="sm">Sold or unavailable</Text>
                    )}
                  </Box>
                </Flex>
              </Box>
            )}
            <Flex alignItems="center" justifyContent="center" my={6}>
              <Stat>
                <StatLabel>Flights</StatLabel>
                <StatNumber>
                  {user.flights.toLocaleString(navigator.language)}
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Hours</StatLabel>
                <StatNumber>
                  {user.flights_time > 0
                    ? convertMinuteDecimalToHoursAndMinutes(user.flights_time)
                    : 0}
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Points</StatLabel>
                <StatNumber>
                  {user.points.toLocaleString(navigator.language)}
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Distance (nm)</StatLabel>
                <StatNumber>{distance}</StatNumber>
              </Stat>
            </Flex>
          </CardBody>
        </Card>
      </Box>
    </Box>
  )
}

Dashboard.layout = (page) => (
  <AppLayout
    children={page}
    title="Crew Page"
    heading="My Crew Page"
    container="false"
    isFullSize
  />
)

export default Dashboard
