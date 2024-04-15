import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Select,
  Text,
} from '@chakra-ui/react'
import React, { useState } from 'react'

import { displayNumber } from '../../helpers/number.helpers.js'

const UsedPurchase = ({
  aircraft,
  hub,
  handleHubChange,
  hubError,
  reg,
  handleRegChange,
  regError,
  purchase,
  buyer,
  hubs,
}) => {
  const [basePrice] = useState(aircraft.sale_price)

  return (
    <Box>
      <Heading size="md">
        Purchase Used - {aircraft.fleet.manufacturer} {aircraft.fleet.name}{' '}
        {aircraft.registration} {buyer === 'admin' && ' - For VA'}
      </Heading>
      <Card mt={2}>
        <CardHeader>
          <Heading size="sm">Invoice</Heading>
        </CardHeader>
        <CardBody>
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
            <Text>Total</Text>
            <Text>${displayNumber(parseFloat(basePrice), true)}</Text>
          </Box>
          <Button onClick={() => purchase(parseFloat(basePrice))}>
            Purchase
          </Button>
        </CardBody>
      </Card>
    </Box>
  )
}

export default UsedPurchase
