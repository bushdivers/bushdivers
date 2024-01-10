import { usePage } from '@inertiajs/react'
import React, { useState } from 'react'

import StatBlock from '../../components/elements/StatBlock'
import LiveFlightMap from '../../components/flights/LiveFlightMap'
import AppLayout from '../../components/layout/AppLayout'

const LiveFlights = () => {
  const { auth } = usePage().props
  const [flightCount, setFlightCount] = useState(0)
  const updateFlightCount = (count) => {
    setFlightCount(count)
  }

  function renderContent() {
    return (
      <>
        <StatBlock width="1/2" data={flightCount} text="Current Flights" />
        <LiveFlightMap
          size="large"
          updateFlightCount={updateFlightCount}
          mapStyle={auth.user.map_style}
        />
      </>
    )
  }

  return <>{renderContent()}</>
}

LiveFlights.layout = (page) => (
  <AppLayout children={page} title="Live Flights" heading="Live Flights" />
)

export default LiveFlights
