import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Grid,
  GridItem,
  Icon,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { Link } from '@inertiajs/react'
import { format } from 'date-fns'
import { Ban, CheckCircle2, User, UserCog } from 'lucide-react'
import React from 'react'

import AdminMenu from '../../components/layout/navigation/AdminMenu.jsx'
import Pagination from '../../components/elements/Pagination'
import AppLayout from '../../components/layout/AppLayout'

const Users = ({ users }) => {
  return (
    <Grid templateColumns="repeat(6, 1fr)" gap={2}>
      <GridItem colSpan={1}>
        <AdminMenu />
      </GridItem>
      <GridItem colSpan={5}>
        <Card>
          <CardBody>
            <TableContainer>
              <Table>
                <Thead>
                  <Tr>
                    <Th>Pilot Id</Th>
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Current Airport</Th>
                    <Th>Total Points</Th>
                    <Th>Opted In</Th>
                    <Th>Patreon</Th>
                    <Th>Status</Th>
                    <Th>Admin</Th>
                    <Th>Roles</Th>
                    <Th>Date Joined</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {users.data.map((entry) => (
                    <Tr key={entry.id}>
                      <Td>{entry.pilot_id}</Td>
                      <Td>{entry.name}</Td>
                      <Td>{entry.email}</Td>
                      <Td>{entry.current_airport_id}</Td>
                      <Td>{entry.points}</Td>
                      <Td>{entry.opt_in ? 'Yes' : 'No'}</Td>
                      <Td>{entry.is_supporter ? 'Yes' : 'No'}</Td>
                      <Td>
                        <Flex alignItems="center" gap={2}>
                          <Box>{entry.is_active ? 'Active' : 'Blocked'}</Box>
                          <Link href={`/admin/users/active/${entry.id}`}>
                            {entry.is_active ? (
                              <Button variant="ghost" size="xs">
                                <Icon as={Ban} />
                              </Button>
                            ) : (
                              <Button variant="ghost" size="xs">
                                <Icon as={CheckCircle2} />
                              </Button>
                            )}
                          </Link>
                        </Flex>
                      </Td>
                      <Td>
                        <Flex alignItems="center" gap={2}>
                          <Box>{entry.is_admin ? 'Yes' : 'No'}</Box>
                          <Link href={`/admin/users/admin/${entry.id}`}>
                            {entry.is_admin ? (
                              <Button variant="ghost" size="xs">
                                <Icon as={User} />
                              </Button>
                            ) : (
                              <Button variant="ghost" size="xs">
                                <Icon as={UserCog} />
                              </Button>
                            )}
                          </Link>
                        </Flex>
                      </Td>
                      <Td>
                        <Flex direction="column">
                          {entry.user_roles &&
                            // eslint-disable-next-line react/jsx-key
                            entry.user_roles.map((role) => <Box>{role}</Box>)}
                        </Flex>
                      </Td>
                      <td>
                        {format(new Date(entry.created_at), 'dd LLL yyyy')}
                      </td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            <Pagination pages={users} />
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  )
}

Users.layout = (page) => (
  <AppLayout children={page} title="Admin - Users" heading="Users" />
)

export default Users
