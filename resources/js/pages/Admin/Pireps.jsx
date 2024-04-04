import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Icon,
  Input,
  Link,
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
import { router } from '@inertiajs/react'
import { format } from 'date-fns'
import { Check } from 'lucide-react'
import React, { useState } from 'react'

import NoContent from '../../components/elements/NoContent'
import Pagination from '../../components/elements/Pagination'
import AdminLayout from '../../components/layout/AdminLayout.jsx'

const EmptyData = () => {
  return (
    <>
      <div>There are no pirep entries</div>
    </>
  )
}

const Pireps = ({ pireps }) => {
  const [pirepId, setPirepId] = useState('')
  function loadPirep(pirep) {
    router.get(`/logbook/${pirep.id}`)
  }

  const renderPirepState = (state) => {
    switch (state) {
      case 1:
        return 'Dispatch'
      case 2:
        return 'In Progress'
      case 3:
        return 'Accepted'
      case 4:
        return 'Rejected'
      case 5:
        return 'Review'
    }
  }

  function handleChange(e) {
    setPirepId(e.target.value)
  }

  function handleSearch() {
    if (pirepId !== '') router.get(`/logbook/${pirepId}`)
  }

  function approvePirep(entry) {
    router.post('/pireps/approve', { pirep_id: entry.id })
  }

  return (
    <Card>
      <CardBody>
        {pireps.length === 0 ? (
          <NoContent content={<EmptyData />} />
        ) : (
          <>
            <Flex gap={2} alignItems="center">
              <Box className="text-gray-700">Pirep Id</Box>
              <Box>
                <Input
                  id="pirep"
                  type="text"
                  placeholder="Find pirep"
                  className="form-input form"
                  value={pirepId}
                  onChange={handleChange}
                />
              </Box>
              <Button onClick={() => handleSearch()}>Go</Button>
            </Flex>
            <TableContainer>
              <Table>
                <Thead>
                  <Tr>
                    <Th></Th>
                    <Th>Departure</Th>
                    <Th>Arrival</Th>
                    <Th>Pilot</Th>
                    <Th>State</Th>
                    <Th>Date</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {pireps.data.map((entry) => (
                    <Tr key={entry.id}>
                      <Td onClick={() => loadPirep(entry)}>
                        <Link>View Details</Link>
                        {entry.state === 5 && <Tag ml={2}>Review</Tag>}
                      </Td>
                      <Td>
                        {entry.departure_airport_id}
                        <br />
                        <Text fontSize="xs">{entry.dep_airport.name}</Text>
                      </Td>
                      <Td>
                        {entry.destination_airport_id}
                        <br />
                        <Text fontSize="xs">{entry.arr_airport.name}</Text>
                      </Td>
                      <Td>
                        <Text>{entry.pilot.pilot_id}</Text>
                        <Text fontSize="xs">{entry.pilot.private_name}</Text>
                      </Td>
                      <Td>{renderPirepState(entry.state)}</Td>
                      <Td>
                        {format(new Date(entry.submitted_at), 'dd LLL yyyy')}
                      </Td>
                      <Td>
                        {entry.state === 5 && (
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => approvePirep(entry)}
                          >
                            <Icon as={Check} />
                          </Button>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            <Pagination pages={pireps} />
          </>
        )}
      </CardBody>
    </Card>
  )
}

Pireps.layout = (page) => (
  <AdminLayout children={page} title="Admin - Pireps" heading="Pireps" />
)

export default Pireps
