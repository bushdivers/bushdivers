import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Icon,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { Link, router } from '@inertiajs/react'
import { Pen, Plus, Trash2 } from 'lucide-react'
import React, { useState } from 'react'

import FleetAircraft from '../../components/admin/FleetAircraft'
import NoContent from '../../components/elements/NoContent'
import AdminLayout from '../../components/layout/AdminLayout.jsx'

const EmptyData = () => {
  return (
    <>
      <i className="material-icons md-48">airplane_ticket</i>
      <div>There are no fleet</div>
    </>
  )
}

const FleetList = ({ fleet }) => {
  const [showDetail, setShowDetail] = useState(false)

  const toggleDetail = () => {
    setShowDetail(!showDetail)
  }

  const handleDelete = (id) => {
    const accept = window.confirm('Are you sure you wish to delete this fleet?')
    if (!accept) return

    router.delete(`/admin/fleet/delete/${id}`)
  }

  return (
    <Card>
      <CardBody>
        <Flex justifyContent="space-between">
          {fleet && fleet.length > 0 && (
            <Button colorScheme="gray" onClick={toggleDetail}>
              Toggle fleet aircraft details
            </Button>
          )}
          <Flex gap={2}>
            <Link href="/admin/fleet/create">
              <Button>Add new fleet</Button>
            </Link>
            <Link href="/admin/aircraft/create">
              <Button>Add new aircraft</Button>
            </Link>
          </Flex>
        </Flex>
        {!fleet && <NoContent content={<EmptyData />} />}
        {
          fleet && fleet.length > 0 && (
            // (
            <Box p={2}>
              <TableContainer>
                <Table>
                  <Thead>
                    <Tr className="">
                      <Th>Id</Th>
                      <Th>Type</Th>
                      <Th>Manufacturer</Th>
                      <Th>Name</Th>
                      <Th>Qty</Th>
                      <Th>VA Fleet</Th>
                      <Th>Can Rent</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {fleet &&
                      fleet.map((f) => (
                        <>
                          <Tr key={f.id}>
                            <Td>{f.id}</Td>
                            <Td>{f.type}</Td>
                            <Td>{f.manufacturer}</Td>
                            <Td>{f.name}</Td>
                            <Td>{f.aircraft.length}</Td>
                            <Td>{f.company_fleet ? 'Yes' : 'No'}</Td>
                            <Td>{f.is_rental ? 'Yes' : 'No'}</Td>
                            <Td>
                              <Flex alignItems="center" gap={2}>
                                <Link href={`/admin/fleet/edit/${f.id}`}>
                                  <Button variant="ghost" size="xs">
                                    <Icon as={Pen} />
                                  </Button>
                                </Link>
                                <Link
                                  href={`/admin/aircraft/create?fleet=${f.id}`}
                                >
                                  <Button variant="ghost" size="xs">
                                    <Icon as={Plus} />
                                  </Button>
                                </Link>
                                {f.aircraft.length === 0 && (
                                  <Link onClick={() => handleDelete(f.id)}>
                                    <Button variant="ghost" size="xs">
                                      <Icon as={Trash2} />
                                    </Button>
                                  </Link>
                                )}
                              </Flex>
                            </Td>
                          </Tr>
                          {showDetail && <FleetAircraft fleet={f} />}
                        </>
                      ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          )
          // )
        }
      </CardBody>
    </Card>
  )
}

FleetList.layout = (page) => (
  <AdminLayout children={page} title="Admin - Fleet" heading="Fleet List" />
)

export default FleetList
