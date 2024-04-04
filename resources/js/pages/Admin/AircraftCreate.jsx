import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
} from '@chakra-ui/react'
import { router, usePage } from '@inertiajs/react'
import React, { useState } from 'react'

import AdminLayout from '../../components/layout/AdminLayout.jsx'

const AircraftCreate = ({ fleet, hubs, fleetId }) => {
  const { errors } = usePage().props
  const [values, setValues] = useState({
    fleet: fleetId > 0 ? fleetId : '1',
    registration: '',
    deliveryIcao: '',
    hub: 'AYMR',
  })

  function handleChange(e) {
    const key = e.target.id
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setValues((values) => ({
      ...values,
      [key]: value,
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    router.post('/admin/aircraft/create', values)
  }

  return (
    <Card>
      <CardBody>
        <Box w="50%">
          <form onSubmit={handleSubmit}>
            <FormControl isInvalid={errors.fleet}>
              <FormLabel htmlFor="fleet">Fleet type</FormLabel>
              <Select
                id="fleet"
                value={values.fleet}
                onChange={handleChange}
                className="select"
              >
                {fleet.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.type}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.fleet}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.registration}>
              <FormLabel htmlFor="registration">Registration</FormLabel>
              <Input
                id="registration"
                value={values.registration}
                onChange={handleChange}
                type="text"
              />
              <FormErrorMessage>{errors.registration}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.deliveryIcao}>
              <FormLabel htmlFor="deliveryIcao">Start location</FormLabel>
              <Input
                id="deliveryIcao"
                value={values.deliveryIcao}
                onChange={handleChange}
                type="text"
              />
              <FormErrorMessage>{errors.deliveryIcao}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.hub}>
              <FormLabel htmlFor="hub">Hub location</FormLabel>
              <Select id="hub" value={values.hub} onChange={handleChange}>
                {hubs.map((hub) => (
                  <option key={hub.identifier} value={hub.identifier}>
                    {hub.identifier}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.hub}</FormErrorMessage>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="cost">Cost</FormLabel>
              <Input
                id="cost"
                value={values.cost}
                onChange={handleChange}
                type="number"
              />
            </FormControl>
            <Flex justifyContent="right">
              <Button type="submit" mt={2}>
                Create Aircraft
              </Button>
            </Flex>
          </form>
        </Box>
      </CardBody>
    </Card>
  )
}

AircraftCreate.layout = (page) => (
  <AdminLayout
    children={page}
    title="Admin - Create Aircraft"
    heading="Create New Aircraft"
  />
)

export default AircraftCreate
