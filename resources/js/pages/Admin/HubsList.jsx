import {
  Box,
  Button,
  Card,
  CardBody,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react'
import React from 'react'

import CreateHubDetail from '../../components/admin/CreateHubDetail.jsx'
import AdminLayout from '../../components/layout/AdminLayout.jsx'

const HubsList = ({ hubs, fleet }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <AdminLayout
      heading="Hub Management"
      subHeading="Hub List"
      actions={
        <Button onClick={onOpen} size="sm">
          Create Hub
        </Button>
      }
    >
      <Card>
        <CardBody>
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
                          <Tr
                            color={hub.hub_in_progress ? 'orange.500' : ''}
                            key={hub.id}
                          >
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
      <CreateHubDetail isOpen={isOpen} onClose={onClose} fleet={fleet} />
    </AdminLayout>
  )
}

export default HubsList
