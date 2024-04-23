import { Box, Card, CardBody, Flex, Icon, Tag, Text } from '@chakra-ui/react'
import { Link } from '@inertiajs/react'
import { format } from 'date-fns'
import { Anchor, PlaneLanding, PlaneTakeoff } from 'lucide-react'
import React from 'react'

const LogbookPrimary = ({ pirep }) => {
  return (
    <Box>
      <Card>
        <CardBody>
          <Flex justifyContent="space-between">
            <Flex direction="column" alignItems="center">
              <Icon w={6} h={6} as={PlaneTakeoff} />
              <Flex direction="row" alignItems="center" gap={2}>
                <Link href={`/airports/${pirep.departure_airport_id}`}>
                  <Text fontSize="xl">{pirep.departure_airport_id}</Text>
                </Link>
                {pirep.dep_airport.longest_runway_surface === 'W' && (
                  <Icon as={Anchor} color="blue.500" />
                )}
              </Flex>
              <Text>{pirep.dep_airport.name}</Text>
              <Text>{format(new Date(pirep.block_off_time), 'kk:mm')}</Text>
            </Flex>
            <Flex direction="column" alignItems="center">
              <Icon w={6} h={6} as={PlaneLanding} />
              <Flex direction="row" alignItems="center" gap={2}>
                <Link href={`/airports/${pirep.destination_airport_id}`}>
                  <Text fontSize="xl">{pirep.destination_airport_id}</Text>
                </Link>
                {pirep.arr_airport.longest_runway_surface === 'W' && (
                  <Icon as={Anchor} color="blue.500" />
                )}
              </Flex>
              <Text>{pirep.arr_airport.name}</Text>
              <Text>{format(new Date(pirep.block_on_time), 'kk:mm')}</Text>
            </Flex>
            <Flex
              direction="column"
              justifyContent="space-between"
              alignItems="center"
            >
              <Flex direction="column">
                <Text>
                  {pirep.is_rental ? (
                    <>
                      {pirep.rental.fleet.manufacturer}{' '}
                      {pirep.rental.fleet.name}
                    </>
                  ) : (
                    <>
                      {pirep.aircraft.fleet.manufacturer}{' '}
                      {pirep.aircraft.fleet.name}
                    </>
                  )}
                </Text>
                <Box>
                  {pirep.is_rental ? (
                    <Text fontSize="sm">
                      {pirep.rental.registration} ({pirep.rental.fleet.type})
                    </Text>
                  ) : (
                    <Link href={`/aircraft/${pirep.aircraft.id}`}>
                      <Text>
                        {pirep.aircraft.registration} (
                        {pirep.aircraft.fleet.type})
                      </Text>
                    </Link>
                  )}
                </Box>
              </Flex>
              {pirep.tour_id && (
                <Tag size="sm" ml={2}>
                  Tour Flight: {pirep.tour.title}
                </Tag>
              )}
            </Flex>
          </Flex>
        </CardBody>
      </Card>
    </Box>
  )
}

export default LogbookPrimary
