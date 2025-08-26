import {
  Button,
  Card,
  CardBody,
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
import { Link, router } from '@inertiajs/react'
import React, { useState } from 'react'

import AdminLayout from '../../components/layout/AdminLayout.jsx'

const Missions = ({ missions }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [newMissionError, setNewMissionError] = useState(null)
  const [newMission, setNewMission] = useState({
    name: '',
  })

  function handleChange(e) {
    setNewMission({
      ...newMission,
      [e.target.id]: e.target.value,
    })
  }
  function createMission() {
    setNewMissionError(null)
    if (newMission.name === '') {
      setNewMissionError('Please ensure all fields are filled in')
      return
    }

    router.post('/admin/missions', newMission)
    onClose()
  }

  function deleteMission(mission) {
    if (confirm('Are you sure you want to delete this mission?')) {
      router.delete(`/admin/missions/${mission.id}`)
    }
  }

  function publishMission(id) {
    if (confirm('Are you sure you want to publish this mission?')) {
      router.post(`/admin/missions/${id}/publish`)
    }
  }

  function completeMission(id) {
    if (confirm('Are you sure you want to complete this mission?')) {
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

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose()
          setNewMissionError(null)
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a new mission</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {newMissionError ? (
              <Text color="red.500">{newMissionError}</Text>
            ) : null}
            <FormControl>
              <FormLabel>Mission Name</FormLabel>
              <Input onChange={handleChange} id="name" />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => createMission()} mr={3}>
              Save
            </Button>
            <Button
              onClick={() => {
                onClose()
                setNewMissionError(null)
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </AdminLayout>
  )
}

export default Missions
