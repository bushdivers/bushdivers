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
  myContracts,
  sharedContracts,
}) => {
  const [currentMapStyle] = useState('')

  return (
    <div className="relative">
      <AirportMap
        airport={airport}
        metar={metar}
        fleet={fleet}
        aircraft={aircraft}
        contracts={contracts}
        size="full"
        updatedMapStyle={currentMapStyle}
        fuel={fuel}
        myContracts={myContracts}
        sharedContracts={sharedContracts}
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
