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
  Textarea,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react'
import { Link, router } from '@inertiajs/react'
import React, { useState } from 'react'

import AdminLayout from '../../components/layout/AdminLayout.jsx'

const TourList = ({ tours }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [newTourError, setNewTourError] = useState(null)
  const [newTour, setNewTour] = useState({
    title: '',
    description: '',
    start: '',
  })

  function handleChange(e) {
    setNewTour({
      ...newTour,
      [e.target.id]: e.target.value,
    })
  }
  function createTour() {
    setNewTourError(null)
    if (
      newTour.title === '' ||
      newTour.description === '' ||
      newTour.start === ''
    ) {
      setNewTourError('Please ensure all fields are filled in')
      return
    }

    router.post('/admin/tours', newTour)
    onClose()
  }

  function deleteTour(tour) {
    if (confirm('Are you sure you want to delete this tour?')) {
      router.delete(`/admin/tours/${tour.id}`)
    }
  }

  function publishTour(id) {
    if (confirm('Are you sure you want to publish this tour?')) {
      router.post(`/admin/tours/${id}/publish`)
    }
  }

  return (
    <AdminLayout
      heading="Tour Management"
      subHeading="Tour List"
      actions={
        <Button onClick={onOpen} size="sm">
          Add Tour
        </Button>
      }
    >
      <Card>
        <CardBody>
          {tours?.length > 0 ? (
            <TableContainer>
              <Table>
                <Thead>
                  <Tr>
                    <Th>Tour #</Th>
                    <Th>Tour Title</Th>
                    <Th>Start</Th>
                    <Th>Checkpoints</Th>
                    <Th>Aircraft</Th>
                    <Th>Participants</Th>
                    <Th>Status</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {tours.map((tour) => (
                    <Tr key={tour.id}>
                      <Td>{tour.id}</Td>
                      <Td>{tour.title}</Td>
                      <Td>{tour.start_airport_id}</Td>
                      <Td>{tour.checkpoints?.length}</Td>
                      <Td>{tour.aircraft?.length}</Td>
                      <Td>{tour.participants?.length}</Td>
                      <Td>
                        {tour.is_published ? (
                          <Tag colorScheme="orange">Published</Tag>
                        ) : (
                          <Flex gap={2}>
                            <Tag colorScheme="gray">Draft</Tag>
                            <Button
                              onClick={() => publishTour(tour.id)}
                              size="xs"
                            >
                              Publish
                            </Button>
                          </Flex>
                        )}
                      </Td>
                      <Td>
                        <Flex gap={2}>
                          <Link href={`/admin/tours/${tour.id}`}>
                            <Button colorScheme="gray" size="xs">
                              Edit
                            </Button>
                          </Link>
                          {!tour.is_published && (
                            <Button
                              colorScheme="gray"
                              onClick={() => deleteTour(tour)}
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
            <Heading size="sm">No Tours</Heading>
          )}
        </CardBody>
      </Card>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose()
          setNewTourError(null)
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a new tour</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {newTourError ? <Text color="red.500">{newTourError}</Text> : null}
            <FormControl>
              <FormLabel>Tour Title</FormLabel>
              <Input onChange={handleChange} id="title" />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Tour Description</FormLabel>
              <Textarea onChange={handleChange} id="description" />
            </FormControl>

            <FormControl>
              <FormLabel>Tour Start Airport Code (ICAO)</FormLabel>
              <Input onChange={handleChange} id="start" />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => createTour()} mr={3}>
              Save
            </Button>
            <Button
              onClick={() => {
                onClose()
                setNewTourError(null)
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

export default TourList
