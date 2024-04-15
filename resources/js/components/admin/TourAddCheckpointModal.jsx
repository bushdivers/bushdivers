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
import axios from 'axios'
import React, { useState } from 'react'

const TourAddFleetModal = ({ isOpen, onClose, tourId }) => {
  const [checkpoint, setCheckpoint] = useState('')
  const [airport, setAirport] = useState('')
  const [error, setError] = useState('')

  async function handleChange(e) {
    setError(null)
    setAirport(null)

    if (e.target.value !== '' && e.target.value.length > 2) {
      const response = await axios.get(`/api/airport/search/${e.target.value}`)
      if (response.data.airport) {
        setAirport(
          `${response.data.airport.identifier} - ${response.data.airport.name}`
        )
        setCheckpoint(e.target.value)
      } else {
        setError('Airport not found')
      }
    }
  }

  function save() {
    setError('')
    if (checkpoint === '') {
      setError('Checkpoint cannot be empty')
      return
    }
    if (airport === '') {
      setError('Airport not found')
      return
    }
    onClose()
    router.post(`/admin/tours/${tourId}/checkpoint`, {
      checkpoint,
      tour: tourId,
    })
    setAirport('')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose()
        setError('')
        setAirport('')
        setCheckpoint('')
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
          {airport && <Text>{airport}</Text>}
        </ModalBody>

        <ModalFooter>
          <Button isDisabled={!checkpoint} onClick={() => save()} mr={3}>
            Save
          </Button>
          <Button
            colorScheme="gray"
            onClick={() => {
              onClose()
              setError('')
              setAirport('')
              setCheckpoint('')
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
