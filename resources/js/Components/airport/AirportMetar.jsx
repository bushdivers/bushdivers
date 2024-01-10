import { Card, CardBody, Icon } from '@chakra-ui/react'
import { Loader2 } from 'lucide-react'
import React from 'react'

function AirportMetar({ metar, loading, isRunwayVisible }) {
  return (
    <div
      className={`absolute top-44 z-10 ${
        isRunwayVisible ? 'left-72' : 'left-12'
      }`}
    >
      <Card>
        <CardBody>
          {loading ? (
            <Icon as={Loader2} spin />
          ) : (
            <>
              {metar ? <span>{metar}</span> : <span>No METAR available</span>}
            </>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

export default AirportMetar
