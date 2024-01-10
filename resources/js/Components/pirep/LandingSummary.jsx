import { Card, CardBody, CardHeader } from '@chakra-ui/react'
import React from 'react'

import LandingMap from './LandingMap'

const LandingSummary = ({ pirep, mapStyle }) => {
  return (
    <div className="mt-2 mx-2">
      <Card>
        <CardHeader>Landing Summary</CardHeader>
        <CardBody>
          <div className="flex justify-between items-center mb-2">
            <div className="flex flex-col items-center my-2 mx-4">
              <div className="text-sm">Landing Rate</div>
              <div className="text-xl">{pirep.landing_rate} fpm</div>
            </div>
            <div className="flex flex-col items-center my-2 mx-4">
              <div className="text-sm">Landing Pitch</div>
              <div className="text-xl">{pirep.landing_pitch}</div>
            </div>
            <div className="flex flex-col items-center my-2 mx-4">
              <div className="text-sm">Landing Bank</div>
              <div className="text-xl">{pirep.landing_bank}nm</div>
            </div>
          </div>
          <LandingMap pirep={pirep} size="small" mapStyle={mapStyle} />
        </CardBody>
      </Card>
    </div>
  )
}

export default LandingSummary
