import {
  Badge,
  Box,
  Divider,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'
import { usePage } from '@inertiajs/react'
import React from 'react'

import { displayNumber } from '../../helpers/number.helpers.js'

const SpecRow = ({ label, value }) => (
  <Flex
    justifyContent="space-between"
    py={1.5}
    borderBottomWidth="1px"
    borderColor="gray.100"
    _dark={{ borderColor: 'gray.700' }}
  >
    <Text fontSize="sm" color="gray.500" _dark={{ color: 'gray.400' }}>
      {label}
    </Text>
    <Text fontSize="sm" fontWeight="medium">
      {value}
    </Text>
  </Flex>
)

const AircraftDetailModal = ({ fleet, isOpen, onClose, actions }) => {
  const { aircraftTypes } = usePage().props
  if (!fleet) return null

  const typeLabel =
    (aircraftTypes ?? []).find((t) => t.value === fleet.aircraft_type)?.label ??
    'Other'
  const fuelTypeLabel = fleet.fuel_type === 1 ? 'Avgas' : 'Jet Fuel'
  const variant = fleet.default_variant

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        {(() => {
          const src = fleet.image_url || fleet.rental_image
          const credit = fleet.image_url
            ? fleet.fleet_image_credit
            : fleet.rental_image_credit
          return src ? (
            <Box position="relative">
              <Image
                src={src}
                alt={fleet.name}
                w="100%"
                h="220px"
                objectFit="cover"
                borderTopRadius="md"
              />
              {!!credit && (
                <Box
                  position="absolute"
                  bottom={2}
                  right={2}
                  bg="blackAlpha.500"
                  borderRadius="md"
                  px={2}
                  py={1}
                >
                  <Text fontSize="2xs" color="whiteAlpha.800">
                    Photo: {credit}
                  </Text>
                </Box>
              )}
            </Box>
          ) : (
            <Flex
              w="100%"
              h="100px"
              bg="gray.100"
              _dark={{ bg: 'gray.700' }}
              alignItems="center"
              justifyContent="center"
              borderTopRadius="md"
            >
              <Text color="gray.400" fontSize="sm">
                No image available
              </Text>
            </Flex>
          )
        })()}

        <ModalHeader pb={1}>
          <Flex alignItems="center" gap={3}>
            {fleet.manufacturer?.logo_url && (
              <Image
                src={fleet.manufacturer.logo_url}
                alt={fleet.manufacturer.name}
                h="28px"
                objectFit="contain"
              />
            )}
            <Box>
              <Text fontSize="xl" fontWeight="bold" lineHeight="short">
                {fleet.name}
              </Text>
              {fleet.manufacturer?.name && (
                <Text fontSize="sm" color="gray.500" fontWeight="normal">
                  {fleet.manufacturer.name}
                </Text>
              )}
            </Box>
          </Flex>
          <Flex gap={2} mt={2} flexWrap="wrap">
            <Badge colorScheme="blue">{typeLabel}</Badge>
            {fleet.has_floats && <Badge colorScheme="teal">Float option</Badge>}
          </Flex>
        </ModalHeader>

        <ModalCloseButton />

        <ModalBody>
          <SimpleGrid columns={2} gap={4}>
            <Box>
              <Text
                fontSize="xs"
                fontWeight="bold"
                textTransform="uppercase"
                color="gray.400"
                mb={2}
              >
                Powerplant
              </Text>
              <SpecRow
                label="Engines"
                value={`${fleet.number_of_engines} × ${fleet.powerplants}`}
              />
              <SpecRow label="Fuel type" value={fuelTypeLabel} />
              <SpecRow
                label="Fuel capacity"
                value={`${displayNumber(variant?.fuel_capacity)} gal`}
              />
            </Box>

            <Box>
              <Text
                fontSize="xs"
                fontWeight="bold"
                textTransform="uppercase"
                color="gray.400"
                mb={2}
              >
                Performance
              </Text>
              <SpecRow
                label="Cruise speed"
                value={`${fleet.cruise_speed} KIAS`}
              />
              <SpecRow
                label="Service ceiling"
                value={`${displayNumber(fleet.service_ceiling)} ft`}
              />
              <SpecRow
                label="Range"
                value={`${displayNumber(variant?.range)} nm`}
              />
            </Box>

            <Box>
              <Text
                fontSize="xs"
                fontWeight="bold"
                textTransform="uppercase"
                color="gray.400"
                mb={2}
              >
                Weights
              </Text>
              <SpecRow
                label="MTOW"
                value={`${displayNumber(variant?.mtow)} lbs`}
              />
              <SpecRow
                label="ZFW"
                value={`${displayNumber(variant?.zfw)} lbs`}
              />
            </Box>

            <Box>
              <Text
                fontSize="xs"
                fontWeight="bold"
                textTransform="uppercase"
                color="gray.400"
                mb={2}
              >
                Capacity
              </Text>
              <SpecRow label="PAX" value={variant?.pax_capacity} />
              <SpecRow
                label="Cargo"
                value={`${displayNumber(variant?.cargo_capacity)} lbs`}
              />
            </Box>
          </SimpleGrid>

          {variant?.sim_type?.length > 0 && (
            <Box mt={4}>
              <Divider mb={3} />
              <Flex gap={2} flexWrap="wrap">
                <Text fontSize="sm" color="gray.500">
                  Simulator:
                </Text>
                {variant.sim_type.map((s) => (
                  <Badge key={s} colorScheme="purple" textTransform="uppercase">
                    {s}
                  </Badge>
                ))}
              </Flex>
            </Box>
          )}

          <Divider mt={4} mb={3} />
          <SimpleGrid columns={2} gap={4}>
            {!!fleet.can_purchase_new && (
              <SpecRow
                label="New price"
                value={`$${displayNumber(fleet.new_price)}`}
              />
            )}

            {!!fleet.used_low_price && (
              <>
                <SpecRow
                  label="Used price"
                  value={`$${displayNumber(
                    fleet.used_low_price
                  )} - $${displayNumber(fleet.used_high_price)}`}
                />
              </>
            )}
          </SimpleGrid>
        </ModalBody>

        {actions && <ModalFooter gap={2}>{actions}</ModalFooter>}
      </ModalContent>
    </Modal>
  )
}

export default AircraftDetailModal
