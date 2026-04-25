import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  SimpleGrid,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { Link, router, usePage } from '@inertiajs/react'
import React, { useState } from 'react'

import { useMessageBox } from '../../components/elements/MessageBoxProvider.jsx'
import AppLayout from '../../components/layout/AppLayout'
import AircraftCard from '../../components/marketplace/AircraftCard.jsx'
import AircraftDetailModal from '../../components/marketplace/AircraftDetailModal.jsx'
import { displayNumber } from '../../helpers/number.helpers.js'

const RentalList = ({ aircraft, myRentals, currentAirport }) => {
  const { auth } = usePage().props
  const messageBox = useMessageBox()
  const [selectedFleet, setSelectedFleet] = useState(null)

  const handleRental = async (ac) => {
    const accepted = await messageBox.confirm({
      title: 'Confirm Rental',
      description: `Confirm you would like to rent a ${
        ac.manufacturer?.name ?? ac.manufacturer
      } ${ac.name} for $${ac.rental_cost} per hour.`,
      status: 'warning',
      confirmText: 'Rent Aircraft',
    })

    if (accepted) {
      router.post('/rentals', { aircraft: ac.id })
    }
  }

  const returnRental = (ac) => {
    router.post(`/rentals/end/${ac.id}`)
  }

  const canRentAt = (ac) => {
    if (!currentAirport.is_hub && currentAirport.size < 4) return false
    if (ac.rental_size === 1 && currentAirport.size < 3) return false
    return true
  }

  const rentalModalActions = (ac) => {
    if (!ac) return null
    if (canRentAt(ac)) {
      return (
        <Button onClick={() => handleRental(ac)}>
          Rent – ${displayNumber(ac.rental_cost)}/hr
        </Button>
      )
    }
    return (
      <Text color="red.500" fontSize="sm">
        Aircraft not available here
      </Text>
    )
  }

  return (
    <>
      <Box my={2}>
        <Card>
          <CardHeader>
            <Heading size="md">My Rentals</Heading>
          </CardHeader>
          <CardBody>
            <TableContainer className="overflow-x-auto">
              <Table className="table table-compact w-full">
                <Thead>
                  <Tr>
                    <Th>Registration</Th>
                    <Th>Type</Th>
                    <Th>Location</Th>
                    <Th>Home</Th>
                    <Th>Rental Cost (hour)</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {myRentals &&
                    myRentals.map((ac) => (
                      <Tr key={ac.id}>
                        <Td>{ac.registration}</Td>
                        <Td>
                          {ac.fleet.manufacturer} {ac.fleet.name} (
                          {ac.fleet.type})
                        </Td>
                        <Td>
                          <Link href={`airports/${ac.location.identifier}`}>
                            {ac.location.identifier}
                          </Link>
                        </Td>
                        <Td>
                          <Link href={`airports/${ac.hub.identifier}`}>
                            {ac.hub.identifier}
                          </Link>
                        </Td>
                        <Td>${ac.fleet.rental_cost}</Td>
                        <Td>
                          <Button size="xs" onClick={() => returnRental(ac)}>
                            End rental
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>
      </Box>

      <Flex alignItems="center" mb={4}>
        <Heading size="md">
          {currentAirport.is_hub || currentAirport.size >= 4 ? (
            <>Aircraft Available for Rental — {auth.user.location.identifier}</>
          ) : (
            <>
              {auth.user.location.identifier} —{' '}
              <Text as="span" fontSize="sm" color="red.500" fontWeight="normal">
                You must be at a hub or large airport to rent aircraft
              </Text>
            </>
          )}
        </Heading>
      </Flex>

      {aircraft && aircraft.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={5}>
          {aircraft.map((ac) => (
            <AircraftCard
              key={ac.id}
              fleet={ac}
              onClick={() => setSelectedFleet(ac)}
              footer={
                <Text
                  fontWeight="semibold"
                  fontSize="sm"
                  color="orange.500"
                  _dark={{ color: 'orange.200' }}
                >
                  ${displayNumber(ac.rental_cost)} / hr
                </Text>
              }
            />
          ))}
        </SimpleGrid>
      ) : (
        <Flex justifyContent="center" py={16}>
          <Text color="gray.400">No aircraft available at this location.</Text>
        </Flex>
      )}

      <AircraftDetailModal
        fleet={selectedFleet}
        isOpen={!!selectedFleet}
        onClose={() => setSelectedFleet(null)}
        actions={rentalModalActions(selectedFleet)}
      />
    </>
  )
}

RentalList.layout = (page) => (
  <AppLayout
    children={page}
    title="Aircraft Rentals"
    heading="Aircraft Rentals"
  />
)

export default RentalList
