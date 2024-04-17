import { Box, Heading, Text } from '@chakra-ui/react'
import React from 'react'

import AvailableFuel from '../AvailableFuel.jsx'

const FuelPanel = ({ fuel }) => {
  return (
    <Box>
      <Heading mb={2} size="md">
        Nearby Fuel
      </Heading>
      {fuel?.length > 0 ? (
        <Box>
          {fuel?.map((f) => (
            <Box mb={2} key={f.id}>
              <Heading size="xs" mb={2}>
                {f.identifier} {f.name}
              </Heading>
              <AvailableFuel airport={f} />
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
