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
  Text,
} from '@chakra-ui/react'
import { router, usePage } from '@inertiajs/react'
import React, { useState } from 'react'

import AppLayout from '../../components/layout/AppLayout'

const Submission = () => {
  const { errors } = usePage().props
  const [values, setValues] = useState({
    pirep_id: null,
    fuel_used: null,
    distance: null,
    flight_time_mins: null,
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
    router.post('/pireps/submit', values)
  }

  return (
    <Box>
      <Text>
        This page is for submitting pireps manually, in case Bush Tracker is
        unable to submit a pirep. All submission will be reviewed by management
      </Text>
      <Box mt={2} w={450}>
        <Card>
          <CardBody>
            <Box>
              <form onSubmit={handleSubmit}>
                <FormControl isInvalid={errors?.pirep_id}>
                  <FormLabel>Pirep Id</FormLabel>
                  <Input
                    id="pirep_id"
                    value={values.pirep_id}
                    type="text"
                    onChange={handleChange}
                  />
                  <FormErrorMessage>{errors?.pirep_id}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors?.fuel_used}>
                  <FormLabel>Fuel Used (gal)</FormLabel>
                  <Input
                    id="fuel_used"
                    value={values.fuel_used}
                    type="text"
                    onChange={handleChange}
                  />
                  <FormErrorMessage>{errors?.fuel_used}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors?.distance}>
                  <FormLabel>Distance (nm)</FormLabel>
                  <Input
                    id="distance"
                    value={values.distance}
                    type="text"
                    onChange={handleChange}
                  />
                  <FormErrorMessage>{errors?.distance}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors?.flight_time_mins}>
                  <FormLabel>Flight Time (mins)</FormLabel>
                  <Input
                    id="flight_time_mins"
                    value={values.flight_time_mins}
                    type="text"
                    onChange={handleChange}
                  />
                  <FormErrorMessage>
                    {errors?.flight_time_mins}
                  </FormErrorMessage>
                </FormControl>
                <Flex justifyContent="end">
                  <Button mt={2} type="submit">
                    Submit Pirep for Review
                  </Button>
                </Flex>
              </form>
            </Box>
          </CardBody>
        </Card>
      </Box>
    </Box>
  )
}

Submission.layout = (page) => (
  <AppLayout
    children={page}
    title="Submit Pirep"
    heading="Submit Manual Pirep"
  />
)

export default Submission
