import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
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
  Radio,
  RadioGroup,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { router, usePage } from '@inertiajs/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const BaseAirportDialog = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { errors } = usePage().props
  const [icao, setIcao] = useState('')
  const [target, setTarget] = useState('')
  const [airport, setAirport] = useState(null)
  const [searchError, setSearchError] = useState(null)

  useEffect(() => {
    if (!isOpen) {
      setIcao('')
      setTarget('')
      setAirport(null)
      setSearchError(null)
    }
  }, [isOpen])

  const search = async (code) => {
    setTarget('')
    setSearchError(null)
    try {
      const { data } = await axios.get('/admin/airports/base/search', {
        params: { icao: code },
      })
      setAirport(data)
    } catch (err) {
      setAirport(null)
      setSearchError(err.response?.data?.error ?? 'Search failed')
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    search(icao)
  }

  const handleToggle = () => {
    router.post(
      '/admin/airports/base/toggle',
      { icao: airport.identifier, reassign_to: target || null },
      {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => search(airport.identifier),
      }
    )
  }

  const aircraftCount = airport
    ? airport.current_aircraft_count + airport.home_aircraft_count
    : 0
  const needsTarget = airport && !airport.closed && aircraftCount > 0

  return (
    <>
      <Button onClick={onOpen} size="sm" variant="outline">
        Base Airport Edit
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Base Airport Edit</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box as="form" onSubmit={handleSearch} mb={4}>
              <FormControl>
                <FormLabel fontSize="sm">ICAO</FormLabel>
                <HStack>
                  <Input
                    value={icao}
                    onChange={(e) => setIcao(e.target.value.toUpperCase())}
                    placeholder="e.g. YSSY"
                  />
                  <Button type="submit" isDisabled={!icao.trim()}>
                    Search
                  </Button>
                </HStack>
              </FormControl>
            </Box>

            {searchError && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                {searchError}
              </Alert>
            )}

            {airport && (
              <Stack spacing={3}>
                <HStack justify="space-between">
                  <Text fontWeight="bold">
                    {airport.identifier} - {airport.name} (size {airport.size})
                  </Text>
                  <Badge colorScheme={airport.closed ? 'red' : 'green'}>
                    {airport.closed ? 'Closed' : 'Open'}
                  </Badge>
                </HStack>

                {!airport.closed && (
                  <FormControl isInvalid={!!errors?.reassign_to}>
                    <Text fontSize="sm" mb={2}>
                      {airport.current_aircraft_count} aircraft located here,{' '}
                      {airport.home_aircraft_count} based here. Choose where to
                      move them:
                    </Text>
                    <RadioGroup value={target} onChange={setTarget}>
                      <Stack>
                        {airport.nearest.map((a) => (
                          <Radio key={a.id} value={String(a.id)}>
                            {a.identifier} - {a.name} (size {a.size}, {a.distance} nm)
                          </Radio>
                        ))}
                      </Stack>
                    </RadioGroup>
                    <FormErrorMessage>{errors?.reassign_to}</FormErrorMessage>
                  </FormControl>
                )}
              </Stack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            {airport && (
              <Button
                colorScheme={airport.closed ? 'green' : 'red'}
                onClick={handleToggle}
                isDisabled={needsTarget && !target}
              >
                {airport.closed ? 'Reopen airport' : 'Close airport'}
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default BaseAirportDialog
