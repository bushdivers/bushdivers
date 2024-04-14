import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react'
import { router } from '@inertiajs/react'
import React, { useState } from 'react'

const TourAddFleetModal = ({ isOpen, onClose, tourId }) => {
  const [checkpoint, setCheckpoint] = useState('')
  const [error, setError] = useState('')

  function handleChange(e) {
    setCheckpoint(e.target.value)
  }

  function save() {
    setError('')
    if (checkpoint === '') {
      setError('Checkpoint cannot be empty')
      return
    }
    onClose()
    router.post(`/admin/tours/${tourId}/checkpoint`, {
      checkpoint,
      tour: tourId,
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose()
        setError('')
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Checkpoint (ICAO)</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {error && <Text color="red.500">{error}</Text>}
          <FormControl>
            <FormLabel>Checkpoint ICAO</FormLabel>
            <Input id="checkpoint" onChange={handleChange} />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button onClick={() => save()} mr={3}>
            Save
          </Button>
          <Button
            colorScheme="gray"
            onClick={() => {
              onClose()
              setError('')
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default TourAddFleetModal
