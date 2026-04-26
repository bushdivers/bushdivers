import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  IconButton,
  Image,
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
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from '@chakra-ui/react'
import { router, usePage } from '@inertiajs/react'
import { Pen, Trash2, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const EMPTY_FORM = { name: '' }

const ManufacturerDialog = ({ manufacturers, isOpen, onClose }) => {
  const { errors } = usePage().props
  const [editing, setEditing] = useState(null) // null = add mode, object = edit mode
  const [values, setValues] = useState(EMPTY_FORM)
  const [file, setFile] = useState(null)

  useEffect(() => {
    if (!isOpen) {
      setEditing(null)
      setValues(EMPTY_FORM)
      setFile(null)
    }
  }, [isOpen])

  const handleEdit = (m) => {
    setEditing(m)
    setValues({ name: m.name })
    setFile(null)
  }

  const handleCancelEdit = () => {
    setEditing(null)
    setValues(EMPTY_FORM)
    setFile(null)
  }

  const handleChange = (e) => {
    setValues((v) => ({ ...v, [e.target.id]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const opts = {
      preserveScroll: true,
      preserveState: true,
      forceFormData: true,
    }
    const data = { ...values, uploaded_file: file }
    if (editing) {
      router.patch(`/admin/manufacturers/${editing.id}`, data, opts)
    } else {
      router.post('/admin/manufacturers', data, {
        ...opts,
        onSuccess: () => {
          setValues(EMPTY_FORM)
          setFile(null)
        },
      })
    }
  }

  const handleDelete = (m) => {
    router.delete(`/admin/manufacturers/${m.id}`, {
      preserveScroll: true,
      preserveState: true,
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Manage Manufacturers</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          {/* Add / Edit form */}
          <Box
            as="form"
            onSubmit={handleSubmit}
            bg="gray.50"
            _dark={{ bg: 'gray.700' }}
            borderRadius="md"
            p={4}
            mb={5}
          >
            <Text fontSize="sm" fontWeight="semibold" mb={3}>
              {editing ? `Editing: ${editing.name}` : 'Add manufacturer'}
            </Text>
            <Flex gap={3} alignItems="flex-end" flexWrap="wrap">
              <FormControl isInvalid={!!errors.name} flex="1" minW="160px">
                <FormLabel fontSize="sm" mb={1}>
                  Name
                </FormLabel>
                <Input
                  id="name"
                  size="sm"
                  value={values.name}
                  onChange={handleChange}
                  placeholder="e.g. Cessna"
                />
                {errors.name && (
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                isInvalid={!!errors.uploaded_file}
                flex="2"
                minW="200px"
              >
                <FormLabel fontSize="sm" mb={1}>
                  Logo{' '}
                  <Text as="span" fontWeight="normal" color="gray.400">
                    (optional, PNG/JPG)
                  </Text>
                </FormLabel>
                {editing?.logo_url && !file && (
                  <Image
                    src={editing.logo_url}
                    h="20px"
                    objectFit="contain"
                    mb={1}
                  />
                )}
                <Input
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  size="sm"
                  onChange={(e) => setFile(e.target.files[0] ?? null)}
                  sx={{
                    '::file-selector-button': {
                      height: 8,
                      padding: 0,
                      mr: 3,
                      background: 'none',
                      border: 'none',
                      fontWeight: 'bold',
                    },
                  }}
                />
                {errors.uploaded_file && (
                  <FormErrorMessage>{errors.uploaded_file}</FormErrorMessage>
                )}
              </FormControl>

              <Flex gap={2} pb={errors.name || errors.logo_url ? '24px' : '0'}>
                <Button type="submit" size="sm" colorScheme="orange">
                  {editing ? 'Save' : 'Add'}
                </Button>
                {editing && (
                  <IconButton
                    size="sm"
                    variant="ghost"
                    aria-label="Cancel edit"
                    icon={<X size={14} />}
                    onClick={handleCancelEdit}
                  />
                )}
              </Flex>
            </Flex>
          </Box>

          {/* Manufacturers table */}
          <TableContainer>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Logo</Th>
                  <Th>Name</Th>
                  <Th isNumeric>Fleet types</Th>
                  <Th />
                </Tr>
              </Thead>
              <Tbody>
                {manufacturers.map((m) => (
                  <Tr
                    key={m.id}
                    bg={editing?.id === m.id ? 'orange.50' : undefined}
                    _dark={{
                      bg: editing?.id === m.id ? 'orange.900' : undefined,
                    }}
                  >
                    <Td>
                      {m.logo_url ? (
                        <Image src={m.logo_url} h="20px" objectFit="contain" />
                      ) : (
                        <Text fontSize="xs" color="gray.400">
                          —
                        </Text>
                      )}
                    </Td>
                    <Td>{m.name}</Td>
                    <Td isNumeric>{m.fleet_count}</Td>
                    <Td>
                      <Flex gap={1} justifyContent="flex-end">
                        <IconButton
                          size="xs"
                          variant="ghost"
                          aria-label="Edit"
                          icon={<Icon as={Pen} boxSize={3.5} />}
                          onClick={() => handleEdit(m)}
                        />
                        <Tooltip
                          label={
                            m.fleet_count > 0
                              ? 'In use — cannot delete'
                              : 'Delete'
                          }
                          placement="top"
                          hasArrow
                        >
                          <Box>
                            <IconButton
                              size="xs"
                              variant="ghost"
                              colorScheme="red"
                              aria-label="Delete"
                              icon={<Icon as={Trash2} boxSize={3.5} />}
                              isDisabled={m.fleet_count > 0}
                              onClick={() => handleDelete(m)}
                            />
                          </Box>
                        </Tooltip>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
                {manufacturers.length === 0 && (
                  <Tr>
                    <Td colSpan={4}>
                      <Text
                        color="gray.400"
                        fontSize="sm"
                        textAlign="center"
                        py={2}
                      >
                        No manufacturers yet
                      </Text>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </ModalBody>

        <ModalFooter>
          <Button size="sm" variant="ghost" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ManufacturerDialog
