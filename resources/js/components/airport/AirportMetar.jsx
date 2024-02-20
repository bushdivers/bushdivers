import { Box, Card, CardBody, Icon } from '@chakra-ui/react'
import { Loader2 } from 'lucide-react'
import React from 'react'

function AirportMetar({ metar, loading, isRunwayVisible }) {
  return (
    <Box position="absolute" top={52} left={isRunwayVisible ? 72 : 12}>
      <Card>
        <CardBody>
          {loading ? (
            <Icon as={Loader2} spin />
          ) : (
            <>{metar ? <Box>{metar}</Box> : <Box>No METAR available</Box>}</>
          )}
        </CardBody>
      </Card>
    </Box>
  )
}

export default AirportMetar
