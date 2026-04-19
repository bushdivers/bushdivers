import {
  Badge,
  Box,
  Link as ChakraLink,
  Divider,
  Flex,
  Icon,
  Image,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Tag,
  Text,
} from '@chakra-ui/react'
import { Link } from '@inertiajs/react'
import { Anchor, Package, Star } from 'lucide-react'
import React from 'react'

import { runwaySurface } from '../../helpers/airport.helpers.js'
import { SimTypeColors } from '../../helpers/simtype.helpers.js'

const AirportPopoverDetails = ({ airport }) => {
  const isWater = airport.longest_runway_surface === 'W'
  const hasRunwayDetail = airport.longest_runway_length != null
  const hasFuel = airport.has_avgas || airport.has_jetfuel
  const hasFuelPrices =
    airport.avgas_price != null || airport.jetfuel_price != null
  const hasSimTypes = airport.sim_type?.length > 0
  const hasFlags =
    airport.is_hub || isWater || airport.is_thirdparty || hasSimTypes
  const hasPhysical = airport.altitude != null || hasRunwayDetail

  return (
    <>
      <Box px={4} py={2} borderBottomWidth="1px">
        <Flex justifyContent="space-between" alignItems="center" gap={2}>
          <Flex direction="column" minW={0}>
            <Text fontSize="sm" fontWeight="bold" noOfLines={1}>
              {airport.name}
            </Text>
            {airport.country && (
              <Text color="gray.500" noOfLines={1}>
                {airport.country}
              </Text>
            )}
          </Flex>
          <Flex alignItems="center" gap={1} flexShrink={0}>
            {airport.size !== null && (
              <Badge colorScheme="orange" fontSize="2xs">
                {airport.size}
              </Badge>
            )}
            {airport.flag && (
              <Image
                rounded="sm"
                h={4}
                src={airport.flag}
                alt={airport.country}
              />
            )}
          </Flex>
        </Flex>
      </Box>
      <Box p={4}>
        <Flex direction="column" gap={1.5}>
          {/* Characteristics: flags + physical on one section, one divider above fuel */}
          {(hasFlags || hasPhysical) && (
            <Flex direction="column" gap={1}>
              {hasFlags && (
                <Flex gap={2} flexWrap="wrap" alignItems="center">
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
              )}
              {hasPhysical && (
                <Text color="gray.500">
                  {hasRunwayDetail && (
                    <>
                      {runwaySurface(airport.longest_runway_surface)}{' '}
                      {airport.longest_runway_length.toLocaleString()} x{' '}
                      {airport.longest_runway_width.toLocaleString()} ft
                    </>
                  )}
                  {hasRunwayDetail && airport.altitude != null && ' · '}
                  {airport.altitude != null && (
                    <>Elev. {airport.altitude.toLocaleString()} ft</>
                  )}
                </Text>
              )}
            </Flex>
          )}

          {/* Fuel */}
          {hasFuel && (
            <>
              <Divider />
              <Flex direction="column" gap={1}>
                {airport.has_avgas && (
                  <Flex justifyContent="space-between">
                    <Tag size="sm" colorScheme="blue">
                      100LL
                    </Tag>
                    {hasFuelPrices && airport.avgas_price != null && (
                      <Text color="gray.500">
                        ${airport.avgas_price}/gal
                        {airport.avgas_qty != null && !airport.is_hub && (
                          <> · {airport.avgas_qty.toLocaleString()} gal</>
                        )}
                        {airport.is_hub && <> · unlimited</>}
                      </Text>
                    )}
                  </Flex>
                )}
                {airport.has_jetfuel && (
                  <Flex justifyContent="space-between">
                    <Tag size="sm" colorScheme="green">
                      Jet A
                    </Tag>
                    {hasFuelPrices && airport.jetfuel_price != null && (
                      <Text color="gray.500">
                        ${airport.jetfuel_price}/gal
                        {airport.jetfuel_qty != null && !airport.is_hub && (
                          <> · {airport.jetfuel_qty.toLocaleString()} gal</>
                        )}
                        {airport.is_hub && <> · unlimited</>}
                      </Text>
                    )}
                  </Flex>
                )}
              </Flex>
            </>
          )}
        </Flex>
      </Box>
    </>
  )
}

export const AirportPopoverPanel = ({ airport }) => {
  return (
    <Box
      fontSize="xs"
      w="280px"
      boxShadow="xl"
      rounded="md"
      overflow="hidden"
      cursor="default"
      bg="white"
      _dark={{ bg: 'gray.700' }}
      onClick={(e) => e.stopPropagation()}
    >
      <AirportPopoverDetails airport={airport} />
    </Box>
  )
}

export const AirportPopoverContent = ({ airport }) => {
  return (
    <PopoverContent
      fontSize="xs"
      w="280px"
      boxShadow="xl"
      cursor="default"
      _dark={{ bg: 'gray.700' }}
      onClick={(e) => e.stopPropagation()}
    >
      <PopoverArrow />
      <AirportPopoverDetails airport={airport} />
    </PopoverContent>
  )
}

const AirportLabel = ({ airport, size = 'md' }) => {
  const isWater = airport.longest_runway_surface === 'W'

  return (
    <Flex alignItems="center" gap={1}>
      <Popover trigger="hover" isLazy placement="top" strategy="fixed">
        <PopoverTrigger>
          <ChakraLink
            color="orange.400"
            as={Link}
            href={`/airports/${airport.identifier}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Text fontSize={size}>{airport.identifier}</Text>
          </ChakraLink>
        </PopoverTrigger>
        <AirportPopoverContent airport={airport} />
      </Popover>
      {isWater && <Icon as={Anchor} color="blue.500" />}
      {airport.is_thirdparty && <Icon as={Package} color="green.500" />}
    </Flex>
  )
}

export default AirportLabel
