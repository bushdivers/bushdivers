import {
  Box,
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
        <CardHeader>
          <Heading size="md">Dispatch Summary</Heading>
        </CardHeader>
        <CardBody>
          <Heading size="sm">
            Planned Destination:{' '}
            {props.pirep ? (
              <Text>{props.pirep.destination_airport_id}</Text>
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
                  {props.selectedAircraft.fleet.name} (
                  {props.selectedAircraft.fleet.type}){' '}
                  {props.pirep && props.pirep.is_rental ? (
                    <Tag>Rental</Tag>
                  ) : (
                    <></>
                  )}
                </Text>
              </Flex>
            )}
          </Box>
          <div className="mt-2">
            <Heading size="sm">Payload:</Heading>
            <Box my={1}>
              {props.deadHead ? (
                <Text color="red.300">Deadhead flight - no cargo</Text>
              ) : (
                <Box></Box>
              )}
            </Box>
            <Box my={1}>
              <Text>Pilot & payload weight (inc. fuel):{' '}</Text>
              {props.selectedAircraft && (
                <Text
                  color={
                    props.selectedAircraft &&
                    props.personWeight +
                      props.fuelWeight +
                      props.cargoWeight >
                      props.selectedAircraft.fleet.mtow -
                        props.selectedAircraft.fleet.zfw
                      ? 'red.300'
                      : ''
                  }
                >
                  {(
                    props.personWeight +
                    props.fuelWeight +
                    props.cargoWeight
                  ).toFixed(2)}{' '}
                  lbs /{' '}
                  {props.selectedAircraft.fleet.mtow -
                    props.selectedAircraft.fleet.zfw}{' '}
                  lbs
                </Text>
              )}
            </Box>
            <Box my={1}>
              <Text>Cargo payload:{' '}</Text>
              {props.selectedAircraft && (
                <Text
                  color={
                    props.selectedAircraft &&
                    props.cargoWeight >
                      props.selectedAircraft.fleet.cargo_capacity
                      ? 'red.300'
                      : ''
                  }
                >
                  {props.cargoWeight} lbs /{' '}
                  {props.selectedAircraft.fleet.cargo_capacity} lbs
                </Text>
              )}
            </Box>
            <Box my={1}>
              <Text>Passenger count:{' '}</Text>
              {props.selectedAircraft && (
                <Text
                  color={
                    props.selectedAircraft &&
                    props.passengerCount >
                      props.selectedAircraft.fleet.pax_capacity
                      ? 'red.300'
                      : ''
                  }
                >
                  {props.passengerCount} /{' '}
                  {props.selectedAircraft.fleet.pax_capacity}
                </Text>
              )}
            </Box>
            <Box my={1}>
              <Text mt={1}>Fuel:{' '}</Text>
              {props.pirep ? (
                <Text>
                  {props.pirep.planned_fuel} gal |{' '}
                  {parseFloat(props.fuelWeight).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}{' '}
                  lbs
                </Text>
              ) : (
                <Text>
                  {props.fuel} gal |{' '}
                  {parseFloat(props.fuelWeight).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}{' '}
                  lbs
                </Text>
              )}
            </Box>
          </div>
        </CardBody>
      </Card>
    </Box>
  )
}

export default DispatchSummary
