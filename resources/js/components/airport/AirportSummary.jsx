import {
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Heading,
  Icon,
  Image,
  Tag,
  Text,
} from '@chakra-ui/react'
import { router, usePage } from '@inertiajs/react'
import { Anchor, Package, Star } from 'lucide-react'
import React from 'react'

import { runwaySurface } from '../../helpers/airport.helpers.js'
import { SimTypeColors } from '../../helpers/simtype.helpers.js'
import AirportSearch from './AirportSearch.jsx'

const AirportSummary = ({ airport }) => {
  const { auth } = usePage().props
  const isWater = airport.longest_runway_surface === 'W'
  const hasSimTypes = airport.sim_type?.length > 0

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
      <Card mb={2} p={3}>
        {/* Header: name + country/flag */}
        <Flex justifyContent="space-between" alignItems="flex-start" gap={2}>
          <Heading size="md" noOfLines={2} flex={1}>
            {airport.name}
          </Heading>
          <Flex alignItems="center" gap={1} flexShrink={0}>
            {airport.size != null && (
              <Badge colorScheme="orange" fontSize="2xs">
                {airport.size}
              </Badge>
            )}
            <Image rounded="sm" h={4} src={airport.flag} />
          </Flex>
        </Flex>
        {airport.country && (
          <Text fontSize="xs" color="gray.500" mb={2}>
            {airport.country}
          </Text>
        )}

        {/* ICAO + flags row */}
        <Flex justifyContent="space-between" alignItems="center" mb={2}>
          <Flex alignItems="center" gap={2}>
            <Text as="b" fontSize="md">
              {airport.identifier}
            </Text>
            {airport.is_hub && (
              <Icon as={Star} boxSize={3} color="orange.400" />
            )}
            {isWater && <Icon as={Anchor} boxSize={3} color="blue.500" />}
            {airport.is_thirdparty && (
              <Icon as={Package} boxSize={3} color="green.500" />
            )}
            {hasSimTypes &&
              airport.sim_type.map((type) => (
                <Tag
                  key={type}
                  size="sm"
                  colorScheme={SimTypeColors[type] ?? 'gray'}
                  textTransform="uppercase"
                >
                  {type}
                </Tag>
              ))}
          </Flex>
          {auth.user.user_roles.includes('airport_manager') && (
            <Button
              onClick={() => renameAirport(airport.identifier)}
              size="xs"
              variant="ghost"
              colorScheme="gray"
            >
              Rename
            </Button>
          )}
        </Flex>

        {/* Physical */}
        <Text fontSize="xs" color="gray.500" mb={2}>
          {airport.longest_runway_length && (
            <>
              {runwaySurface(airport.longest_runway_surface)}{' '}
              {airport.longest_runway_length.toLocaleString()} x{' '}
              {airport.longest_runway_width.toLocaleString()} ft
            </>
          )}
          {airport.longest_runway_length && airport.altitude && ' · '}
          {airport.altitude && (
            <>Elev. {airport.altitude.toLocaleString()} ft</>
          )}
        </Text>

        <Divider mb={2} />

        <Flex direction="column" gap={1}>
          {airport.avgas_qty > 0 || airport.is_hub ? (
            <Flex justifyContent="space-between" alignItems="center">
              <Tag size="sm" colorScheme="blue">
                100LL
              </Tag>
              <Text fontSize="xs" color="gray.500">
                ${airport.avgas_price}/gal
                {!airport.is_hub &&
                  airport.avgas_qty != null &&
                  ` · ${airport.avgas_qty.toLocaleString()} gal`}
                {airport.is_hub && ' · unlimited'}
              </Text>
            </Flex>
          ) : (
            <Text fontSize="xs" color="gray.400">
              No 100LL
            </Text>
          )}
          {airport.jetfuel_qty > 0 || airport.is_hub ? (
            <Flex justifyContent="space-between" alignItems="center">
              <Tag size="sm" colorScheme="green">
                Jet A
              </Tag>
              <Text fontSize="xs" color="gray.500">
                ${airport.jetfuel_price}/gal
                {!airport.is_hub &&
                  airport.jetfuel_qty != null &&
                  ` · ${airport.jetfuel_qty.toLocaleString()} gal`}
                {airport.is_hub && ' · unlimited'}
              </Text>
            </Flex>
          ) : (
            <Text fontSize="xs" color="gray.400">
              No Jet A
            </Text>
          )}
        </Flex>
      </Card>
      <AirportSearch />
    </Box>
  )
}

export default AirportSummary
