import { Box, Card, CardBody } from '@chakra-ui/react'
import React from 'react'

const renderRunwayText = (surface) => {
  switch (surface) {
    case 'A':
      return 'Asphalt'
    case 'B':
      return 'Bituminous'
    case 'C':
      return 'Concrete'
    case 'CE':
      return 'Cement'
    case 'CR':
      return 'Water'
    case 'G':
      return 'Grass'
    case 'GR':
      return 'Gravel'
    case 'M':
      return 'Macadam'
    case 'S':
      return 'Sand'
    case 'T':
      return 'Tarmac'
    case 'W':
      return 'Water'
    default:
      return 'Unknown'
  }
}

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
