import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Select,
  Text,
} from '@chakra-ui/react'
import { usePage } from '@inertiajs/react'
import axios from 'axios'
import React, { useState } from 'react'

import { displayNumber } from '../../helpers/number.helpers.js'

const NewPurchase = ({
  aircraft,
  hub,
  handleHubChange,
  hubError,
  reg,
  handleRegChange,
  regError,
  updateDelivery,
  purchase,
  buyer,
  hubs,
}) => {
  const { errors } = usePage().props
  const [deliver, setDeliver] = useState(false)
  const [error, setError] = useState(null)
  const [airport, setAirport] = useState(null)
  const [icao, setIcao] = useState('')
  const [price, setPrice] = useState(0.0)
  const [basePrice] = useState(aircraft.new_price)

  const handleDeliveryChange = (e) => {
    setDeliver(e.target.checked)
    setError(null)
    setAirport(null)
    setIcao('')
    if (!e.target.checked) setPrice(0.0)
    updateDelivery(aircraft.hq)
  }

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
        updateDelivery(response.data.airport.identifier)
        setError(null)
        const priceResp = await axios.get(
          `/api/jumpseat/cost/${aircraft.hq}/${response.data.airport.identifier}`
        )
        if (priceResp.status === 200) {
          const p = priceResp.data.cost * 10
          setPrice(parseFloat(p))
          // setDistance(priceResp.data.distance)
        } else {
          setError('Cannot calculate price')
        }
      } else {
        setError('No airport found')
      }
    }
  }

  return (
    <Box>
      <Heading size="md">
        Purchase New - {aircraft.manufacturer} {aircraft.name}{' '}
        {buyer === 'admin' && ' - For the VA'}
      </Heading>
      <Card mt={2}>
        <CardHeader>
          <Heading size="sm">Invoice</Heading>
        </CardHeader>
        <CardBody>
          <Box w="200px">
            <Checkbox
              id="delivery"
              checked={deliver}
              onChange={handleDeliveryChange}
            >
              Deliver?
            </Checkbox>
            {deliver && (
              <FormControl>
                <FormLabel>Deliver to ICAO</FormLabel>
                <Input
                  id="dep"
                  placeholder="Deliver to ICAO"
                  type="text"
                  value={icao}
                  onChange={handleChange}
                />
              </FormControl>
            )}
            {airport && (
              <Text fontSize="sm" mt={1}>
                {airport}
              </Text>
            )}
            {error && (
              <Text fontSize="sm" mt={1} color="red.500">
                {error}
              </Text>
            )}
          </Box>
          {!deliver && <Text mt={2}>Deliver to {aircraft.hq}</Text>}
          {deliver && airport && (
            <Text mt={2}>
              Deliver from: {aircraft.hq} to: {airport}
            </Text>
          )}
          <Box width="200px">
            {buyer === 'admin' ? (
              <FormControl isInvalid={hubError}>
                <FormLabel htmlFor="hub">Hub location</FormLabel>
                <Select id="hub" value={hub} onChange={handleHubChange}>
                  <option>Please select hub</option>
                  {hubs.map((hub) => (
                    <option key={hub.identifier} value={hub.identifier}>
                      {hub.identifier}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{hubError}</FormErrorMessage>
              </FormControl>
            ) : (
              <FormControl isInvalid={hubError}>
                <FormLabel>Home Hub (ICAO)</FormLabel>
                <Input
                  id="hub"
                  type="text"
                  value={hub}
                  onChange={handleHubChange}
                />
                <FormErrorMessage>{hubError}</FormErrorMessage>
              </FormControl>
            )}
            <FormControl isInvalid={regError}>
              <FormLabel>Registration</FormLabel>
              <Input
                id="reg"
                type="text"
                value={reg}
                onChange={handleRegChange}
                placeholder="N1234A"
              />
              <FormErrorMessage>{regError}</FormErrorMessage>
            </FormControl>
          </Box>

          <Box my={2}>
            <Text>Base Price</Text>
            <Text>${displayNumber(basePrice, true)}</Text>
            <Text>Delivery</Text>
            <Text>${displayNumber(price, true)}</Text>
            <Text>Total</Text>
            <Text>
              ${displayNumber(parseFloat(basePrice) + parseFloat(price), true)}
            </Text>
          </Box>
          <Button
            onClick={() => purchase(parseFloat(basePrice) + parseFloat(price))}
          >
            Purchase
          </Button>
          {errors.reg && (
            <Text my={2} fontSize="sm" color="red.500">
              The aircraft registration already exists
            </Text>
          )}
        </CardBody>
      </Card>
    </Box>
  )
}

export default NewPurchase
