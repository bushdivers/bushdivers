import {
  Badge,
  Box,
  Card,
  CardBody,
  Link as ChakraLink,
  Flex,
  Icon,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { Link as InertiaLink, router } from '@inertiajs/react'
import { Anchor, Package } from 'lucide-react'
import React from 'react'

import Pagination from '../../components/elements/Pagination'
import AppLayout from '../../components/layout/AppLayout'
import { formatDate } from '../../helpers/date.helpers'
import { convertMinuteDecimalToHoursAndMinutes } from '../../helpers/date.helpers'

const Logbook = ({ logbook }) => {
  function loadPirep(pirep) {
    router.get(`/logbook/${pirep.id}`)
  }

  return (
    <>
      <Box>
        <Card>
          <CardBody>
            {logbook.length === 0 ? (
              <Box>No flights yet.</Box>
            ) : (
              <TableContainer>
                <Table size="sm" variant="simple">
                  <Thead>
                    <Tr>
                      <Th></Th>
                      <Th>Departure</Th>
                      <Th>Arrival</Th>
                      <Th>Time</Th>
                      <Th>Distance</Th>
                      <Th>Points</Th>
                      <Th>Date</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {logbook.data.map((entry) => (
                      <Tr key={entry.id}>
                        <Td
                          className="text-primary cursor-pointer"
                          onClick={() => loadPirep(entry)}
                        >
                          <ChakraLink
                            color="orange.400"
                            as={InertiaLink}
                            href={`/logbook/${entry.id}`}
                          >
                            View Pirep
                          </ChakraLink>
                          {entry.state === 5 && (
                            <Badge ml={2} colorScheme="orange" fontSize="0.7em">
                              Review
                            </Badge>
                          )}
                          {entry.tour_id && (
                            <Tag size="sm" ml={2}>
                              Tour Flight: {entry.tour?.title}
                            </Tag>
                          )}
                        </Td>
                        <Td>
                          <Flex alignItems="center" gap={2}>
                            <Box>
                              {entry.departure_airport_id}
                              <br />
                              <Text fontSize="xs">
                                {entry.dep_airport.name}
                              </Text>
                            </Box>
                            {entry.dep_airport.longest_runway_surface ===
                              'W' && <Icon as={Anchor} color="blue.500" />}
                            {entry.dep_airport.is_thirdparty && (
                              <Icon as={Package} color="green.500" />
                            )}
                          </Flex>
                        </Td>
                        <Td>
                          <Flex alignItems="center" gap={2}>
                            <Box>
                              {entry.destination_airport_id}
                              <br />
                              <Text fontSize="xs">
                                {entry.arr_airport.name}
                              </Text>
                            </Box>
                            {entry.arr_airport.longest_runway_surface ===
                              'W' && <Icon as={Anchor} color="blue.500" />}
                            {entry.arr_airport.is_thirdparty && (
                              <Icon as={Package} color="green.500" />
                            )}
                          </Flex>
                        </Td>
                        <Td>
                          {convertMinuteDecimalToHoursAndMinutes(
                            entry.flight_time
                          )}
                        </Td>
                        <Td>
                          {entry.distance &&
                            entry.distance.toLocaleString(navigator.language)}
                          nm
                        </Td>
                        <Td>
                          {entry.score &&
                            entry.score.toLocaleString(navigator.language)}
                        </Td>
                        <Td>{formatDate(entry.submitted_at)}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
            <Box mt={2}>
              <Pagination pages={logbook} />
            </Box>
          </CardBody>
        </Card>
      </Box>
    </>
  )
}

Logbook.layout = (page) => (
  <AppLayout children={page} title="Logbook" heading="Logbook" />
)

export default Logbook
