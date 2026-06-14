import {
  Box,
  Card,
  CardBody,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import React from 'react'

import AdminLayout from '../../components/layout/AdminLayout.jsx'

const HubsList = ({ hubs }) => {
  return (
    <AdminLayout heading="Hub Management" subHeading="Hub List">
      <Card>
        <CardBody>
          {hubs && hubs.length > 0 && (
            <Box p={2}>
              <TableContainer>
                <Table>
                  <Thead>
                    <Tr className="">
                      <Th>Identifier</Th>
                      <Th>Name</Th>
                      <Th>Location</Th>
                      <Th>Country</Th>
                      <Th>Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {hubs &&
                      hubs.map((hub) => (
                        <Tr
                          color={hub.hub_in_progress ? 'orange.500' : ''}
                          key={hub.id}
                        >
                          <Td>{hub.identifier}</Td>
                          <Td>{hub.name}</Td>
                          <Td>{hub.location}</Td>
                          <Td>{hub.country}</Td>
                          <Td>
                            {hub.hub_in_progress
                              ? 'In Progress'
                              : hub.is_hub
                                ? 'Active'
                                : 'Inactive'}
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </CardBody>
      </Card>
    </AdminLayout>
  )
}

export default HubsList
