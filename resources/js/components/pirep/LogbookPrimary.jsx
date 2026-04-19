import { Box, Card, CardBody, Flex, Icon, Tag, Text } from '@chakra-ui/react'
import { Link } from '@inertiajs/react'
import { format } from 'date-fns'
import { PlaneLanding, PlaneTakeoff } from 'lucide-react'
import React from 'react'

import AirportLabel from '../airport/AirportLabel.jsx'

const LogbookPrimary = ({ pirep }) => {
  return (
    <Box>
      <Card>
        <CardBody>
          <Flex justifyContent="space-between">
            <Flex direction="column" alignItems="center">
              <Icon w={6} h={6} as={PlaneTakeoff} />
              <AirportLabel airport={pirep.dep_airport} size="xl" />
              <Text>{pirep.dep_airport.name}</Text>
              <Text>{format(new Date(pirep.block_off_time), 'kk:mm')}</Text>
            </Flex>
            <Flex direction="column" alignItems="center">
              <Icon w={6} h={6} as={PlaneLanding} />
              <AirportLabel airport={pirep.arr_airport} size="xl" />
              <Text>{pirep.arr_airport.name}</Text>
              <Text>{format(new Date(pirep.block_on_time), 'kk:mm')}</Text>
            </Flex>
            <Flex
              direction="column"
              justifyContent="space-between"
              alignItems="center"
            >
              <Flex direction="column">
                {!pirep.rental && !pirep.aircraft ? (
                  <Text align="center">
                    Aircraft sold
                    <br />
                    or unavailable
                  </Text>
                ) : (
                  <>
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
                          {pirep.rental.registration} ({pirep.rental.fleet.type}
                          )
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
                  </>
                )}
              </Flex>
              {pirep.tour_id && (
                <Tag size="sm" ml={2}>
                  Tour Flight: {pirep.tour?.title}
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
