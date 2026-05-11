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

const SECTIONS = [
  { type: 'previous', label: 'Previous' },
  { type: 'hub', label: 'Nearest Hub' },
  { type: 'cargo', label: 'Cargo' },
  { type: 'tour', label: 'Next Tour' },
]

const Destination = ({ suggestions = [], ...props }) => {
  const [airportError, setAirportError] = useState(null)
  const [distance, setDistance] = useState(null)
  const [airport, setAirport] = useState('')
  const [icao, setIcao] = useState('')

  async function handleDestinationChange(e) {
    setIcao(e.target.value)
  }

  async function getAirport(overrideIcao = null) {
    setAirportError(null)
    setAirport(null)
    setDistance(null)
    const lookupIcao = overrideIcao ?? icao
    if (lookupIcao.length >= 3) {
      const response = await axios.get(
        `/api/airport/search/${lookupIcao}?user=1`
      )
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

  function handleSuggestionClick(suggestion) {
    setIcao(suggestion.identifier)
    getAirport(suggestion.identifier)
  }

  const sections = SECTIONS.map(({ type, label }) => ({
    label,
    items: suggestions.filter((s) => s.type === type),
  })).filter((s) => s.items.length > 0)

  return (
    <Box>
      <Card>
        <CardHeader pb={0}>
          <Heading size="md">Destination (ICAO)</Heading>
        </CardHeader>
        <CardBody>
          {sections.length > 0 && (
            <Box mb={3}>
              {sections.map((section) => (
                <Flex key={section.label} align="baseline" gap={2} mb={1}>
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    minW="80px"
                    flexShrink={0}
                  >
                    {section.label}
                  </Text>
                  <Flex gap={3} wrap="wrap">
                    {section.items.map((s) => (
                      <Button
                        key={s.identifier}
                        variant="link"
                        size="xs"
                        fontWeight="normal"
                        onClick={() => handleSuggestionClick(s)}
                        title={s.name}
                      >
                        {s.identifier}
                      </Button>
                    ))}
                  </Flex>
                </Flex>
              ))}
            </Box>
          )}
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
