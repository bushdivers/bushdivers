import { Box, Card, CardBody, Flex } from '@chakra-ui/react'
import React from 'react'

import { convertMinuteDecimalToHoursAndMinutes } from '../../helpers/date.helpers'
import StatDisplay from '../elements/StatDisplay.jsx'

const LogbookSecondary = ({ pirep }) => {
  return (
    <Box mt={2}>
      <Card>
        <CardBody>
          <Flex justifyContent="space-between">
            <StatDisplay
              title="Fuel used"
              stat={`${pirep.fuel_used.toLocaleString(navigator.language)} gal`}
            />
            <StatDisplay
              title="Duration"
              stat={convertMinuteDecimalToHoursAndMinutes(pirep.flight_time)}
            />
            <StatDisplay
              title="Distance"
              stat={`${pirep.distance.toLocaleString(navigator.language)}nm`}
            />
            <StatDisplay
              title="Points"
              stat={pirep.score?.toLocaleString(navigator.language) ?? '-'}
            />
          </Flex>
        </CardBody>
      </Card>
    </Box>
  )
}

export default LogbookSecondary
