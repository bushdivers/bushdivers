import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react'
import { router, usePage } from '@inertiajs/react'
import React, { useState } from 'react'

import AdminLayout from '../../components/layout/AdminLayout.jsx'

const Users = ({ users, roles }) => {
  const { auth } = usePage().props
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [lookupId, setLookupId] = useState('')
  const [lookupLoading, setLookupLoading] = useState(false)
  const [lookupError, setLookupError] = useState(null)

  const [selectedUser, setSelectedUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [selectedRoles, setSelectedRoles] = useState([])
  const [saving, setSaving] = useState(false)

  function openAddModal() {
    setLookupId('')
    setLookupError(null)
    setSelectedUser(null)
    setIsAdmin(false)
    setSelectedRoles([])
    onOpen()
  }

  function openEditModal(user) {
    const userRoles = user.user_roles ?? []
    const initialRoleIds = roles
      .filter((r) => userRoles.includes(r.role))
      .map((r) => r.id)

    setLookupId('')
    setLookupError(null)
    setSelectedUser(user)
    setIsAdmin(user.is_admin)
    setSelectedRoles(initialRoleIds)
    onOpen()
  }

  async function handleLookup() {
    if (!lookupId.trim()) return

    setLookupLoading(true)
    setLookupError(null)
    setSelectedUser(null)

    try {
      const res = await fetch(
        `/admin/users/lookup/${encodeURIComponent(lookupId.trim())}`
      )
      if (res.status === 404) {
        setLookupError('User not found')
        setLookupLoading(false)
        return
      }
      if (!res.ok) {
        setLookupError('An error occurred during lookup')
        setLookupLoading(false)
        return
      }
      const data = await res.json()
      const initialRoleIds = roles
        .filter((r) => data.user_roles.includes(r.role))
        .map((r) => r.id)

      setSelectedUser(data)
      setIsAdmin(data.is_admin)
      setSelectedRoles(initialRoleIds)
    } catch {
      setLookupError('An error occurred during lookup')
    } finally {
      setLookupLoading(false)
    }
  }

  function handleRoleChange(roleId, checked) {
    setSelectedRoles((prev) =>
      checked ? [...prev, roleId] : prev.filter((id) => id !== roleId)
    )
  }

  function handleSave() {
    if (!selectedUser) return
    setSaving(true)
    router.post(
      `/admin/users/${selectedUser.id}/privileges`,
      { is_admin: isAdmin, roles: selectedRoles },
      {
        onSuccess: () => {
          setSaving(false)
          onClose()
        },
        onError: () => setSaving(false),
      }
    )
  }

  function handleClose() {
    setLookupId('')
    setLookupError(null)
    setSelectedUser(null)
    setIsAdmin(false)
    setSelectedRoles([])
    onClose()
  }

  return (
    <AdminLayout
      heading="User Privileges"
      subHeading="Users with admin access or assigned roles"
      actions={
        <Button onClick={openAddModal} size="sm">
          Add User Privileges
        </Button>
      }
    >
      <Card>
        <CardBody>
          {users.length === 0 ? (
            <Heading size="sm">No privileged users</Heading>
          ) : (
            <TableContainer>
              <Table>
                <Thead>
                  <Tr>
                    <Th>Pilot ID</Th>
                    <Th>Name</Th>
                    <Th>Discord Name</Th>
                    <Th>MSFS Name</Th>
                    <Th>Admin</Th>
                    <Th>Roles</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {users.map((user) => (
                    <Tr key={user.id}>
                      <Td>{user.pilot_id}</Td>
                      <Td>{user.name}</Td>
                      <Td>{user.discord_username ?? '-'}</Td>
                      <Td>{user.msfs_username ?? '-'}</Td>
                      <Td>
                        {user.is_admin ? (
                          <Badge colorScheme="red">Yes</Badge>
                        ) : (
                          <Badge colorScheme="gray">No</Badge>
                        )}
                      </Td>
                      <Td>
                        <Flex gap={1} flexWrap="wrap">
                          {user.user_roles && user.user_roles.length > 0 ? (
                            user.user_roles.map((role) => (
                              <Badge
                                key={role}
                                colorScheme="blue"
                                variant="subtle"
                              >
                                {role}
                              </Badge>
                            ))
                          ) : (
                            <Text color="gray.500" fontSize="sm">
                              None
                            </Text>
                          )}
                        </Flex>
                      </Td>
                      <Td>
                        <Button size="xs" onClick={() => openEditModal(user)}>
                          Edit
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedUser
              ? `Edit: ${selectedUser.pilot_id}`
              : 'Add User Privileges'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={4}>
            {!selectedUser && (
              <FormControl mb={4}>
                <FormLabel>User ID</FormLabel>
                <Flex gap={2}>
                  <Input
                    placeholder="e.g. 42 or BDV0042"
                    value={lookupId}
                    onChange={(e) => setLookupId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                  />
                  <Button
                    onClick={handleLookup}
                    isLoading={lookupLoading}
                    flexShrink={0}
                  >
                    Look Up
                  </Button>
                </Flex>
                {lookupError && (
                  <Text color="red.500" mt={1} fontSize="sm">
                    {lookupError}
                  </Text>
                )}
              </FormControl>
            )}

            {lookupLoading && (
              <Flex justify="center" my={4}>
                <Spinner />
              </Flex>
            )}

            {selectedUser && (
              <Box>
                <Flex
                  direction="column"
                  gap={1}
                  mb={4}
                  p={3}
                  bg="gray.50"
                  borderRadius="md"
                >
                  <Text fontSize="sm">
                    <Text as="span" fontWeight="semibold">
                      Pilot ID:{' '}
                    </Text>
                    {selectedUser.pilot_id}
                  </Text>
                  <Text fontSize="sm">
                    <Text as="span" fontWeight="semibold">
                      Name:{' '}
                    </Text>
                    {selectedUser.name}
                  </Text>
                  <Text fontSize="sm">
                    <Text as="span" fontWeight="semibold">
                      Discord:{' '}
                    </Text>
                    {selectedUser.discord_username ?? '—'}
                  </Text>
                  <Text fontSize="sm">
                    <Text as="span" fontWeight="semibold">
                      MSFS:{' '}
                    </Text>
                    {selectedUser.msfs_username ?? '—'}
                  </Text>
                </Flex>

                <FormControl mb={4}>
                  <Checkbox
                    isChecked={isAdmin}
                    isDisabled={selectedUser.id === auth.user.id}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                  >
                    User administrator (can manage other users)
                  </Checkbox>
                  {selectedUser.id === auth.user.id && (
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      You cannot remove your own admin access
                    </Text>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel>Roles</FormLabel>
                  <Flex direction="column" gap={2}>
                    {roles.map((role) => (
                      <Checkbox
                        key={role.id}
                        isChecked={selectedRoles.includes(role.id)}
                        onChange={(e) =>
                          handleRoleChange(role.id, e.target.checked)
                        }
                      >
                        {role.role}
                      </Checkbox>
                    ))}
                  </Flex>
                </FormControl>
              </Box>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleClose}>
              Cancel
            </Button>
            <Button
              isDisabled={!selectedUser}
              isLoading={saving}
              onClick={handleSave}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </AdminLayout>
  )
}

export default Users
