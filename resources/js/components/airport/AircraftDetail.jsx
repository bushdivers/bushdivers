import {
  Card,
  Flex,
  Heading,
  Icon,
  Tag,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { useAtom } from 'jotai'
import { Fuel, MapPin } from 'lucide-react'
import React, { useEffect } from 'react'
import { useMap } from 'react-map-gl'

import { getDistance } from '../../helpers/geo.helpers.js'
import { displayNumber } from '../../helpers/number.helpers.js'
import { selectedAircraftAtom } from '../../state/aircraft.state.js'

const AircraftDetail = ({ aircraft, airport }) => {
  const [selectedAircraft, updateSelectedAircraft] =
    useAtom(selectedAircraftAtom)
  const { current: map } = useMap()

  useEffect(() => {
    if (selectedAircraft !== null) {
      map.flyTo({
        center: [selectedAircraft.last_lon, selectedAircraft.last_lat],
        zoom: 12,
      })
    } else {
      map.flyTo({
        center: [airport.lon, airport.lat],
        zoom: 7,
      })
    }
  }, [selectedAircraft])

  return (
    <Card
      my={1}
      p={2}
      cursor="pointer"
      bgColor={
        selectedAircraft && selectedAircraft.id === aircraft.id
          ? useColorModeValue('orange.300', 'orange.800')
          : ''
      }
      onClick={() =>
        updateSelectedAircraft(aircraft === selectedAircraft ? null : aircraft)
      }
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Heading size="sm">{aircraft.registration}</Heading>
        <Tag>{aircraft.owner_id === 0 ? 'Fleet' : 'Private'}</Tag>
      </Flex>
      <Flex mt={2} alignItems="center" justifyContent="space-between">
        <Text size="lg">{aircraft.fleet.type}</Text>
        <Text size="lg">
          {aircraft.fleet.manufacturer} {aircraft.fleet.name}
        </Text>
      </Flex>
      <Flex mt={2} alignItems="center" justifyContent="space-between">
        <Flex alignItems="center" gap={2}>
          <Icon boxSize={4} as={MapPin} />
          <Text size="lg">{aircraft.location.identifier}</Text>
          <Text size="lg">
            {displayNumber(
              getDistance(
                airport.lat,
                airport.lon,
                aircraft.last_lat,
                aircraft.last_lon
              )
            )}
            nm
          </Text>
        </Flex>
        <Flex alignItems="center" gap={2}>
          <Icon boxSize={4} as={Fuel} />
          <Text size="lg">{aircraft.fuel_onboard} gal</Text>
        </Flex>
      </Flex>
    </Card>
  )
}

export default AircraftDetail
