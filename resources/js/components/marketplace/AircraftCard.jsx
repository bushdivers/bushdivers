import { Badge, Box, Card, CardBody, Flex, Image, Text } from '@chakra-ui/react'
import { usePage } from '@inertiajs/react'
import React from 'react'

import { displayNumber } from '../../helpers/number.helpers.js'

const AircraftCard = ({ fleet, onClick, footer }) => {
  const { aircraftTypes } = usePage().props
  const typeLabel =
    (aircraftTypes ?? []).find((t) => t.value === fleet.aircraft_type)?.label ??
    'Other'

  return (
    <Card
      cursor="pointer"
      onClick={onClick}
      _hover={{
        shadow: 'lg',
        transform: 'translateY(-2px)',
        transition: 'all 0.15s ease',
      }}
      overflow="hidden"
    >
      <Box position="relative">
        {fleet.rental_image ? (
          <Image
            src={fleet.rental_image}
            alt={fleet.name}
            w="100%"
            h="180px"
            objectFit="cover"
          />
        ) : (
          <Flex
            w="100%"
            h="180px"
            bg="gray.100"
            _dark={{ bg: 'gray.700' }}
            alignItems="center"
            justifyContent="center"
          >
            <Text color="gray.400" fontSize="sm">
              No image
            </Text>
          </Flex>
        )}

        {fleet.manufacturer?.logo_url && (
          <Box
            position="absolute"
            bottom={2}
            left={2}
            bg="blackAlpha.600"
            borderRadius="md"
            p={1}
          >
            <Image
              src={fleet.manufacturer.logo_url}
              alt={fleet.manufacturer.name}
              h="24px"
              objectFit="contain"
            />
          </Box>
        )}
      </Box>

      <CardBody pt={3} pb={3}>
        <Text fontWeight="bold" fontSize="md" noOfLines={1}>
          {fleet.name}
        </Text>
        {fleet.manufacturer?.name && (
          <Text
            fontSize="xs"
            color="gray.500"
            _dark={{ color: 'gray.400' }}
            mb={1}
          >
            {fleet.manufacturer.name}
          </Text>
        )}

        <Flex gap={1} flexWrap="wrap" mb={2}>
          <Badge colorScheme="blue" fontSize="2xs">
            {typeLabel}
          </Badge>
          {fleet.has_floats && (
            <Badge colorScheme="teal" fontSize="2xs">
              Floats
            </Badge>
          )}
        </Flex>

        <Flex
          gap={3}
          fontSize="sm"
          color="gray.500"
          _dark={{ color: 'gray.400' }}
          flexWrap="wrap"
        >
          <Box>
            <Text fontWeight="medium">{fleet.cruise_speed} kt</Text>
            <Text fontSize="xs">Cruise</Text>
          </Box>
          <Box>
            <Text fontWeight="medium">
              {displayNumber(fleet.default_variant?.range)} nm
            </Text>
            <Text fontSize="xs">Range</Text>
          </Box>
          <Box>
            <Text fontWeight="medium">
              {fleet.default_variant?.pax_capacity}
            </Text>
            <Text fontSize="xs">PAX</Text>
          </Box>
          <Box>
            <Text fontWeight="medium">
              {displayNumber(fleet.default_variant?.cargo_capacity)} lbs
            </Text>
            <Text fontSize="xs">Cargo</Text>
          </Box>
        </Flex>

        <Flex mt={3} direction="column" gap={0.5}>
          {footer !== undefined ? (
            footer
          ) : (
            <>
              {!!fleet.can_purchase_new && (
                <Text
                  fontWeight="semibold"
                  fontSize="sm"
                  color="orange.500"
                  _dark={{ color: 'orange.200' }}
                >
                  New from ${displayNumber(fleet.new_price)}
                </Text>
              )}
              {fleet.used_low_price > 0 && (
                <Text
                  fontWeight="semibold"
                  fontSize="sm"
                  color="orange.500"
                  _dark={{ color: 'orange.200' }}
                >
                  Used from ${displayNumber(fleet.used_low_price)}
                </Text>
              )}
            </>
          )}
        </Flex>
      </CardBody>
    </Card>
  )
}

export default AircraftCard
