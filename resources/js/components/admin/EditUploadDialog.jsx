import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  Tag,
} from '@chakra-ui/react'
import { router, usePage } from '@inertiajs/react'
import React, { useEffect, useState } from 'react'

import {
  SimType,
  SimTypeColors,
  SimTypeNames,
} from '../../helpers/simtype.helpers.js'

// upload=null → create mode; upload=object → edit mode
const LiveryDialog = ({ fleetId, upload, isOpen, onClose }) => {
  const { errors } = usePage().props
  const isEdit = upload != null

  const [editValues, setEditValues] = useState({
    display_name: '',
    author: '',
    sim_type: [],
  })
  const [createValues, setCreateValues] = useState({
    display_name: '',
    author: '',
    sim_type: [],
    uploaded_file: null,
    url: '',
  })
  const [sourceType, setSourceType] = useState('file')

  useEffect(() => {
    if (!isOpen) return
    if (isEdit) {
      setEditValues({
        display_name: upload.display_name ?? '',
        author: upload.author ?? '',
        sim_type: upload.sim_type ?? [],
      })
    } else {
      setCreateValues({
        display_name: '',
        author: '',
        sim_type: [],
        uploaded_file: null,
        url: '',
      })
      setSourceType('file')
    }
  }, [isOpen, upload])

  function handleEditSubmit(e) {
    e.preventDefault()
    router.post(`/admin/uploads/${upload.id}`, editValues, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => onClose(),
    })
  }

  function handleCreateSubmit(e) {
    e.preventDefault()
    router.post(`/admin/fleet/${fleetId}/liveries`, createValues, {
      forceFormData: true,
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setCreateValues({
          display_name: '',
          author: '',
          sim_type: [],
          uploaded_file: null,
          url: '',
        })
        onClose()
      },
    })
  }

  function SimTypeCheckboxes({ values, onChange }) {
    return (
      <FormControl>
        <FormLabel>Simulator Support</FormLabel>
        <Flex gap={3}>
          {Object.entries(SimType).map(([, value]) => (
            <Checkbox
              key={value}
              isChecked={values.sim_type.includes(value)}
              onChange={(e) => {
                const next = e.target.checked
                  ? [...values.sim_type, value]
                  : values.sim_type.filter((s) => s !== value)
                onChange(next)
              }}
            >
              <Tag size="sm" colorScheme={SimTypeColors[value] ?? 'gray'}>
                {SimTypeNames[value] ?? value}
              </Tag>
            </Checkbox>
          ))}
        </Flex>
      </FormControl>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEdit ? 'Edit Livery' : 'Add Livery'}</ModalHeader>
        <ModalCloseButton />

        {isEdit ? (
          <form onSubmit={handleEditSubmit}>
            <ModalBody>
              <Flex direction="column" gap={4}>
                <FormControl isInvalid={!!errors.display_name}>
                  <FormLabel>Display Name</FormLabel>
                  <Input
                    value={editValues.display_name}
                    onChange={(e) =>
                      setEditValues((v) => ({
                        ...v,
                        display_name: e.target.value,
                      }))
                    }
                  />
                  {errors.display_name && (
                    <FormErrorMessage>{errors.display_name}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={!!errors.author}>
                  <FormLabel>Author</FormLabel>
                  <Input
                    value={editValues.author}
                    onChange={(e) =>
                      setEditValues((v) => ({ ...v, author: e.target.value }))
                    }
                  />
                  {errors.author && (
                    <FormErrorMessage>{errors.author}</FormErrorMessage>
                  )}
                </FormControl>
                <SimTypeCheckboxes
                  values={editValues}
                  onChange={(next) =>
                    setEditValues((v) => ({ ...v, sim_type: next }))
                  }
                />
              </Flex>
            </ModalBody>
            <ModalFooter gap={2}>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </ModalFooter>
          </form>
        ) : (
          <form onSubmit={handleCreateSubmit}>
            <ModalBody>
              <Flex direction="column" gap={4}>
                <FormControl>
                  <FormLabel>Source</FormLabel>
                  <RadioGroup value={sourceType} onChange={setSourceType}>
                    <Stack direction="row" gap={4}>
                      <Radio value="file">File Upload</Radio>
                      <Radio value="url">External URL</Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>

                {sourceType === 'file' ? (
                  <FormControl isInvalid={!!errors.uploaded_file}>
                    <FormLabel>File</FormLabel>
                    <Input
                      type="file"
                      accept=".zip"
                      onChange={(e) =>
                        setCreateValues((v) => ({
                          ...v,
                          uploaded_file: e.target.files[0],
                        }))
                      }
                      sx={{
                        '::file-selector-button': {
                          height: 10,
                          padding: 0,
                          mr: 4,
                          background: 'none',
                          border: 'none',
                          fontWeight: 'bold',
                        },
                      }}
                    />
                    {errors.uploaded_file && (
                      <FormErrorMessage>
                        {errors.uploaded_file}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                ) : (
                  <FormControl isInvalid={!!errors.url}>
                    <FormLabel>URL</FormLabel>
                    <Input
                      type="url"
                      placeholder="https://flightsim.to/..."
                      value={createValues.url}
                      onChange={(e) =>
                        setCreateValues((v) => ({ ...v, url: e.target.value }))
                      }
                    />
                    {errors.url && (
                      <FormErrorMessage>{errors.url}</FormErrorMessage>
                    )}
                  </FormControl>
                )}

                <FormControl isInvalid={!!errors.display_name}>
                  <FormLabel>Display Name</FormLabel>
                  <Input
                    value={createValues.display_name}
                    onChange={(e) =>
                      setCreateValues((v) => ({
                        ...v,
                        display_name: e.target.value,
                      }))
                    }
                  />
                  {errors.display_name && (
                    <FormErrorMessage>{errors.display_name}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={!!errors.author}>
                  <FormLabel>Author</FormLabel>
                  <Input
                    value={createValues.author}
                    onChange={(e) =>
                      setCreateValues((v) => ({ ...v, author: e.target.value }))
                    }
                  />
                  {errors.author && (
                    <FormErrorMessage>{errors.author}</FormErrorMessage>
                  )}
                </FormControl>
                <SimTypeCheckboxes
                  values={createValues}
                  onChange={(next) =>
                    setCreateValues((v) => ({ ...v, sim_type: next }))
                  }
                />
              </Flex>
            </ModalBody>
            <ModalFooter gap={2}>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Add</Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  )
}

export default LiveryDialog
