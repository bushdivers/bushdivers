import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Icon,
  Tag,
  Text,
} from '@chakra-ui/react'
import { Plane } from 'lucide-react'
import React from 'react'

const DispatchSummary = (props) => {
  return (
    <Box>
      <Card title="Dispatch Summary">
        <CardHeader pb={0}>
          <Flex justifyContent="space-between" alignItems="center">
            <Heading size="md">Dispatch Summary</Heading>
            {!props.isActive && (
              <Button onClick={() => props.handleSubmitDispatch()}>
                File Dispatch
              </Button>
            )}
          </Flex>
        </CardHeader>
        <CardBody>
          <Heading size="sm">
            Planned Destination:{' '}
            {props.pirep ? (
              <Text>{props.pirep.arr_airport.identifier}</Text>
            ) : (
              <Text>{props.destination}</Text>
            )}
          </Heading>
          <Box mt={2}>
            {props.selectedAircraft && (
              <Flex justifyContent="start" alignItems="center">
                <Icon mr={2} color="white" as={Plane} />
                <Text>
                  {props.selectedAircraft.registration} -{' '}
                  {props.selectedAircraft.fleet.manufacturer}{' '}
                  {props.selectedAircraft.fleet.name}{' '}
                  {props.selectedAircraft.fleet.type}{' '}
                  {props.pirep && props.pirep.is_rental ? (
                    <Tag>Rental</Tag>
                  ) : (
                    <></>
                  )}
                </Text>
              </Flex>
            )}
          </Box>
          <Box mt={2}>
            <Heading size="sm">Payload:</Heading>
            <Box my={1}>
              {props.deadHead ? (
                <Text color="red.300">Deadhead flight - no cargo</Text>
              ) : (
                <Box></Box>
              )}
            </Box>
            <Flex justifyContent="space-between" alignItems="baseline" my={1}>
              <Text fontSize="sm" color="gray.400">
                Pilot & payload (inc. fuel)
              </Text>
              {props.selectedAircraft && (
                <Text
                  fontSize="sm"
                  color={
                    props.selectedAircraft &&
                    props.personWeight + props.fuelWeight + props.cargoWeight >
                      (props.variant?.mtow ?? 0) - (props.variant?.zfw ?? 0)
                      ? 'red.300'
                      : ''
                  }
                >
                  {(
                    props.personWeight +
                    props.fuelWeight +
                    props.cargoWeight
                  ).toFixed(0)}{' '}
                  / {(props.variant?.mtow ?? 0) - (props.variant?.zfw ?? 0)} lbs
                </Text>
              )}
            </Flex>
            <Flex justifyContent="space-between" alignItems="baseline" my={1}>
              <Text fontSize="sm" color="gray.400">
                Cargo payload
              </Text>
              {props.selectedAircraft && (
                <Text
                  fontSize="sm"
                  color={
                    props.selectedAircraft &&
                    props.cargoWeight > (props.variant?.cargo_capacity ?? 0)
                      ? 'red.300'
                      : ''
                  }
                >
                  {props.cargoWeight} / {props.variant?.cargo_capacity ?? 0} lbs
                </Text>
              )}
            </Flex>
            <Flex justifyContent="space-between" alignItems="baseline" my={1}>
              <Text fontSize="sm" color="gray.400">
                Passengers
              </Text>
              {props.selectedAircraft && (
                <Text
                  fontSize="sm"
                  color={
                    props.selectedAircraft &&
                    props.passengerCount > (props.variant?.pax_capacity ?? 0)
                      ? 'red.300'
                      : ''
                  }
                >
                  {props.passengerCount} / {props.variant?.pax_capacity ?? 0}
                </Text>
              )}
            </Flex>
            <Flex justifyContent="space-between" alignItems="baseline" my={1}>
              <Text fontSize="sm" color="gray.400">
                Fuel
              </Text>
              {props.pirep ? (
                <Text fontSize="sm">
                  {props.pirep.planned_fuel} gal |{' '}
                  {parseFloat(props.fuelWeight).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}{' '}
                  lbs
                </Text>
              ) : (
                <Text fontSize="sm">
                  {props.fuel} gal |{' '}
                  {parseFloat(props.fuelWeight).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}{' '}
                  lbs
                </Text>
              )}
            </Flex>
          </Box>
        </CardBody>
      </Card>
    </Box>
  )
}

export default DispatchSummary
