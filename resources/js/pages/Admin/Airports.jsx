import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react'
import { Link, router } from '@inertiajs/react'
import React, { useRef } from 'react'

import AdminLayout from '../../components/layout/AdminLayout'

const Airports = ({ airports }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()
  const [airportToDelete, setAirportToDelete] = React.useState(null)

  const handleDeleteClick = (airport) => {
    setAirportToDelete(airport)
    onOpen()
  }

  const confirmDelete = () => {
    if (airportToDelete) {
      router.delete(`/admin/airports/${airportToDelete.id}`)
    }
    onClose()
    setAirportToDelete(null)
  }

  return (
    <Box>
      <Card>
        <CardBody>
          {airports.data.length > 0 ? (
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Identifier</Th>
                  <Th>Name</Th>
                  <Th>Size</Th>
                  <Th>Country</Th>
                  <Th>Fuel</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {airports.data.map((airport) => (
                  <Tr key={airport.id}>
                    <Td fontWeight="bold">{airport.identifier}</Td>
                    <Td>{airport.name}</Td>
                    <Td>{airport.size}</Td>
                    <Td>{airport.country}</Td>
                    <Td>
                      <Flex gap={1}>
                        {airport.has_avgas && (
                          <Badge colorScheme="blue" variant="subtle" size="sm">
                            AVGAS
                          </Badge>
                        )}
                        {airport.has_jetfuel && (
                          <Badge
                            colorScheme="purple"
                            variant="subtle"
                            size="sm"
                          >
                            JET
                          </Badge>
                        )}
                        {!airport.has_avgas && !airport.has_jetfuel && (
                          <Text color="gray.500" fontSize="sm">
                            None
                          </Text>
                        )}
                      </Flex>
                    </Td>
                    <Td>
                      <Flex gap={2}>
                        <Button
                          as={Link}
                          href={`/admin/airports/edit/${airport.id}`}
                          variant="outline"
                          size="sm"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteClick(airport)}
                          colorScheme="red"
                          variant="outline"
                          size="sm"
                        >
                          Delete
                        </Button>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) : (
            <Text textAlign="center" py={8} color="gray.500">
              No third-party airports found.
            </Text>
          )}
        </CardBody>
      </Card>

      {/* Pagination */}
      {airports.last_page > 1 && (
        <Flex justifyContent="center" mt={6} gap={2}>
          {airports.prev_page_url && (
            <Button
              as={Link}
              href={airports.prev_page_url}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>
          )}

          <Text alignSelf="center" px={4} fontSize="sm">
            Page {airports.current_page} of {airports.last_page}
          </Text>

          {airports.next_page_url && (
            <Button
              as={Link}
              href={airports.next_page_url}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          )}
        </Flex>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Airport
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete airport{' '}
              <strong>
                {airportToDelete?.identifier} - {airportToDelete?.name}
              </strong>
              ? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  )
}

Airports.layout = (page) => (
  <AdminLayout
    heading="Third-Party Airports"
    subHeading="Airport List"
    actions={
      <Button as={Link} href="/admin/airports/create" size="sm">
        Add New Airport
      </Button>
    }
  >
    {page}
  </AdminLayout>
)

export default Airports
