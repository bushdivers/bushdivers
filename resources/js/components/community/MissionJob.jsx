import {
  Box,
  Card,
  CardBody,
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
import DOMPurify from 'dompurify'
import React from 'react'

const MissionJob = ({ mission, fleet }) => {
  return (
    <>
      <SimpleGrid columns={2} gap={4}>
        <Box>
          <Card>
            <CardBody>
              <Heading size="md">{mission.name}</Heading>
              <Box overflowY="auto" maxHeight="200px">
                <Box
                  my={2}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(mission.description),
                  }}
                ></Box>
              </Box>
              <Text my={2} fontSize="sm" as="i" color="red.500">
                Remember, you can only fly fleet aircraft. See current fleet
                status to the right
              </Text>
            </CardBody>
          </Card>
          <Card mt={2}>
            <CardBody>
              <Heading size="md">Mission Items</Heading>
              <Text as="i">
                You will find these as shared contracts in dispatch screen
              </Text>
              <Box overflowY="auto" maxHeight="500px">
                <TableContainer>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>Departure</Th>
                        <Th>Destination</Th>
                        <Th>Cargo</Th>
                        <Th>Remaining / Total Qty</Th>
                        <Th>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {mission.jobs.map((job) => (
                        <Tr key={job.id}>
                          <Td>{job.dep_airport_id}</Td>
                          <Td>{job.arr_airport_id}</Td>
                          <Td>{job.cargo}</Td>
                          <Td>
                            {job.cargo_type === 1
                              ? `${job.remaining_payload} / ${job.payload} lbs`
                              : `${job.remaining_pax} / ${job.pax}`}
                          </Td>
                          <Td>
                            {job.is_completed ? 'Completed' : 'Incomplete'}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            </CardBody>
          </Card>
        </Box>
        <Box>
          <Card>
            <CardBody>
              <Heading size="md">Fleet Status</Heading>
              <Box overflowY="auto" maxHeight="700px">
                <TableContainer>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>Type</Th>
                        <Th>Location</Th>
                        <Th>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {fleet &&
                        fleet.map((ac) => (
                          <Tr key={ac.id}>
                            <Td>{ac.fleet.type}</Td>
                            <Td>{ac.current_airport_id}</Td>
                            <Td>
                              {ac.state === 1 ? 'Available' : 'Not Available'}
                            </Td>
                          </Tr>
                        ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            </CardBody>
          </Card>
        </Box>
      </SimpleGrid>
    </>
  )
}

export default MissionJob
