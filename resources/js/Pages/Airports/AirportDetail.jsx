import React, { useState } from 'react'

import AirportMap from '../../components/airport/AirportMap'
import MapOptions from '../../components/elements/MapOptions'
import AppLayout from '../../components/layout/AppLayout'

const AirportDetail = ({ airport, aircraft, contracts, metar }) => {
  const [currentMapStyle, setCurrentMapStyle] = useState('')

  return (
    <div className="relative">
      <AirportMap
        airport={airport}
        metar={metar}
        aircraft={aircraft}
        contracts={contracts}
        size="full"
        updatedMapStyle={currentMapStyle}
      />
      <MapOptions
        updateMap={setCurrentMapStyle}
        currentStyle={currentMapStyle}
      />
    </div>
  )
}

AirportDetail.layout = (page) => (
  <AppLayout
    children={page}
    title="Airport Details"
    heading="Airport Details"
    isFullSize
  />
)

export default AirportDetail
