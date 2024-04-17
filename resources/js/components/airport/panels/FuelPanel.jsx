import { Box, Flex, Heading, Icon, Text } from '@chakra-ui/react'
import { MoveUp } from 'lucide-react'
import React from 'react'

import { getBearing, getDistance } from '../../../helpers/geo.helpers.js'
import AvailableFuel from '../AvailableFuel.jsx'

const FuelPanel = ({ fuel, currentAirport }) => {
  return (
    <Box>
      <Heading mb={2} size="md">
        Nearby Fuel
      </Heading>
      {fuel?.length > 0 ? (
        <Box>
          {fuel?.map((f) => (
            <Box mb={2} key={f.id}>
              <Flex alignItems="start" justifyContent="space-between" gap={2}>
                <Heading size="xs" mb={2}>
                  {f.identifier} {f.name}
                </Heading>
                <Text>
                  {getDistance(
                    currentAirport.lat,
                    currentAirport.lon,
                    f.lat,
                    f.lon
                  )}
                  nm
                </Text>
              </Flex>
              <Flex alignItems="start" justifyContent="space-between">
                <AvailableFuel airport={f} />
                <Flex direction="column">
                  <Text>
                    {getBearing(
                      currentAirport.lat,
                      currentAirport.lon,
                      f.lat,
                      f.lon
                    )}
                    &deg;
                  </Text>
                  <Box
                    style={{
                      transform: `rotate(${getBearing(
                        currentAirport.lat,
                        currentAirport.lon,
                        f.lat,
                        f.lon
                      )}deg)`,
                    }}
                  >
                    <Icon boxSize={3} as={MoveUp} />
                  </Box>
                </Flex>
              </Flex>
            </Box>
          ))}
        </Box>
      ) : (
        <Text>No fuel nearby</Text>
      )}
    </Box>
  )
}

export default FuelPanel
