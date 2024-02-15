import { Box, Card, CardBody, Flex, SimpleGrid } from '@chakra-ui/react'
import { router } from '@inertiajs/react'
import React from 'react'

import AppLayout from '../../components/layout/AppLayout'

const Manufacturers = ({ manufacturers }) => {
  const selectManufacturer = (manufacturer) => {
    router.get(`marketplace/${manufacturer}`)
  }

  return (
    <Box>
      <SimpleGrid columns={3} gap={5}>
        {manufacturers &&
          manufacturers.map((man) => (
            <Card
              cursor="pointer"
              onClick={() => selectManufacturer(man.id)}
              key={man.id}
            >
              <CardBody>
                <Flex justifyContent="center" alignItems="center" h="100%">
                  {man.logo_url && <img src={man.logo_url} width="200" />}
                  {!man.logo_url && man.name}
                </Flex>
              </CardBody>
            </Card>
          ))}
      </SimpleGrid>
    </Box>
  )
}

Manufacturers.layout = (page) => (
  <AppLayout children={page} title="Marketplace" heading="Marketplace" />
)

export default Manufacturers
