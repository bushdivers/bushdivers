import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
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
import { router } from '@inertiajs/react'
import { Wrench } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import AircraftCondition from '../../components/fleet/AircraftCondition'
import AppLayout from '../../components/layout/AppLayout'
import {
  convertMinuteDecimalToHoursAndMinutes,
  formatDate,
} from '../../helpers/date.helpers.js'
import { dynamicSort } from '../../helpers/generic.helpers.js'
import { getDistance } from '../../helpers/geo.helpers'
import { displayNumber } from '../../helpers/number.helpers.js'

const UsedAircraft = ({ aircraft, currentLocation, fleet, buyer }) => {
  const [updatedAircraft, setUpdatedAircraft] = useState(aircraft)
  const handlePurchase = (ac) => {
    router.get(`/marketplace/purchase/used/${ac.id}/${buyer}`)
  }

  useEffect(() => {
    const updatedAircraft = aircraft.map((item) => ({
      ...item,
      distance: getDistance(
        currentLocation.lat,
        currentLocation.lon,
        item.location.lat,
        item.location.lon
      ),
    }))
    setUpdatedAircraft(updatedAircraft.sort(dynamicSort('distance', 'asc')))
  }, [aircraft])

  return (
    <Box>
      <Card>
        <CardHeader>
          <Heading size="md">
            {fleet.manufacturer} {fleet.name} - {fleet.type}
          </Heading>
        </CardHeader>
        <CardBody>
          <TableContainer>
            <Table>
              <Thead>
                <Tr>
                  <Th>Registration</Th>
                  <Th>Location</Th>
                  <Th>Distance</Th>
                  <Th>Airframe Condition</Th>
                  <Th>Airframe (hrs)</Th>
                  <Th>Last Inspection</Th>
                  <Th>Engines</Th>
                  <Th>Price</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {aircraft &&
                  updatedAircraft.map((ac) => (
                    <Tr key={ac.id}>
                      <Td>
                        <Flex alignItems="center">
                          {ac.registration}
                          {ac.maintenance_status && (
                            <Box mx={2}>
                              <Box color="orange.400">
                                <Icon as={Wrench} />
                              </Box>
                            </Box>
                          )}
                        </Flex>
                      </Td>
                      <Td>
                        {ac.current_airport_id} <br />
                        <span className="text-sm">{ac.location.name}</span>
                      </Td>
                      <Td>{ac.distance} nm</Td>
                      <Td>
                        <AircraftCondition aircraftCondition={ac.wear} />
                      </Td>
                      <Td>
                        {convertMinuteDecimalToHoursAndMinutes(
                          ac.flight_time_mins
                        )}
                      </Td>
                      <Td>
                        {ac.last_inspected_at
                          ? formatDate(ac.last_inspected_at)
                          : 'Never'}
                      </Td>
                      <Td>
                        {ac.engines.map((e) => (
                          <Box key={e.id}>
                            <Box>
                              {convertMinuteDecimalToHoursAndMinutes(
                                e.mins_since_tbo
                              )}{' '}
                              hrs
                              <AircraftCondition aircraftCondition={e.wear} />
                            </Box>
                          </Box>
                        ))}
                      </Td>
                      <Td>${displayNumber(ac.sale_price, true)}</Td>
                      <Td>
                        <Button size="sm" onClick={() => handlePurchase(ac)}>
                          Purchase
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
  )
}

UsedAircraft.layout = (page) => (
  <AppLayout
    children={page}
    title="Marketplace - Used Aircraft"
    heading="Marketplace - Used Aircraft"
  />
)

export default UsedAircraft
