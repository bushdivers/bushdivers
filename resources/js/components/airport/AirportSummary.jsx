import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Icon,
  Image,
  Text,
} from '@chakra-ui/react'
import { router, usePage } from '@inertiajs/react'
import { Anchor } from 'lucide-react'
import React from 'react'

import { displayNumber } from '../../helpers/number.helpers.js'
import AirportSearch from './AirportSearch.jsx'
import AvailableFuel from './AvailableFuel.jsx'

const AirportSummary = ({ airport }) => {
  const { auth } = usePage().props
  function renameAirport(airport) {
    const newIcao = window.prompt(
      'Enter new ICAO code for this airport',
      airport
    )
    if (newIcao.length <= 2) return

    router.post('/airports/maintenance/rename', { airport, newIcao })
  }
  return (
    <Box position="absolute" top={3} right={3} w={300}>
      <Card mb={2} p={2}>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading maxHeight="50px" size="md">
            {airport.name}
          </Heading>
          <Flex gap={2}>
            <Text fontSize="xs">{airport.country}</Text>
            <Image rounded="sm" h={5} src={airport.flag} />
          </Flex>
        </Flex>
        <Flex
          justifyContent="space-between"
          mt={2}
          mb={1}
          alignItems="center"
          gap={2}
        >
          <Flex alignItems="center" gap={2}>
            <Text as="b">{airport.identifier}</Text>
            {airport.longest_runway_surface === 'W' && (
              <Icon as={Anchor} color="blue.500" />
            )}
          </Flex>

          {auth.user.user_roles.includes('airport_manager') && (
            <Button
              onClick={() => renameAirport(airport.identifier)}
              size="xs"
              variant="ghost"
              colorScheme="gray"
            >
              Rename ICAO
            </Button>
          )}
        </Flex>
        <Flex alignItems="center" gap={2} mb={2}>
          <Text>Elev. {displayNumber(airport.altitude)} ft</Text>
          <Text>
            Longest Rwy. {displayNumber(airport.longest_runway_length)} ft
          </Text>
        </Flex>
        <Flex justifyContent="center">
          <AvailableFuel airport={airport} />
        </Flex>
      </Card>
      <AirportSearch />
    </Box>
  )
}

export default AirportSummary
