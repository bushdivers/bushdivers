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
                    <Text>New: ${f.new_price}</Text>
                    <Text>
                      Used: ${f.used_low_price} - ${f.used_high_price}
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
                    <Box>Fuel Capacity: {f.fuel_capacity} gal</Box>
                    <Box>ZFW: {f.zfw} lbs</Box>
                    <Box>MTOW: {f.mtow} lbs</Box>
                    <Box>Cargo Capacity: {f.cargo_capacity} lbs</Box>
                    <Box>PAX Capacity: {f.pax_capacity}</Box>
                    <Box>Service Ceiling: {f.service_ceiling} ft</Box>
                    <Box>Range: {f.range} nm</Box>
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
