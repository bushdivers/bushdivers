import {
  Box,
  Card,
  CardBody,
  Flex,
  Heading,
  Image,
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
import DOMPurify from 'dompurify'
import React from 'react'

import AirportLabel from '../airport/AirportLabel.jsx'

const CommunityJob = ({ hub, mission }) => {
  if (hub || mission) {
    return (
      <Card key={hub.id}>
        <CardBody>
          <Flex justifyContent="space-between" alignItems="center" mb={4}>
            <Heading maxHeight="50px" size="md">
              {mission.name}
            </Heading>
            <Flex alignItems="center" gap={2}>
              <Tag>Hub</Tag>
              <Text fontSize="xs">{hub.country}</Text>
              <Image rounded="sm" h={5} src={hub.flag} />
            </Flex>
          </Flex>

          <Box overflowY="auto" maxHeight="150px" mb={4}>
            <Box
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(mission.description),
              }}
              fontSize="sm"
            />
          </Box>

          <Box mb={4}>
            {!mission.allow_private ? (
              <Text fontSize="sm" as="i" color="red.500">
                Only fleet aircraft may be used for this mission.
              </Text>
            ) : (
              <Text fontSize="sm" as="i" color="green.500">
                Private and rental aircraft are permitted.
              </Text>
            )}
          </Box>

          <Box>
            <Heading size="md" mb={1}>
              {hub ? 'Hub Items' : 'Mission Items'}
            </Heading>
            <Text as="i" fontSize="xs" mb={3}>
              You will find these as shared contracts in dispatch screen
            </Text>
            <TableContainer>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Departure</Th>
                    <Th>Destination</Th>
                    <Th>Cargo</Th>
                    <Th>Remaining / Total</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {mission.jobs?.map((job) => (
                    <Tr key={job.id}>
                      <Td>
                        {job.departure_airport ? (
                          <AirportLabel airport={job.departure_airport} />
                        ) : (
                          job.dep_airport_id
                        )}
                      </Td>
                      <Td>
                        {job.arrival_airport ? (
                          <AirportLabel airport={job.arrival_airport} />
                        ) : (
                          job.arr_airport_id
                        )}
                      </Td>
                      <Td>{job.cargo}</Td>
                      <Td>
                        {job.cargo_type === 1
                          ? `${job.remaining_payload} / ${job.payload} lbs`
                          : `${job.remaining_pax} / ${job.pax}`}
                      </Td>
                      <Td>{job.is_completed ? 'Completed' : 'Incomplete'}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </CardBody>
        <CardBody>
          <Box>
            <Heading size="md" mb={3}>
              Ferries
            </Heading>
            <TableContainer>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Aircraft</Th>
                    <Th>Current Location</Th>
                    <Th>Pilot</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {hub.ferry_flights.map((ferry) => (
                    <Tr key={ferry.id}>
                      <Td>
                        {ferry.registration} {ferry.fleet.type} -{' '}
                        {ferry.fleet.name}
                      </Td>
                      <Td>
                        {ferry.location ? (
                          <AirportLabel airport={ferry.location} />
                        ) : null}
                      </Td>
                      <Td>
                        {ferry.ferry_user_id
                          ? `BDV${ferry.ferry_user_id
                              .toString()
                              .padStart(4, '0')}`
                          : 'Available'}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardBody>No current jobs available</CardBody>
    </Card>
  )
}

export default CommunityJob
