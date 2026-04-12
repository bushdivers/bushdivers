import { Box, Card, CardBody } from '@chakra-ui/react'
import React from 'react'

import { runwaySurface as renderRunwayText } from '../../helpers/airport.helpers.js'

function AirportRunway({ airport }) {
  return (
    <Box position="absolute" top={52} left={12}>
      <Card>
        <CardBody>
          {airport.longest_runway_length && (
            <div className="flex items-center">
              <span>
                {renderRunwayText(airport.longest_runway_surface)}{' '}
                {airport.longest_runway_length}ft x{' '}
                {airport.longest_runway_width}
                ft
              </span>
            </div>
          )}
        </CardBody>
      </Card>
    </Box>
  )
}

export default AirportRunway
