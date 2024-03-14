import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
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
import React from 'react'

import AppLayout from '../../components/layout/AppLayout'
import { displayNumber } from '../../helpers/number.helpers.js'

const RentalList = ({ aircraft, myRentals, currentAirport }) => {
  const { auth } = usePage().props

  const handleRental = (ac) => {
    const confirm = window.confirm(
      `Confirm you would like to rent a ${ac.manufacturer} ${ac.name} for $${
        ac.rental_cost
      }ph and a returnable deposit of $${ac.rental_cost * 10}`
    )
    if (confirm) {
      router.post('/rentals', { aircraft: ac.id })
    }
  }

  const handleCancel = (ac) => {
    if (ac.current_airport_id !== ac.rental_airport_id) {
      const confirm = window.confirm(
        `Aircraft ${ac.registration} is not at its home location, if you end the rental now you will not get your deposit back. Do you wish to continue?`
      )
      if (confirm) {
        returnRental(ac)
      }
    } else {
      returnRental(ac)
    }
  }

  const returnRental = (ac) => {
    router.post(`/rentals/end/${ac.id}`)
  }

  const RentalButton = (props) => {
    return (
      <Button onClick={() => handleRental(props.aircraft)}>
        Rent {props.aircraft.name}
      </Button>
    )
  }

  const renderRentalButton = (ac) => {
    if (currentAirport.is_hub || currentAirport.size >= 4) {
      if (ac.rental_size === 1 && currentAirport.size >= 3) {
        return <RentalButton aircraft={ac} />
      } else if (ac.rental_size === 0) {
        return <RentalButton aircraft={ac} />
      } else {
        return (
          <Text color="red.500" mt={4} fontSize="sm">
            Aircraft not available here
          </Text>
        )
      }
    }
  }

  return (
    <>
      <Box>
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
                            <Link href={`airports/${ac.current_airport_id}`}>
                              {ac.current_airport_id}
                            </Link>
                          </Td>
                          <Td>
                            <Link href={`airports/${ac.rental_airport_id}`}>
                              {ac.rental_airport_id}
                            </Link>
                          </Td>
                          <Td>${ac.fleet.rental_cost}</Td>
                          <Td>
                            <Button size="xs" onClick={() => handleCancel(ac)}>
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
      </Box>
      <Heading size="md" className="my-2">
        {currentAirport.is_hub || currentAirport.size >= 4 ? (
          <Box>
            Aircraft Available for Rental - {auth.user.current_airport_id}
          </Box>
        ) : (
          <Box>
            {auth.user.current_airport_id} -{' '}
            <Text fontSize="sm" color="red.500">
              You must be at a hub or large airport to rent aircraft
            </Text>
          </Box>
        )}
      </Heading>
      <SimpleGrid mt={2} colums={3} gap={5}>
        {aircraft &&
          aircraft.map((ac) => (
            <Card key={ac.id}>
              <CardBody>
                <img className="rounded-t" src={ac.rental_image} />
                <Heading size="sm" mt={2}>
                  {ac.type} {ac.manufacturer} - {ac.name}
                </Heading>
                <Box mt={1}>
                  ${displayNumber(ac.rental_cost)} per hour{' '}
                  <Text fontSize="sm">(min. 2 hours per day)</Text>
                </Box>
                <Text>
                  ${displayNumber(ac.rental_cost * 10)} Returnable deposit
                </Text>
                <Box my={2}>
                  <Text>Cargo (lbs): {displayNumber(ac.cargo_capacity)}</Text>
                  <Text>Pax: {ac.pax_capacity}</Text>
                  <Text>Fuel (gal): {displayNumber(ac.fuel_capacity)}</Text>
                  <Text>Cruise (kts): {ac.cruise_speed}</Text>
                  <Text>Range (nm): {displayNumber(ac.range)}</Text>
                </Box>
                {renderRentalButton(ac)}
              </CardBody>
            </Card>
          ))}
      </SimpleGrid>
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
