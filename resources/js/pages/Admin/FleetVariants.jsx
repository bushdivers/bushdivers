import {
  Badge,
  Button,
  Card,
  CardBody,
  Link as ChakraLink,
  Flex,
  Icon,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { Link } from '@inertiajs/react'
import { Pen, Trash2 } from 'lucide-react'
import React from 'react'

import AdminLayout from '../../components/layout/AdminLayout.jsx'

const FleetVariants = ({ fleet, variants }) => {
  return (
    <Card>
      <CardBody>
        <Flex mb={4} gap={2}>
          <Button
            as={Link}
            href={`/admin/fleet/edit/${fleet.id}`}
            size="sm"
            variant="outline"
          >
            ← Back to Fleet
          </Button>
          <Button
            as={Link}
            href={`/admin/fleet/${fleet.id}/variants/create`}
            size="sm"
          >
            Add Variant
          </Button>
        </Flex>
        {variants.length === 0 ? (
          <Text>No variants configured for this fleet.</Text>
        ) : (
          <TableContainer>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Default</Th>
                  <Th>PAX</Th>
                  <Th>Cargo (lbs)</Th>
                  <Th>Fuel (gal)</Th>
                  <Th>Range (nm)</Th>
                  <Th>MTOW (lbs)</Th>
                  <Th>ZFW (lbs)</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {variants.map((v) => (
                  <Tr key={v.id}>
                    <Td>{v.name}</Td>
                    <Td>
                      {v.is_default && (
                        <Badge colorScheme="green">Default</Badge>
                      )}
                    </Td>
                    <Td>{v.pax_capacity}</Td>
                    <Td>{v.cargo_capacity?.toLocaleString()}</Td>
                    <Td>{v.fuel_capacity}</Td>
                    <Td>{v.range?.toLocaleString()}</Td>
                    <Td>{v.mtow?.toLocaleString()}</Td>
                    <Td>{v.zfw?.toLocaleString()}</Td>
                    <Td>
                      <Flex alignItems="center" gap={2}>
                        <ChakraLink
                          as={Link}
                          href={`/admin/fleet/${fleet.id}/variants/${v.id}/edit`}
                        >
                          <Button variant="ghost" size="xs">
                            <Icon as={Pen} />
                          </Button>
                        </ChakraLink>
                        {variants.length > 1 && (
                          <ChakraLink
                            as={Link}
                            href={`/admin/fleet/${fleet.id}/variants/${v.id}/delete`}
                          >
                            <Button variant="ghost" size="xs">
                              <Icon as={Trash2} />
                            </Button>
                          </ChakraLink>
                        )}
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </CardBody>
    </Card>
  )
}

FleetVariants.layout = (page) => (
  <AdminLayout
    children={page}
    heading="Fleet Management"
    subHeading={`${page.props.fleet.type} — ${page.props.fleet.name} — Variants`}
  />
)

export default FleetVariants
