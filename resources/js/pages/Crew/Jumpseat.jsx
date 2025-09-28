import {
  Box,
  Button,
  Card,
  Link as ChakraLink,
  Flex,
  FormControl,
  FormErrorMessage,
  GridItem,
  Heading,
  Icon,
  Input,
  SimpleGrid,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { router } from '@inertiajs/react'
import { Link } from '@inertiajs/react'
import axios from 'axios'
import { ArrowLeftRight } from 'lucide-react'
import React, { useState } from 'react'

import AppLayout from '../../components/layout/AppLayout'
import { displayNumber } from '../../helpers/number.helpers'

const Jumpseat = ({ user, balance }) => {
  const bg = useColorModeValue('gray.100', 'gray.500')
  const [airport, setAirport] = useState('')
  const [icao, setIcao] = useState('')
  const [transfer, setTransfer] = useState('')
  const [error, setError] = useState(null)
  const [distance, setDistance] = useState(null)
  const [price, setPrice] = useState(-1)
  const [isEdit, setIsEdit] = useState(false)

  const handleChange = async (e) => {
    setError(null)
    setAirport('')
    setDistance(null)
    setPrice(-1)
    setIcao(e.target.value)
    if (e.target.value.length >= 3) {
      const response = await axios.get(
        `/api/airport/search/${e.target.value}?user=1`
      )
      if (response.data.airport) {
        setIsEdit(false)
        setAirport(
          `${response.data.airport.identifier} - ${response.data.airport.name}`
        )
        setTransfer(response.data.airport.identifier)
        setError(null)
        const priceResp = await axios.get(
          `/api/jumpseat/cost/${user.location.identifier}/${response.data.airport.identifier}`
        )
        if (priceResp.status === 200) {
          setPrice(priceResp.data.cost)
          setDistance(priceResp.data.distance)
        } else {
          setError('Cannot calculate price')
        }
      } else {
        setError('No airport found')
      }
    }
  }

  const processJumpseat = () => {
    if (!transfer) {
      setError('Please specify an airport to transfer to')
      return
    }
    if (balance < price) {
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
          <Flex gap={6} justifyContent="center" alignItems="center">
            <Flex gap={3} alignItems="baseline">
              <ChakraLink
                color="orange.400"
                as={Link}
                href={`/airports/${user.location.identifier}`}
              >
                <Heading size="md">
                  {user.location.identifier} - {user.location.name}
                </Heading>
              </ChakraLink>
            </Flex>
            <Icon as={ArrowLeftRight} />
            <Flex gap={3} alignItems="center">
              {airport === '' || isEdit ? (
                <>
                  <FormControl isInvalid={error}>
                    <Input
                      w={40}
                      value={icao}
                      type="text"
                      id="dep"
                      placeholder="Enter ICAO"
                      onChange={handleChange}
                    />
                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                  </FormControl>
                </>
              ) : (
                <Heading
                  py={1}
                  px={2}
                  color="blue.500"
                  textDecoration="underline"
                  textDecorationStyle="dashed"
                  _hover={{
                    bg: bg,
                    borderRadius: 'md',
                  }}
                  onClick={() => setIsEdit(true)}
                  size="md"
                >
                  {airport}
                </Heading>
              )}
            </Flex>
          </Flex>
          {distance && price >= 0 && (
            <Box mt={2}>
              <Flex mt={2} justifyContent="center" alignItems="center" gap={3}>
                <Text>
                  {user.location.identifier} - {user.location.name}
                </Text>
                <Text>to</Text>
                <Text>{airport}</Text>
              </Flex>
              <Flex justifyContent="center" mt={2}>
                <Heading size="lg">{distance} nm</Heading>
              </Flex>
            </Box>
          )}
        </Card>
      </GridItem>
      <GridItem>
        <Card p={4}>
          <Heading mb={2} size="sm">
            Jumpseat Cost
          </Heading>
          {distance && price >= 0 ? (
            <>
              <Flex mt={2} justifyContent="end">
                <Heading size="lg">${displayNumber(price, true)}</Heading>
              </Flex>
              <Flex mt={2} justifyContent="end">
                <Button mt={2} onClick={() => processJumpseat()}>
                  Purchase Ticket
                </Button>
              </Flex>
            </>
          ) : (
            <Text>Please enter a destination</Text>
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
