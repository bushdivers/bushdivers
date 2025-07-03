import { Box, Card, CardBody, Flex, Heading, Text } from '@chakra-ui/react'
import { Package } from 'lucide-react'
import React from 'react'

const DispatchDetails = ({ dispatchDetails }) => {
  console.log(dispatchDetails)
  return (
    <>
      <Heading mb={1} size="sm">
        Contract Brief
      </Heading>
      <Text>{dispatchDetails.contract.summaryDescription}</Text>
      <Text mt={2}>
        Departure: {dispatchDetails.departureAirport.identifier} -{' '}
        {dispatchDetails.departureAirport.name}
      </Text>
      <Text mt={2}>
        Destination: {dispatchDetails.destinationAirport.identifier} -{' '}
        {dispatchDetails.destinationAirport.name}
      </Text>
      <Heading size="sm" mt={2}>
        <Flex alignItems="center" gap={2}>
          <Package /> Cargo Manifest
        </Flex>
      </Heading>
      <Box mt={1}>
        {dispatchDetails &&
          dispatchDetails.contract.cargoDetails.map((cargo) => (
            <Card
              my={1}
              p={2}
              key={cargo.cargoDescription + '-' + cargo.cargoQty}
            >
              <Flex justify="space-between">
                <Flex direction="column">
                  <Text fontSize="md">{cargo.cargoDescription}</Text>
                  <Text fontSize="xs">Qty: {cargo.cargoQty}</Text>
                </Flex>
                <Text fontSize="md">{cargo.cargoWeight} lbs</Text>
              </Flex>
            </Card>
          ))}
      </Box>
      <Card mt={1}>
        <CardBody bgColor="gray.100">
          <Flex justify="space-between">
            <Text fontSize="md">Total Cargo Weight</Text>
            <Text fontSize="md">
              {dispatchDetails.contract.totalCargoWeight} lbs
            </Text>
          </Flex>
        </CardBody>
      </Card>
    </>
  )
}

export default DispatchDetails
