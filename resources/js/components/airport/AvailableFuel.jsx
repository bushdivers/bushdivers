import { Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'

import { displayNumber } from '../../helpers/number.helpers.js'

const AvailableFuel = ({ airport, stack = false }) => {
  return (
    <>
      <Flex
        direction={stack ? 'column' : 'row'}
        alignItems="center"
        justifyContent={stack ? 'center' : ''}
        gap={stack ? 1 : 4}
      >
        {airport.avgas_qty > 0 || airport.is_hub ? (
          <Flex direction="column" alignItems="center">
            <Flex alignItems="center" gap={stack ? 1 : 2}>
              <Text as="b" fontSize={stack ? 'xs' : 'sm'}>
                100LL
              </Text>
              <Text fontSize="xs">(${airport.avgas_price})</Text>
            </Flex>
            <Text fontSize="xs">
              {airport.is_hub
                ? 'unlimited'
                : `${displayNumber(airport.avgas_qty, false)} gal`}
            </Text>
          </Flex>
        ) : (
          <Box data-testid="nofuel-avgas" mx={stack ? 1 : 2}>
            <Text fontSize={stack ? 'xs' : 'sm'}>No 100LL</Text>
          </Box>
        )}
        {airport.jetfuel_qty > 0 || airport.is_hub ? (
          <Flex direction="column" alignItems="center">
            <Flex alignItems="center" gap={stack ? 1 : 2}>
              <Text as="b" fontSize={stack ? 'xs' : 'sm'}>
                Jet Fuel
              </Text>
              <Text fontSize="xs">(${airport.jetfuel_price})</Text>
            </Flex>
            <Text fontSize="xs">
              {airport.is_hub
                ? 'unlimited'
                : `${displayNumber(airport.jetfuel_qty, false)} gal`}
            </Text>
          </Flex>
        ) : (
          <Box data-testid="nofuel-jet" mx={stack ? 1 : 2}>
            <Text fontSize={stack ? 'xs' : 'sm'}>No Jet Fuel</Text>
          </Box>
        )}
      </Flex>
    </>
  )
}

export default AvailableFuel
