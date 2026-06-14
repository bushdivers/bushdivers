import {
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
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react'
import { Link, router, useForm, usePage } from '@inertiajs/react'
import React from 'react'

import { useMessageBox } from '../../components/elements/MessageBoxProvider.jsx'
import AdminLayout from '../../components/layout/AdminLayout.jsx'

const Missions = ({ missions }) => {
  const { auth } = usePage().props

  const { isOpen, onOpen, onClose } = useDisclosure()
  const messageBox = useMessageBox()
  const form = useForm({
    name: '',
    is_hub_event: false,
    hub_airport_icao: '',
  })

  function handleChange(e) {
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value
    form.setData(e.target.id, value)
  }

  function resetForm() {
    onClose()
    form.reset()
  }

  function createMission(e) {
    e.preventDefault()
    form.post('/admin/missions', {
      onSuccess: () => resetForm(),
    })
  }

  async function deleteMission(mission) {
    const accepted = await messageBox.confirm({
      title: 'Delete Mission',
      description: 'Are you sure you want to delete this mission?',
      status: 'warning',
      confirmText: 'Delete',
      confirmColorScheme: 'red',
    })

    if (accepted) {
      router.delete(`/admin/missions/${mission.id}`)
    }
  }

  async function publishMission(id) {
    const accepted = await messageBox.confirm({
      title: 'Publish Mission',
      description: 'Are you sure you want to publish this mission?',
      status: 'warning',
      confirmText: 'Publish',
    })

    if (accepted) {
      router.post(`/admin/missions/${id}/publish`)
    }
  }

  async function completeMission(id) {
    const accepted = await messageBox.confirm({
      title: 'Complete Mission',
      description: 'Are you sure you want to mark this mission as completed?',
      status: 'warning',
      confirmText: 'Complete',
    })

    if (accepted) {
      router.post(`/admin/missions/${id}/complete`)
    }
  }

  return (
    <AdminLayout
      heading="Mission Management"
      subHeading="Missions List"
      actions={
        <Button onClick={onOpen} size="sm">
          Add Mission
        </Button>
      }
    >
      <Card>
        <CardBody>
          {missions?.length > 0 ? (
            <TableContainer>
              <Table>
                <Thead>
                  <Tr>
                    <Th>Mission #</Th>
                    <Th>Name</Th>
                    <Th>Type</Th>
                    <Th>Status</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {missions.map((mission) => (
                    <Tr key={mission.id}>
                      <Td>{mission.id}</Td>
                      <Td>{mission.name}</Td>
                      <Td>
                        {mission.hub_airport_id ? (
                          <Tag colorScheme="purple">Hub Event</Tag>
                        ) : (
                          <Tag>Regular Mission</Tag>
                        )}
                      </Td>
                      <Td>
                        {mission.is_completed ? (
                          <Tag colorScheme="green">Completed</Tag>
                        ) : mission.is_published ? (
                          <Flex gap={2}>
                            <Tag colorScheme="orange">Published</Tag>
                            <Button
                              onClick={() => completeMission(mission.id)}
                              size="xs"
                            >
                              Complete
                            </Button>
                          </Flex>
                        ) : (
                          <Flex gap={2}>
                            <Tag colorScheme="gray">Draft</Tag>
                            <Button
                              onClick={() => publishMission(mission.id)}
                              size="xs"
                            >
                              Publish
                            </Button>
                          </Flex>
                        )}
                      </Td>
                      <Td>
                        <Flex gap={2}>
                          <Link href={`/admin/missions/${mission.id}`}>
                            <Button colorScheme="gray" size="xs">
                              Edit
                            </Button>
                          </Link>
                          {!mission.is_published && (
                            <Button
                              colorScheme="gray"
                              onClick={() => deleteMission(mission)}
                              size="xs"
                            >
                              Delete
                            </Button>
                          )}
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <Heading size="sm">No Missions</Heading>
          )}
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={resetForm}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a new mission</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={createMission}>
            <ModalBody pb={6}>
              <FormControl mb={3} isInvalid={!!form.errors.name}>
                <FormLabel>Mission Name</FormLabel>
                <Input
                  onChange={handleChange}
                  id="name"
                  value={form.data.name}
                />
                {form.errors.name && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {form.errors.name}
                  </Text>
                )}
              </FormControl>
              {auth.user.is_admin && (
                <FormControl mb={3}>
                  <Checkbox
                    id="is_hub_event"
                    isChecked={form.data.is_hub_event}
                    onChange={handleChange}
                  >
                    This is a Hub Event
                  </Checkbox>
                </FormControl>
              )}
              {auth.user.is_admin && form.data.is_hub_event && (
                <FormControl mb={3} isInvalid={!!form.errors.hub_airport_icao}>
                  <FormLabel>Hub Airport (ICAO)</FormLabel>
                  <Input
                    placeholder="Type ICAO code (e.g., KJFK)"
                    onChange={handleChange}
                    id="hub_airport_icao"
                    value={form.data.hub_airport_icao}
                  />
                  {form.errors.hub_airport_icao && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {form.errors.hub_airport_icao}
                    </Text>
                  )}
                </FormControl>
              )}
            </ModalBody>

            <ModalFooter>
              <Button
                type="submit"
                mr={3}
                isLoading={form.processing}
                disabled={form.processing}
              >
                Save
              </Button>
              <Button onClick={resetForm}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </AdminLayout>
  )
}

export default Missions
