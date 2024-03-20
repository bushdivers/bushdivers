import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'
import { Link } from '@inertiajs/react'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import React from 'react'

import AppLayout from '../../components/layout/AppLayout'
import { displayNumber } from '../../helpers/number.helpers.js'

const Aircraft = ({ fleet }) => {
  const flagEnabled = useFeatureFlagEnabled('used-aircraft')
  return (
    <>
      <SimpleGrid columns={3} gap={5}>
        {fleet &&
          fleet.map((f) => (
            <Card key={f.id}>
              <CardBody>
                {f.rental_image && (
                  <Box w="100%">
                    <img src={f.rental_image} />
                  </Box>
                )}
                <Box>
                  <Text fontSize="lg">{f.name}</Text>
                  <Box mb={2}>
                    <Text>Price Range:</Text>
                    {f.can_purchase_new ? (
                      <Text>New: ${displayNumber(f.new_price)}</Text>
                    ) : (
                      <></>
                    )}
                    {flagEnabled ? (
                      <Text>
                        Used: ${displayNumber(f.used_low_price)} - $
                        {displayNumber(f.used_high_price)}
                      </Text>
                    ) : (
                      <></>
                    )}
                  </Box>
                  <Flex mb={2} direction="column">
                    <Box>
                      Powerplants: {f.number_of_engines} x {f.powerplants}
                    </Box>
                    <Box>
                      Fuel Type:{' '}
                      {f.fuel_type === 1 ? (
                        <Box>Avgas</Box>
                      ) : (
                        <Box>Jet Fuel</Box>
                      )}
                    </Box>
                    <Box>
                      Fuel Capacity: {displayNumber(f.fuel_capacity)} gal
                    </Box>
                    <Box>ZFW: {displayNumber(f.zfw)} lbs</Box>
                    <Box>MTOW: {displayNumber(f.mtow)} lbs</Box>
                    <Box>
                      Cargo Capacity: {displayNumber(f.cargo_capacity)} lbs
                    </Box>
                    <Box>PAX Capacity: {f.pax_capacity}</Box>
                    <Box>
                      Service Ceiling: {displayNumber(f.service_ceiling)} ft
                    </Box>
                    <Box>Range: {displayNumber(f.range)} nm</Box>
                    <Box>Cruise Speed: {f.cruise_speed} KIAS</Box>
                  </Flex>
                  <Flex gap={2}>
                    {f.can_purchase_new ? (
                      <Link href={`/marketplace/purchase/new/${f.id}`}>
                        <Button>Purchase New</Button>
                      </Link>
                    ) : (
                      <></>
                    )}
                    {flagEnabled ? (
                      <Link href={`/marketplace/list/used/${f.id}`}>
                        <Button>Purchase Used</Button>
                      </Link>
                    ) : (
                      <></>
                    )}
                  </Flex>
                </Box>
              </CardBody>
            </Card>
          ))}
      </SimpleGrid>
    </>
  )
}

Aircraft.layout = (page) => (
  <AppLayout
    children={page}
    title="Marketplace - Aircraft"
    heading="Marketplace - Aircraft"
  />
)

export default Aircraft
