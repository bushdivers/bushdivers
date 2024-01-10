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
} from '@chakra-ui/react'
import { Link } from '@inertiajs/react'
import { format, formatDistanceToNow } from 'date-fns'
import { Plane } from 'lucide-react'
import React from 'react'

import CrewMap from '../../components/crew/CrewMap'
import AppLayout from '../../components/layout/AppLayout'
import { convertMinuteDecimalToHoursAndMinutes } from '../../helpers/date.helpers'

const Dashboard = ({ lastFlight, user, locations, distance }) => {
  return (
    <Box position="relative">
      <CrewMap
        size="full"
        locations={locations && locations.length > 0 ? locations : []}
        mapStyle={user.map_style}
      />
      <Box position="absolute" zIndex={10} w="400px" top={10} left={4}>
        <Card>
          <CardHeader>
            <Flex justifyContent="space-between" alignItems="center">
              <Heading size="md">Last Flight</Heading>
              <Heading size="sm">
                {lastFlight && (
                  <ChakraLink
                    a={Link}
                    color="orange.300"
                    href={`/logbook/${lastFlight.id}`}
                  >
                    {format(lastFlight.submitted_at, 'ddd DD MMM YYYY')}
                  </ChakraLink>
                )}
              </Heading>
            </Flex>
          </CardHeader>
          <CardBody>
            {lastFlight && (
              <Box>
                <Text fontSize="xs">
                  {formatDistanceToNow(lastFlight.submitted_at)} -{' '}
                  {format(lastFlight.submitted_at, 'ddd DD MMM YYYY')}
                </Text>
                <Box mt={2}>
                  <Text fontSize="lg">{lastFlight.dep_airport.name}</Text>
                  <ChakraLink
                    color="orange.300"
                    as={Link}
                    href={`/airports/${lastFlight.departure_airport_id}`}
                  >
                    {lastFlight.departure_airport_id}
                  </ChakraLink>
                </Box>
                <Box mt={2}>
                  <Text fontSize="lg">{lastFlight.arr_airport.name}</Text>
                  <ChakraLink
                    color="orange.300"
                    as={Link}
                    href={`/airports/${lastFlight.destination_airport_id}`}
                  >
                    {lastFlight.destination_airport_id}
                  </ChakraLink>
                </Box>
                <Flex alignItems="center" mt={2} gap={2}>
                  <Icon color="white" as={Plane} />
                  <Box>
                    {lastFlight.is_rental ? (
                      <Text fontSize="sm">
                        {lastFlight.rental.fleet.type} -{' '}
                        {lastFlight.rental.registration}
                      </Text>
                    ) : (
                      <ChakraLink
                        as={Link}
                        color="orange.300"
                        href={`/aircraft/${lastFlight.aircraft.id}`}
                      >
                        {lastFlight.aircraft.fleet.type} -{' '}
                        {lastFlight.aircraft.registration}
                      </ChakraLink>
                    )}
                  </Box>
                </Flex>
              </Box>
            )}
            <Flex
              color="white"
              alignItems="center"
              justifyContent="center"
              my={6}
            >
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
