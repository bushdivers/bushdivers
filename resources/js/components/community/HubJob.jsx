import {
  Box,
  Card,
  CardBody,
  Link as ChakraLink,
  Flex,
  Heading,
  Icon,
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
import { Link as InertiaLink } from '@inertiajs/react'
import { CheckCircle } from 'lucide-react'
import React from 'react'

const HubJob = ({ hub }) => {
  return (
    <Card key={hub.id}>
      <CardBody>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading maxHeight="50px" size="md">
            <Flex gap={2}>
              <Box>{hub.name}</Box>
              <Box>{hub.identifier}</Box>
            </Flex>
          </Heading>
          <Flex alignItems="center" gap={2}>
            <Flex>
              <Tag>Hub</Tag>
            </Flex>
            <Text fontSize="xs">{hub.country}</Text>
            <Image rounded="sm" h={5} src={hub.flag} />
          </Flex>
        </Flex>
        <TableContainer mt={2}>
          <Heading size="md">Contracts</Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Cargo</Th>
                <Th>Departure</Th>
                <Th>Current</Th>
                <Th>Completed</Th>
              </Tr>
            </Thead>
            <Tbody>
              {hub.hub_contracts.map((contract) => (
                <Tr key={contract.id}>
                  <Td>
                    {contract.cargo_qty} x {contract.cargo}
                  </Td>
                  <Td>
                    <ChakraLink
                      href={`/airports/${contract.dep_airport_id}`}
                      as={InertiaLink}
                      color="orange.500"
                    >
                      {contract.dep_airport_id}
                    </ChakraLink>
                  </Td>
                  <Td>
                    <ChakraLink
                      href={`/airports/${contract.current_airport_id}`}
                      as={InertiaLink}
                      color="orange.500"
                    >
                      {contract.current_airport_id}
                    </ChakraLink>
                  </Td>
                  <Td>
                    {contract.is_completed ? (
                      <Icon color="green.500" as={CheckCircle} />
                    ) : (
                      ''
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <TableContainer mt={2}>
          <Heading size="md">Ferries</Heading>
          <Table variant="simple">
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
                    {ferry.registration} {ferry.fleet.type} - {ferry.fleet.name}
                  </Td>
                  <Td>
                    <ChakraLink
                      href={`/airports/${ferry.location.identifier}`}
                      as={InertiaLink}
                      color="orange.500"
                    >
                      {ferry.location.identifier}
                    </ChakraLink>
                  </Td>
                  <Td>
                    {ferry.ferry_user_id
                      ? `BDV${ferry.ferry_user_id}`
                      : 'Available'}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  )
}

export default HubJob
