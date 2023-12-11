import React from 'react'
import { Box, Card, CardHeader, CardBody, Input, Text, Heading, Flex } from '@chakra-ui/react'

const Fuel = (props) => {
  // const [fuelWeight, setFuelWeight] = useState(null)
  // useEffect(() => {
  //   if (props.selectedAircraft) {
  //     const weight = props.selectedAircraft.fleet.fuel_type_id === 1 ? props.fuel * 5.99 : props.fuel * 6.79
  //     setFuelWeight(weight)
  //   }
  // }, [props.fuel])

  return (
    <Box mt={2}>
      <Card>
        <CardHeader>
          <Heading size="md">Fuel</Heading>
        </CardHeader>
        <CardBody>
          {props.selectedAircraft && (
            <Box>
              <Text>Useable Fuel (gal): {props.selectedAircraft.fleet.fuel_capacity}</Text>
              <Box>
                <Text>Current Fuel (gal):</Text>
                  <Input id="fuel" type="text" value={props.fuel} onChange={props.handleUpdateFuel} error={props.error} />
                  <Flex alignItems="center" gap={2}><Text color="green.500">{parseFloat(props.fuelWeight).toLocaleString(undefined, { maximumFractionDigits: 2 })} lbs</Text> <Text>(estimated)</Text></Flex>
              </Box>
            </Box>
          )}
        </CardBody>
      </Card>
    </Box>
  )
}

export default Fuel
