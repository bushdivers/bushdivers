import { Box } from '@chakra-ui/react'
import React from 'react'

import LiveFlightMap from '../../components/flights/LiveFlightMap'
import AppLayout from '../../components/layout/AppLayout'

const LiveFlights = () => {
  function renderContent() {
    return (
      <Box position="relative">
        <LiveFlightMap />
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
