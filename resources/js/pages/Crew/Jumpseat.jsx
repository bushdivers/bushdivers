import {
  Badge,
  Button,
  Card,
  Link as ChakraLink,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  GridItem,
  Heading,
  Icon,
  Input,
  SimpleGrid,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react'
import { router } from '@inertiajs/react'
import { Link } from '@inertiajs/react'
import axios from 'axios'
import { ArrowUp } from 'lucide-react'
import React, { useState } from 'react'

import AppLayout from '../../components/layout/AppLayout'
import { getBearing } from '../../helpers/geo.helpers'
import { displayNumber } from '../../helpers/number.helpers'

const Jumpseat = ({ user, hubs }) => {
  const bg = useColorModeValue('gray.100', 'gray.500')
  const selectedBg = useColorModeValue('orange.50', 'orange.900')
  const rowHoverBg = useColorModeValue('gray.50', 'gray.600')
  const textColor = useColorModeValue('gray.500', 'gray.400')

  const [airport, setAirport] = useState('')
  const [icao, setIcao] = useState('')
  const [transfer, setTransfer] = useState('')
  const [error, setError] = useState(null)
  const [distance, setDistance] = useState(null)
  const [price, setPrice] = useState(-1)
  const [isEdit, setIsEdit] = useState(false)

  const sortedHubs = [...(hubs ?? [])].sort((a, b) => a.distance - b.distance)

  const fetchCost = async (toIcao, airportLabel) => {
    setError(null)
    setDistance(null)
    setPrice(-1)
    setAirport(airportLabel)
    setTransfer(toIcao)
    setIsEdit(false)
    const priceResp = await axios.get(
      `/api/jumpseat/cost/${user.location.identifier}/${toIcao}`
    )
    if (priceResp.status === 200) {
      setPrice(priceResp.data.cost)
      setDistance(priceResp.data.distance)
    } else {
      setError('Cannot calculate price')
    }
  }

  const handleHubClick = (hub) => {
    if (transfer === hub.identifier) return
    setIcao('')
    fetchCost(hub.identifier, `${hub.identifier} — ${hub.name}`)
  }

  const handleChange = async (e) => {
    setError(null)
    setAirport('')
    setDistance(null)
    setPrice(-1)
    setTransfer('')
    setIcao(e.target.value)
    if (e.target.value.length >= 3) {
      if (
        e.target.value.toUpperCase() === user.location.identifier.toUpperCase()
      ) {
        setError('You cannot jumpseat to your current location')
      } else {
        const response = await axios.get(
          `/api/airport/search/${e.target.value}?user=1`
        )
        if (response.data.airport) {
          const found = response.data.airport
          fetchCost(found.identifier, `${found.identifier} — ${found.name}`)
        } else {
          setError('No airport found')
        }
      }
    }
  }

  const processJumpseat = () => {
    if (!transfer) {
      setError('Please specify an airport to transfer to')
      return
    }
    if (user.balance < price) {
      setError('You do not have sufficient funds to transfer here')
      return
    }
    router.post('/jumpseat', {
      cost: price,
      icao: transfer,
    })
    setAirport('')
    setIcao('')
    setTransfer('')
    setPrice(-1)
    setDistance(null)
  }

  return (
    <SimpleGrid columns={4} gap={2}>
      <GridItem colSpan={3}>
        <Card p={4}>
          <Flex mb={4} alignItems="center" gap={2}>
            <Text fontSize="sm" fontWeight="medium">
              Current Location
            </Text>
            <ChakraLink
              color="orange.400"
              as={Link}
              href={`/airports/${user.location.identifier}`}
              fontWeight="bold"
            >
              {user.location.identifier} — {user.location.name}
            </ChakraLink>
          </Flex>

          <Heading size="xs" textTransform="uppercase" mb={2}>
            Jumpseat Destination
          </Heading>
          <Flex alignItems="center" gap={3}>
            {airport === '' || isEdit ? (
              <FormControl isInvalid={!!error} maxW="xs">
                <Input
                  value={icao}
                  type="text"
                  id="dep"
                  placeholder="Enter ICAO"
                  onChange={handleChange}
                />
                {error && <FormErrorMessage>{error}</FormErrorMessage>}
              </FormControl>
            ) : (
              <Text
                py={1}
                px={2}
                color="blue.500"
                textDecoration="underline"
                textDecorationStyle="dashed"
                cursor="pointer"
                borderRadius="md"
                _hover={{ bg }}
                onClick={() => {
                  setIsEdit(true)
                  setTransfer('')
                }}
              >
                {airport}
              </Text>
            )}
          </Flex>

          <Divider my={4} />

          <Heading size="xs" textTransform="uppercase" mb={2}>
            Hub Destinations
          </Heading>
          <Text fontSize="sm" color={textColor} mb={2}>
            {user.location.is_hub
              ? 'Jumpseats to other hubs are free!'
              : 'Jumpseats between hubs are free! Jump to a nearby hub and then transfer to your final destination to reduce ticket price.'}
          </Text>
          <Table size="sm" variant="simple">
            <Thead>
              <Tr>
                <Th>Hub</Th>
                <Th>Bearing</Th>
                <Th isNumeric>Distance</Th>
              </Tr>
            </Thead>
            <Tbody>
              {sortedHubs.map((hub) => {
                const bear = getBearing(
                  user.location.lat,
                  user.location.lon,
                  hub.lat,
                  hub.lon
                )
                const isSelected = transfer === hub.identifier
                return (
                  <Tr
                    key={hub.identifier}
                    onClick={() => handleHubClick(hub)}
                    cursor="pointer"
                    bg={isSelected ? selectedBg : undefined}
                    _hover={{ bg: isSelected ? selectedBg : rowHoverBg }}
                  >
                    <Td fontWeight={isSelected ? 'bold' : 'normal'}>
                      {hub.identifier} — {hub.name}
                    </Td>
                    <Td>
                      <Flex alignItems="center" gap={1}>
                        <Icon
                          as={ArrowUp}
                          style={{ transform: `rotate(${bear}deg)` }}
                          boxSize={3}
                        />
                        <Text fontSize="xs">
                          {String(bear).padStart(3, '0')}°
                        </Text>
                      </Flex>
                    </Td>
                    <Td isNumeric>{Math.round(hub.distance)} nm</Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </Card>
      </GridItem>

      <GridItem>
        <Card p={4}>
          <Heading mb={3} size="sm">
            Jumpseat
          </Heading>
          {transfer ? (
            <>
              <Text
                fontSize="xs"
                color={textColor}
                textTransform="uppercase"
                mb={1}
              >
                Destination
              </Text>
              <Text fontWeight="bold" mb={4}>
                {airport}
              </Text>
              {distance > 0 && price >= 0 ? (
                <>
                  <Text
                    fontSize="xs"
                    color={textColor}
                    textTransform="uppercase"
                  >
                    Distance
                  </Text>
                  <Text fontWeight="bold" mb={4}>
                    {Math.round(distance)} nm
                  </Text>
                  <Text
                    fontSize="xs"
                    color={textColor}
                    textTransform="uppercase"
                  >
                    Cost
                  </Text>
                  <Heading size="lg" mb={4}>
                    {price === 0 ? (
                      <Badge colorScheme="green" fontSize="md" px={2} py={1}>
                        Free
                      </Badge>
                    ) : (
                      `$${displayNumber(price, true, true)}`
                    )}
                  </Heading>
                  <Button width="full" onClick={() => processJumpseat()}>
                    Purchase Ticket
                  </Button>
                </>
              ) : (
                <Text color={textColor} fontSize="sm">
                  Calculating…
                </Text>
              )}
            </>
          ) : (
            <Text color={textColor} fontSize="sm">
              Select a hub or search for a destination
            </Text>
          )}
        </Card>
      </GridItem>
    </SimpleGrid>
  )
}

Jumpseat.layout = (page) => (
  <AppLayout title="Jumpseat" children={page} heading="Jumpseat" />
)

export default Jumpseat
