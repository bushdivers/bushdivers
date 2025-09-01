import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Icon,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { Link, router } from '@inertiajs/react'
import axios from 'axios'
import { Wrench } from 'lucide-react'
import React from 'react'

import AircraftCondition from '../../components/fleet/AircraftCondition'
import AppLayout from '../../components/layout/AppLayout'
import { convertMinuteDecimalToHoursAndMinutes } from '../../helpers/date.helpers'

const MyAircraft = ({ aircraft, rentals }) => {
  const handleSale = async (ac) => {
    const res = await axios.get(`/api/aircraft/price/${ac.id}`)
    if (res.status === 200) {
      if (
        window.confirm(
          `Are you sure you want to sell your aircraft ${ac.registration} for $${res.data.price}?`
        )
      ) {
        router.post(`/marketplace/sell/${ac.id}/user`)
      }
    }
  }

  return (
    <Box>
      <Card>
        <CardHeader>
          <Heading size="md">My Aircraft</Heading>
        </CardHeader>
        <CardBody>
          <Link href="/marketplace/user">
            <Button size="sm">Go To Marketplace</Button>
          </Link>
          <TableContainer>
            <Table>
              <Thead>
                <Tr>
                  <Th>Registration</Th>
                  <Th>Type</Th>
                  <Th>Location</Th>
                  <Th>Home</Th>
                  <Th>Hours</Th>
                  <Th>Condition</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {aircraft &&
                  aircraft.map((ac) => (
                    <Tr key={ac.id}>
                      <Td>
                        <Link href={`/aircraft/${ac.id}`} className="link">
                          {ac.registration}
                          {ac.maintenance_status && !ac.is_rental && (
                            <Icon ml={2} color="orange.500" as={Wrench} />
                          )}
                        </Link>
                      </Td>
                      <Td>{ac.fleet.type}</Td>
                      <Td>{ac.location.identifier}</Td>
                      <Td>{ac.hub.identifier}</Td>
                      <Td>
                        {convertMinuteDecimalToHoursAndMinutes(
                          ac.flight_time_mins
                        )}
                      </Td>
                      <Td>
                        <AircraftCondition aircraftCondition={ac.wear} />
                      </Td>
                      <Td>
                        <Button
                          colorScheme="gray"
                          size="xs"
                          onClick={() => handleSale(ac)}
                        >
                          Sell
                        </Button>
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
      </Card>
      <Card mt={2}>
        <CardHeader>
          <Heading size="md">My Rentals</Heading>
        </CardHeader>
        <CardBody>
          <Link href="/rentals">
            <Button size="sm">Go To Rentals</Button>
          </Link>
          <TableContainer className="overflow-x-auto">
            <Table className="table table-compact w-full my-2">
              <Thead>
                <Tr>
                  <Th>Registration</Th>
                  <Th>Type</Th>
                  <Th>Location</Th>
                  <Th>Home</Th>
                  <Th>Rental Cost (hour)</Th>
                </Tr>
              </Thead>
              <Tbody>
                {rentals &&
                  rentals.map((ac) => (
                    <Tr key={ac.id}>
                      <Td>{ac.registration}</Td>
                      <Td>{ac.fleet.type}</Td>
                      <Td>{ac.location.identifier}</Td>
                      <Td>{ac.hub.identifier}</Td>
                      <Td>${ac.fleet.rental_cost}</Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
      </Card>
    </Box>
  )
}

MyAircraft.layout = (page) => (
  <AppLayout children={page} heading="My Aircraft" title="My Aircraft" />
)

export default MyAircraft
