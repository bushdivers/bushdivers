import { Box, Card } from '@chakra-ui/react'
import { useAtomValue } from 'jotai'
import React, { useEffect, useState } from 'react'

import { dynamicSort } from '../../helpers/generic.helpers.js'
import { getDistance } from '../../helpers/geo.helpers.js'
import { contractMapLayersAtom } from '../../state/map.state.js'
import AircraftDetail from './AircraftDetail.jsx'

const AircraftList = ({ airport, aircraft = null, fleet = null }) => {
  const contractMapLayers = useAtomValue(contractMapLayersAtom)
  const [updatedAircraft, setUpdatedAircraft] = useState(aircraft)
  const [updatedFleet, setUpdatedFleet] = useState(fleet)

  useEffect(() => {
    if (aircraft === null) return
    const processAircraft = aircraft?.map((ac) => ({
      ...ac,
      distance: getDistance(airport.lat, airport.lon, ac.last_lat, ac.last_lon),
    }))
    setUpdatedAircraft(processAircraft.sort(dynamicSort('distance', 'asc')))
  }, [aircraft])

  useEffect(() => {
    if (fleet === null) return
    const processAircraft = fleet.map((ac) => ({
      ...ac,
      distance: getDistance(airport.lat, airport.lon, ac.last_lat, ac.last_lon),
    }))
    setUpdatedFleet(processAircraft.sort(dynamicSort('distance', 'asc')))
  }, [fleet])

  return (
    <>
      {(aircraft || fleet) && (
        <Card
          position="absolute"
          w={300}
          h={contractMapLayers.contracts ? '49%' : '100%'}
          bottom={contractMapLayers.contracts ? '2' : ''}
        >
          <Box p={2} overflowY="auto">
            {updatedAircraft?.map((ac) => (
              <AircraftDetail airport={airport} key={ac.id} aircraft={ac} />
            ))}
            {updatedFleet?.map((ac) => (
              <AircraftDetail airport={airport} key={ac.id} aircraft={ac} />
            ))}
          </Box>
        </Card>
      )}
    </>
  )
}

export default AircraftList
