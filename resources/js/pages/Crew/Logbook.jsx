import {
  Badge,
  Box,
  Card,
  CardBody,
  Link as ChakraLink,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { Link as InertiaLink, router } from '@inertiajs/react'
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
                        </Td>
                        <Td>
                          {entry.departure_airport_id}
                          <br />
                          <span className="text-xs">
                            {entry.dep_airport.name}
                          </span>
                        </Td>
                        <Td>
                          {entry.destination_airport_id}
                          <br />
                          <span className="text-xs">
                            {entry.arr_airport.name}
                          </span>
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
