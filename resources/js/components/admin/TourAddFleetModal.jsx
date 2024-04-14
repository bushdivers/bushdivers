import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
} from '@chakra-ui/react'
import { router } from '@inertiajs/react'
import React, { useState } from 'react'

const TourAddFleetModal = ({ isOpen, onClose, fleet, tourId }) => {
  const [aircraft, setAircraft] = useState(fleet[0].id)
  const [error, setError] = useState('')

  function handleChange(e) {
    setAircraft(e.target.value)
  }

  function save() {
    setError('')
    if (aircraft === '') {
      setError('Aircraft cannot be empty')
      return
    }

    router.post(`/admin/tours/${tourId}/fleet`, {
      fleet: aircraft,
      tour: tourId,
    })
    onClose()
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
        <ModalHeader>Select Fleet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {error && <Text color="red.500">{error}</Text>}
          <FormControl>
            <FormLabel>Fleet</FormLabel>
            <Select onChange={handleChange}>
              {fleet.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </Select>
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
