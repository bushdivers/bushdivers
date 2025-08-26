import {
  Button,
  Card,
  CardBody,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Select,
  VStack,
} from '@chakra-ui/react'
import { router, usePage } from '@inertiajs/react'
import React, { useState } from 'react'

import AdminLayout from '../../components/layout/AdminLayout'

const CreateContract = () => {
  const { errors } = usePage().props
  const [formData, setFormData] = useState({
    source_airport_id: '',
    destination_airport_id: '',
    cargo_qty: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    router.post('/admin/dispatch', formData, {
      onSuccess: () => {
        setFormData({
          startAirport: '',
          endAirport: '',
          cargoQuantity: '',
          jobType: 'cargo',
        })
      },
    })
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  return (
    <Card>
      <CardBody>
        <form onSubmit={handleSubmit}>
          <VStack spacing={6} align="stretch">
            <FormControl>
              <FormLabel>Job Type</FormLabel>
              <Select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
              >
                <option value="cargo">Cargo</option>({' '}
                {false && <option value="passenger">Passenger</option>} )
              </Select>
            </FormControl>

            <FormControl isRequired isInvalid={errors.source_airport_id}>
              <FormLabel>Start Airport</FormLabel>
              <Input
                type="text"
                id="source_airport_id"
                value={formData.source_airport_id}
                onChange={handleChange}
                placeholder="Enter origin airport ICAO"
              />{' '}
              {errors.source_airport_id && (
                <FormErrorMessage>{errors.source_airport_id}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isRequired isInvalid={errors.destination_airport_id}>
              <FormLabel>End Airport</FormLabel>
              <Input
                type="text"
                id="destination_airport_id"
                value={formData.destination_airport_id}
                onChange={handleChange}
                placeholder="Enter destination airport ICAO"
              />{' '}
              {errors.destination_airport_id && (
                <FormErrorMessage>
                  {errors.destination_airport_id}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl isRequired isInvalid={errors.cargo_qty}>
              <FormLabel>Cargo Quantity (lbs)</FormLabel>
              <Input
                type="number"
                id="cargo_qty"
                value={formData.cargo_qty}
                onChange={handleChange}
                min="1"
                placeholder="Enter cargo quantity"
              />{' '}
              {errors.cargo_qty && (
                <FormErrorMessage>{errors.cargo_qty}</FormErrorMessage>
              )}
            </FormControl>

            <HStack justify="flex-end" spacing={4}>
              <Button variant="outline" onClick={() => window.history.back()}>
                Cancel
              </Button>
              <Button type="submit" loadingText="Creating...">
                Create Contract
              </Button>
            </HStack>
          </VStack>
        </form>
      </CardBody>
    </Card>
  )
}

CreateContract.layout = (page) => (
  <AdminLayout
    children={page}
    heading="Contract Management"
    subHeading="Add new contract"
  />
)

export default CreateContract
