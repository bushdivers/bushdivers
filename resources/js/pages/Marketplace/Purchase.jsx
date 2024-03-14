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
  Text,
} from '@chakra-ui/react'
import { router, usePage } from '@inertiajs/react'
import axios from 'axios'
import React, { useState } from 'react'

import AppLayout from '../../components/layout/AppLayout'
import { displayNumber } from '../../helpers/number.helpers.js'

const Purchase = ({ aircraft, purchaseType }) => {
  const { auth, errors } = usePage().props
  const [deliver, setDeliver] = useState(false)
  const [price, setPrice] = useState(0.0)
  const [error, setError] = useState(null)
  const [airport, setAirport] = useState(null)
  const [icao, setIcao] = useState('')
  const [deliveryLocation, setDeliveryLocation] = useState(aircraft.hq)
  // const [distance, setDistance] = useState(null)
  const [hub, setHub] = useState(null)
  const [hubError, setHubError] = useState(null)
  const [reg, setReg] = useState(
    purchaseType === 'new' ? null : aircraft.registration
  )
  const [regError, setRegError] = useState(null)
  // const [showFinanceCalc, setShowFinanceCalc] = useState(false)
  const [basePrice] = useState(
    purchaseType === 'new' ? aircraft.new_price : aircraft.sale_price
  )

  const handleDeliveryChange = (e) => {
    setDeliver(e.target.checked)
    setError(null)
    setAirport(null)
    setDeliveryLocation(aircraft.hq)
    setIcao('')
    if (!e.target.checked) setPrice(0.0)
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
        setDeliveryLocation(response.data.airport.identifier)
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

  const handleHubChange = (e) => {
    setHub(e.target.value)
  }

  const handleRegChange = (e) => {
    setRegError(null)
    if (e.target.value.length > 8) {
      setRegError('Registration cannot be more than 8 characters')
      return
    }
    setReg(e.target.value)
  }

  const purchase = () => {
    setError(null)
    setHubError(null)
    setRegError(null)

    if (reg == null || reg.length > 7) {
      setRegError(
        'Registration must be at least 1 character and no more than 7'
      )
      return
    }
    if (hub == null) {
      setHubError('Please enter home hub ICAO')
      return
    }

    const total = parseFloat(aircraft.new_price) + parseFloat(price)

    if (total > auth.user.balance) {
      window.alert('You do not have sufficient funds')
      return
    }
    const data = {
      total,
      id: aircraft.id,
      deliveryIcao: purchaseType === 'new' ? deliveryLocation : aircraft.hq,
      hub,
      reg,
      purchaseType,
    }
    router.post('/marketplace/purchase', data)
  }

  return (
    <>
      <Heading size="md">
        Purchase New - {aircraft.manufacturer} {aircraft.name}
      </Heading>
      <Card mt={2}>
        <CardHeader>
          <Heading size="sm">Invoice</Heading>
        </CardHeader>
        <CardBody>
          {purchaseType === 'new' && (
            <>
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
            </>
          )}
          <Box width="200px">
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
          <Button onClick={() => purchase()}>Purchase</Button>
          {errors.reg && (
            <Text my={2} fontSize="sm" color="red.500">
              The aircraft registration already exists
            </Text>
          )}
        </CardBody>
      </Card>
    </>
  )
}

Purchase.layout = (page) => (
  <AppLayout
    children={page}
    title="Marketplace - Invoice"
    heading="Marketplace - Invoice"
  />
)

export default Purchase
