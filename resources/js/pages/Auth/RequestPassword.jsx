import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Image,
  Input,
  Text,
} from '@chakra-ui/react'
import { router, usePage } from '@inertiajs/react'
import React, { useState } from 'react'

import AuthLayout from '../../components/layout/AuthLayout'

const RequestPassword = () => {
  const { errors } = usePage().props
  const [values, setValues] = useState({
    email: '',
  })

  function handleChange(e) {
    const key = e.target.id
    const value = e.target.value
    setValues((values) => ({
      ...values,
      [key]: value,
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    router.post('/password', values)
  }

  return (
    <Flex direction="column" justifyContent="center" alignItems="center">
      <Box my={8}>
        <Image
          src="https://res.cloudinary.com/dji0yvkef/image/upload/v1628691598/BDLogo.png"
          boxSize={32}
        />
      </Box>
      <Card>
        <CardHeader>
          <Heading size="lg">Request password</Heading>
        </CardHeader>
        <CardBody>
          <FormControl my={2} isInvalid={errors?.email}>
            <FormLabel>
              <Text>Email address</Text>
            </FormLabel>
            <Input
              value={values.email}
              type="email"
              id="email"
              placeholder="Email"
              onChange={handleChange}
            />
            <FormErrorMessage>{errors?.email}</FormErrorMessage>
          </FormControl>
          <Button width="100%" onClick={(e) => handleSubmit(e)}>
            Request password
          </Button>
        </CardBody>
      </Card>
    </Flex>
  )
}

RequestPassword.layout = (page) => (
  <AuthLayout children={page} title="Request Password" />
)

export default RequestPassword
