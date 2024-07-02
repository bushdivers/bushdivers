import {
  Button,
  Flex,
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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Text,
} from '@chakra-ui/react'
import { router } from '@inertiajs/react'
import axios from 'axios'
import React, { useState } from 'react'

const CreateHubDetail = ({ isOpen, onClose, fleet }) => {
  const [availableFleet, setAvailableFleet] = useState(fleet)
  const [newHubError, setNewHubError] = useState(null)
  const [airportError, setAirportError] = useState(null)
  const [identifier, setIdentifier] = useState('')
  const [airport, setAirport] = useState('')
  const [selectedFleet, setSelectedFleet] = useState(null)
  const [selectedQty, setSelectedQty] = useState(0)
  const [aircraft, setAircraft] = useState([])

  async function handleAirportChange(e) {
    if (e.target.value.length >= 3) {
      const response = await axios.get(`/api/airport/search/${e.target.value}`)
      if (response.data.airport) {
        setAirport(
          `${response.data.airport.identifier} - ${response.data.airport.name}`
        )
        setIdentifier(response.data.airport.identifier)
        setAirportError(null)
      } else {
        setAirportError('No airport found')
      }
    }
  }
  function handleFleetChange(e) {
    setSelectedFleet(e.target.value)
  }

  function handleQtyChange(value) {
    setSelectedQty(value)
  }

  function addFleet() {
    if (selectedFleet && selectedQty > 0) {
      const fleetDetail = fleet.filter((f) => f.id === parseInt(selectedFleet))
      setAircraft([
        ...aircraft,
        {
          name: fleetDetail[0].name,
          fleet_id: selectedFleet,
          qty: selectedQty,
        },
      ])
      setSelectedQty(0)
      setSelectedFleet(null)
      setAvailableFleet(
        availableFleet.filter((f) => f.id !== parseInt(selectedFleet))
      )
    }
  }

  function save() {
    router.post('/admin/hubs/create', { identifier, aircraft })
  }

  function closeForm() {
    setNewHubError(null)
    setAirportError(null)
    setIdentifier('')
    setAirport('')
    setSelectedFleet(null)
    setSelectedQty(0)
    setAircraft([])
    setAvailableFleet(fleet)
    onClose()
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          closeForm()
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Fleet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {newHubError ? <Text color="red.500">{newHubError}</Text> : null}
            <FormControl>
              <FormLabel>Airport</FormLabel>
              <Input onChange={handleAirportChange} id="identifier" />
              {airport && (
                <Text color="green.300" size="sm" mt={1}>
                  {airport}
                </Text>
              )}
              {airportError && (
                <Text size="sm" color="red.300" mt={1}>
                  {airportError}
                </Text>
              )}
            </FormControl>
            <FormLabel mt={2}>Add Fleet Aircraft</FormLabel>
            <Flex gap={2}>
              <FormControl>
                <Select onChange={handleFleetChange}>
                  <option value="">Select Fleet</option>
                  {availableFleet.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <NumberInput
                  defaultValue={0}
                  min={0}
                  onChange={handleQtyChange}
                  id="qty"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <Button onClick={() => addFleet()} mr={3}>
                Add
              </Button>
            </Flex>
            {aircraft &&
              aircraft.map((ac) => (
                <Text key={ac.fleet_id}>
                  {ac.name} x {ac.qty}
                </Text>
              ))}
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => save()} mr={3}>
              Save
            </Button>
            <Button
              colorScheme="gray"
              onClick={() => {
                closeForm()
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreateHubDetail
