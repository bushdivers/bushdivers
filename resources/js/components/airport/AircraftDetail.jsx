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
import { useMap } from 'react-map-gl/maplibre'

import { getDistance } from '../../helpers/geo.helpers.js'
import { displayNumber } from '../../helpers/number.helpers.js'
import { selectedAircraftAtom } from '../../state/aircraft.state.js'

const AircraftDetail = ({ aircraft, airport }) => {
  const [selectedAircraft, updateSelectedAircraft] =
    useAtom(selectedAircraftAtom)
  const { current: map } = useMap()
  const selectedBgColor = useColorModeValue('orange.300', 'orange.800')

  useEffect(() => {
    if (selectedAircraft !== null) {
      map.flyTo({
        // rental don't have last lat/lon, so we need to use location instead
        center: [
          selectedAircraft.last_lon ?? selectedAircraft.location.lon,
          selectedAircraft.last_lat ?? selectedAircraft.location.lat,
        ],
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
        selectedAircraft &&
        selectedAircraft.registration === aircraft.registration
          ? selectedBgColor
          : ''
      }
      onClick={() =>
        updateSelectedAircraft(aircraft === selectedAircraft ? null : aircraft)
      }
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Heading size="sm">{aircraft.registration}</Heading>
        <Tag>
          {aircraft.owner_id === 0
            ? 'Fleet'
            : aircraft.owner_id > 0
              ? 'Private'
              : 'Rental'}
        </Tag>
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
              /* rental have no last lat/lon, use location instead */
              getDistance(
                airport.lat,
                airport.lon,
                aircraft.last_lat ?? aircraft.location.lat,
                aircraft.last_lon ?? aircraft.location.lon
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
