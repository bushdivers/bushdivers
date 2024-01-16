import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'
import { router } from '@inertiajs/react'
import axios from 'axios'
import React, { useState } from 'react'

import AppLayout from '../../components/layout/AppLayout'

const Jumpseat = ({ user, spent, balance }) => {
  const [airport, setAirport] = useState('')
  const [icao, setIcao] = useState('')
  const [transfer, setTransfer] = useState('')
  const [error, setError] = useState(null)
  const [distance, setDistance] = useState(null)
  const [price, setPrice] = useState(-1)

  const handleChange = async (e) => {
    setError(null)
    setAirport(null)
    setIcao(e.target.value)
    if (e.target.value.length >= 3) {
      const response = await axios.get(`/api/airport/search/${e.target.value}`)
      if (response.data.airport) {
        setAirport(
          `${response.data.airport.identifier} - ${response.data.airport.name}`
        )
        setTransfer(response.data.airport.identifier)
        setError(null)
        const priceResp = await axios.get(
          `/api/jumpseat/cost/${user.current_airport_id}/${response.data.airport.identifier}`
        )
        console.log(priceResp)
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
    <Box>
      <Flex direction="column">
        <SimpleGrid mt={4} columns={3} spacing={10}>
          <Box>
            <Card>
              <CardBody>
                <SimpleGrid columns={2} spacing={10}>
                  <Box>
                    <Heading size="sm">Current Location:</Heading>
                    <Text my={1}>
                      {user.location.identifier} - {user.location.name}
                    </Text>
                    <FormControl my={2}>
                      <FormLabel>
                        <Text>Destination ICAO</Text>
                      </FormLabel>
                      <Input
                        value={icao}
                        type="text"
                        id="dep"
                        placeholder="Enter ICAO"
                        onChange={handleChange}
                      />
                      {airport && <FormHelperText>{airport}</FormHelperText>}
                      {error && (
                        <FormHelperText color="red.300">{error}</FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                  <Box>
                    <Flex
                      textAlign="center"
                      direction="column"
                      alignItems="center"
                      gap={4}
                    >
                      <Box>
                        {distance && (
                          <Box>
                            <Heading size="sm">Distance</Heading>
                            <Text>{distance.toLocaleString()} nm</Text>
                          </Box>
                        )}
                      </Box>
                      <Box>
                        {price >= 0 ? (
                          <Box>
                            <Heading size="sm">Price</Heading>
                            <Text>${price.toLocaleString()}</Text>
                          </Box>
                        ) : (
                          <></>
                        )}
                      </Box>
                    </Flex>
                  </Box>
                </SimpleGrid>
              </CardBody>
            </Card>
            <Flex justifyContent="end">
              <Button mt={2} onClick={() => processJumpseat()}>
                Purchase Ticket
              </Button>
            </Flex>
          </Box>
          <Box>
            <Card mb={2}>
              <CardHeader>
                <Heading size="sm">Current Balance</Heading>
              </CardHeader>
              <CardBody>
                <Text fontSize="lg">
                  ${parseFloat(balance).toLocaleString()}
                </Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <Heading size="sm">Spent on Jumpseat</Heading>
              </CardHeader>
              <CardBody>
                <Text fontSize="lg">${parseFloat(spent).toLocaleString()}</Text>
              </CardBody>
            </Card>
          </Box>
        </SimpleGrid>
      </Flex>
    </Box>
  )
}

Jumpseat.layout = (page) => (
  <AppLayout title="Jumpseat" children={page} heading="Jumpseat" />
)

export default Jumpseat
