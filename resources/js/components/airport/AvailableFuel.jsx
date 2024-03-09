import { Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'

const AvailableFuel = ({ airport }) => {
  return (
    <>
      <Flex alignItems="center" gap={4}>
        {airport.avgas_qty > 0 ? (
          <Flex direction="column">
            <Flex alignItems="center" gap={2}>
              <Text as="b" fontSize="sm">
                100LL
              </Text>
              <Text fontSize="xs">(${airport.avgas_price})</Text>
            </Flex>
            <Text fontSize="xs">
              {airport.is_hub ? 'unlimited' : `${airport.avgas_qty} gal`}
            </Text>
          </Flex>
        ) : (
          <Box mx={2}>No 100LL</Box>
        )}
        {airport.jetfuel_qty > 0 ? (
          <Flex direction="column">
            <Flex alignItems="center" gap={2}>
              <Text as="b" fontSize="sm">
                Jet Fuel
              </Text>
              <Text fontSize="xs">(${airport.jetfuel_price})</Text>
            </Flex>
            <Text fontSize="xs">
              {airport.is_hub ? 'unlimited' : `${airport.jetfuel_qty} gal`}
            </Text>
          </Flex>
        ) : (
          <Box mx={2}>No Jet Fuel</Box>
        )}
      </Flex>
    </>
  )
}

export default AvailableFuel
