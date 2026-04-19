import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Button,
  Card,
  CardBody,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
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
import React, { useRef, useState } from 'react'

import AdminLayout from '../../components/layout/AdminLayout.jsx'

const CargoTypes = ({ cargoTypes }) => {
  const { errors } = usePage().props
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [editTarget, setEditTarget] = useState(null)
  const [formData, setFormData] = useState({
    text: '',
    type: '1',
    min_cargo_split: '1',
  })
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
  const [cargoTypeToDelete, setCargoTypeToDelete] = useState(null)
  const cancelRef = useRef()

  const handleOpenCreate = () => {
    setEditTarget(null)
    setFormData({ text: '', type: '1', min_cargo_split: '1' })
    onOpen()
  }

  const handleOpenEdit = (cargoType) => {
    setEditTarget(cargoType)
    setFormData({
      text: cargoType.text,
      type: String(cargoType.type),
      min_cargo_split: String(cargoType.min_cargo_split),
    })
    onOpen()
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editTarget) {
      router.put(`/admin/cargo-types/${editTarget.id}`, formData, {
        onSuccess: onClose,
      })
    } else {
      router.post('/admin/cargo-types', formData, {
        onSuccess: onClose,
      })
    }
  }

  const handleDelete = (cargoType) => {
    setCargoTypeToDelete(cargoType)
    setDeleteAlertOpen(true)
  }

  const confirmDelete = () => {
    if (!cargoTypeToDelete) return

    const cargoTypesOfSameType = cargoTypes.filter(
      (ct) => ct.type === cargoTypeToDelete.type
    )

    // Check if this is the last of its type
    if (cargoTypesOfSameType.length === 1) {
      return // Cannot delete, just close the dialog
    }

    setDeleteAlertOpen(false)
    router.delete(`/admin/cargo-types/${cargoTypeToDelete.id}`)
    setCargoTypeToDelete(null)
  }

  const isLastOfType = () => {
    if (!cargoTypeToDelete) return false
    const cargoTypesOfSameType = cargoTypes.filter(
      (ct) => ct.type === cargoTypeToDelete.type
    )
    return cargoTypesOfSameType.length === 1
  }

  const typeLabel = (type) => (type === 1 ? 'Cargo' : 'Passenger')

  return (
    <AdminLayout
      heading="Cargo Type Management"
      subHeading="Cargo Types"
      actions={
        <Button onClick={handleOpenCreate} size="sm">
          Create Cargo Type
        </Button>
      }
    >
      <Card>
        <CardBody>
          <TableContainer>
            <Table>
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Type</Th>
                  <Th>Min Split</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {cargoTypes.map((ct) => (
                  <Tr key={ct.id}>
                    <Td>{ct.text}</Td>
                    <Td>
                      <Badge colorScheme={ct.type === 1 ? 'blue' : 'green'}>
                        {typeLabel(ct.type)}
                      </Badge>
                    </Td>
                    <Td>{ct.min_cargo_split}</Td>
                    <Td>
                      <HStack spacing={2}>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenEdit(ct)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => handleDelete(ct)}
                        >
                          Delete
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>
              {editTarget ? 'Edit Cargo Type' : 'Create Cargo Type'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl isRequired isInvalid={!!errors.text} mb={4}>
                <FormLabel>Name</FormLabel>
                <Input
                  name="text"
                  value={formData.text}
                  onChange={handleChange}
                  placeholder="e.g. General Cargo"
                />
                {errors.text && (
                  <FormErrorMessage>{errors.text}</FormErrorMessage>
                )}
              </FormControl>
              {!editTarget && (
                <FormControl isRequired isInvalid={!!errors.type} mb={4}>
                  <FormLabel>Type</FormLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="1">Cargo</option>
                    <option value="2">Passenger</option>
                  </Select>
                  {errors.type && (
                    <FormErrorMessage>{errors.type}</FormErrorMessage>
                  )}
                </FormControl>
              )}
              <FormControl isRequired isInvalid={!!errors.min_cargo_split}>
                <FormLabel>Min Cargo Split</FormLabel>
                <Input
                  name="min_cargo_split"
                  type="number"
                  min={1}
                  value={formData.min_cargo_split}
                  onChange={handleChange}
                />
                {errors.min_cargo_split && (
                  <FormErrorMessage>{errors.min_cargo_split}</FormErrorMessage>
                )}
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" colorScheme="blue">
                {editTarget ? 'Save Changes' : 'Create'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={deleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setDeleteAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Cargo Type
            </AlertDialogHeader>
            <AlertDialogBody>
              {isLastOfType() ? (
                <>
                  <Text color="red.500" fontWeight="bold">
                    Cannot delete the last{' '}
                    {cargoTypeToDelete?.type === 1 ? 'Cargo' : 'Passenger'}{' '}
                    type.
                  </Text>
                  <Text fontSize="sm" mt={2} color="gray.600">
                    You must always have at least one cargo type and one
                    passenger type available.
                  </Text>
                </>
              ) : (
                <>
                  <Text>Are you sure you want to delete this cargo type?</Text>
                  {cargoTypeToDelete && (
                    <Text fontSize="sm" mt={2} color="gray.600">
                      {cargoTypeToDelete.text}
                    </Text>
                  )}
                </>
              )}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setDeleteAlertOpen(false)}>
                {isLastOfType() ? 'Close' : 'Cancel'}
              </Button>
              {!isLastOfType() && (
                <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                  Delete
                </Button>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </AdminLayout>
  )
}

export default CargoTypes
