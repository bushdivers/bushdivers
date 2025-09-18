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
  VStack,
  useDisclosure,
} from '@chakra-ui/react'
import { Link, router } from '@inertiajs/react'
import React, { useRef } from 'react'

import BulkUploadModal from '../../components/elements/BulkUploadModal.jsx'
import BulkUploadResults from '../../components/elements/BulkUploadResults.jsx'
import AdminLayout from '../../components/layout/AdminLayout'

const Airports = ({ airports, bulkUploadResults }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isBulkUploadOpen,
    onOpen: onBulkUploadOpen,
    onClose: onBulkUploadClose,
  } = useDisclosure()
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
    <AdminLayout
      heading="Third-Party Airports"
      subHeading="Airport List"
      actions={
        <Flex gap={2}>
          <Button onClick={onBulkUploadOpen} size="sm" variant="outline">
            Bulk Upload Airports
          </Button>
          <Button as={Link} href="/admin/airports/create" size="sm">
            Add New Airport
          </Button>
        </Flex>
      }
    >
      <Box>
        <Card>
          <CardBody>
            <BulkUploadResults
              results={bulkUploadResults}
              title="Airport Upload Results"
              successMessage="Airport(s) successfully imported"
            />
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
                            <Badge
                              colorScheme="blue"
                              variant="subtle"
                              size="sm"
                            >
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

        <BulkUploadModal
          isOpen={isBulkUploadOpen}
          onClose={onBulkUploadClose}
          uploadUrl="/admin/airports/bulk-upload"
          title="Bulk Upload Airports"
          formatDescription={
            <VStack align="start">
              <Text>Upload a CSV file with the following columns:</Text>
              <Text fontFamily="monospace">
                identifier, name, location, country, country_code, lat, lon,
                magnetic_variance, altitude, size, longest_runway_length,
                longest_runway_width, longest_runway_surface, has_avgas,
                has_jetfuel
              </Text>
              <Text fontSize="xs">
                size: 1-5, country_code: 2-letter ISO code,
                has_avgas/has_jetfuel: true/false
              </Text>
              <Text fontSize="xs">
                runway_surface: ASPHALT, CONCRETE, GRASS, GRAVEL, BITUMINOUS,
                CEMENT, MACADAM, SAND, TARMAC, WATER
              </Text>
              <Text fontSize="xs">
                Example:
                <br />
                ABCD,Example Airport,Example Location,United
                States,US,-33.9469,18.6017,0,14,3,2500,75,ASPHALT,true,false
                <br />
                EFGH,Another Airport,Another
                Location,Canada,CA,43.6777,-79.6248,0,173,4,3000,100,concrete,false,true
              </Text>
            </VStack>
          }
        />
      </Box>
    </AdminLayout>
  )
}

export default Airports
