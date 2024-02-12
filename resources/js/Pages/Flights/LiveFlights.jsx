import { Box, Card, CardBody, CardHeader } from '@chakra-ui/react'
import React, { useState } from 'react'

import LiveFlightMap from '../../components/flights/LiveFlightMap'
import AppLayout from '../../components/layout/AppLayout'

const LiveFlights = () => {
  const [flightCount, setFlightCount] = useState(0)
  const updateFlightCount = (count) => {
    setFlightCount(count)
  }

  function renderContent() {
    return (
      <Box position="relative">
        <LiveFlightMap updateFlightCount={updateFlightCount} />
        <Box
          trans={80}
          position="absolute"
          zIndex={10}
          w="400px"
          top={10}
          left={4}
        >
          <Card>
            <CardHeader>Current Flights</CardHeader>
            <CardBody>{flightCount}</CardBody>
          </Card>
        </Box>
      </Box>
    )
  }

  return <>{renderContent()}</>
}

LiveFlights.layout = (page) => (
  <AppLayout
    children={page}
    title="Live Flights"
    heading="Live Flights"
    isFullSize
  />
)

export default LiveFlights
