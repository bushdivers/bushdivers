import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
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
    <Card>
      <CardBody>
        <Flex justifyContent="end">
          <Button>Create Hub</Button>
        </Flex>
        {hubs && hubs.length > 0 && (
          // (
          <Box p={2}>
            <TableContainer>
              <Table>
                <Thead>
                  <Tr className="">
                    <Th>Identifier</Th>
                    <Th>Name</Th>
                    <Th>Location</Th>
                    <Th>Country</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {hubs &&
                    hubs.map((hub) => (
                      <>
                        <Tr key={hub.id}>
                          <Td>{hub.identifier}</Td>
                          <Td>{hub.name}</Td>
                          <Td>{hub.location}</Td>
                          <Td>{hub.country}</Td>
                        </Tr>
                      </>
                    ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </CardBody>
    </Card>
  )
}

HubsList.layout = (page) => (
  <AdminLayout children={page} title="Admin - Hubs" heading="Hub List" />
)
export default HubsList
