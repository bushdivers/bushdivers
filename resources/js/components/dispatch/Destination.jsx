import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Input,
  Text,
} from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'

const Destination = (props) => {
  const [airportError, setAirportError] = useState(null)
  const [distance, setDistance] = useState(null)
  const [airport, setAirport] = useState('')
  const [icao, setIcao] = useState('')

  async function handleDestinationChange(e) {
    setIcao(e.target.value)
  }

  async function getAirport() {
    setAirportError(null)
    setAirport(null)
    setDistance(null)
    if (icao.length >= 3) {
      const response = await axios.get(`/api/airport/search/${icao}`)
      if (response.data.airport) {
        props.updateDestinationValue(response.data.airport.identifier)
        setAirportError(null)
        const disResp = await axios.get(
          `/api/flights/distance/${props.currentAirport}/${response.data.airport.identifier}`
        )
        if (disResp.status === 200) {
          setAirport(
            `${response.data.airport.identifier} - ${response.data.airport.name}`
          )
          setDistance(disResp.data.distance)
        } else {
          setAirportError('Cannot calculate distance')
        }
      } else {
        props.updateDestinationValue('')
        setAirportError('No airport found')
      }
    }
  }

  return (
    <Box>
      <Card>
        <CardHeader>
          <Heading size="md">Destination (ICAO)</Heading>
        </CardHeader>
        <CardBody>
          <Flex gap={1}>
            <Input
              id="icao"
              type="text"
              value={icao}
              onChange={handleDestinationChange}
            />
            <Button colorScheme="gray" onClick={() => getAirport()}>
              Set
            </Button>
          </Flex>
          <Flex alignItems="center" gap={2}>
            {airport && (
              <Text color="green.300" size="sm" mt={1}>
                {airport}
              </Text>
            )}
            {distance && (
              <Text color="green.300" size="sm" mt={1}>
                {distance.toLocaleString(navigator.language)}nm
              </Text>
            )}
          </Flex>
          {airportError && (
            <Text size="sm" color="red.300" mt={1}>
              {airportError}
            </Text>
          )}
        </CardBody>
      </Card>
    </Box>
  )
}

export default Destination
