import { Card, CardBody, CardHeader, Flex } from '@chakra-ui/react'
import React from 'react'

import StatDisplay from '../elements/StatDisplay.jsx'
import LandingMap from './LandingMap'

const LandingSummary = ({ pirep }) => {
  return (
    <div className="mt-2 mx-2">
      <Card>
        <CardHeader>Landing Summary</CardHeader>
        <CardBody>
          <Flex mb={2} justifyContent="space-between">
            <StatDisplay
              stat={`${pirep.landing_rate} fpm`}
              title="Landing Rate"
            />
            <StatDisplay stat={pirep.landing_pitch} title="Landing Pitch" />
            <StatDisplay stat={pirep.landing_bank} title="Landing Bank" />
          </Flex>
          <LandingMap pirep={pirep} size="small" />
        </CardBody>
      </Card>
    </div>
  )
}

export default LandingSummary
