import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Input,
  Text,
} from '@chakra-ui/react'
import React from 'react'

const Fuel = (props) => {
  return (
    <Box mt={2}>
      <Card>
        <CardHeader>
          <Heading size="md">Fuel</Heading>
        </CardHeader>
        <CardBody>
          {props.selectedAircraft && (
            <Box>
              <Text>
                Useable Fuel (gal): {props.selectedAircraft.fleet.fuel_capacity}
              </Text>
              <Box>
                <Text>Current Fuel (gal):</Text>
                <Input
                  id="fuel"
                  type="text"
                  value={props.fuel}
                  onChange={props.handleUpdateFuel}
                  error={props.error}
                />
                <Flex alignItems="center" gap={2}>
                  <Text color="green.500">
                    {parseFloat(props.fuelWeight).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}{' '}
                    lbs
                  </Text>{' '}
                  <Text>(estimated)</Text>
                </Flex>
              </Box>
            </Box>
          )}
        </CardBody>
      </Card>
    </Box>
  )
}

export default Fuel
