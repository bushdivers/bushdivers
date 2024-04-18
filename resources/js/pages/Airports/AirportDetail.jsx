import React, { useState } from 'react'

import AirportMap from '../../components/airport/AirportMap'
import AppLayout from '../../components/layout/AppLayout'

const AirportDetail = ({
  airport,
  fleet,
  aircraft,
  contracts,
  metar,
  fuel,
}) => {
  const [currentMapStyle] = useState('')

  return (
    <div className="relative">
      <AirportMap
        airport={airport}
        metar={metar[0]}
        fleet={fleet}
        aircraft={aircraft}
        contracts={contracts}
        size="full"
        updatedMapStyle={currentMapStyle}
        fuel={fuel}
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
