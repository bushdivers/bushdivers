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
import React from 'react'

import AppLayout from '../../components/layout/AppLayout'
import { displayNumber } from '../../helpers/number.helpers.js'

const Aircraft = ({ fleet }) => {
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
                    <Text>New: ${displayNumber(f.new_price)}</Text>
                    <Text>
                      Used: ${displayNumber(f.used_low_price)} - $
                      {displayNumber(f.used_high_price)}
                    </Text>
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
                  <Link href={`/marketplace/purchase/new/${f.id}`}>
                    <Button>Purchase New</Button>
                  </Link>
                  {/* <Link href={`/marketplace/list/used/${f.id}`} className="btn btn-primary">Purchase Used</Link> */}
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
