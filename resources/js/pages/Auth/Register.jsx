import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Link as ChakraLink,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Image,
  Input,
  Text,
} from '@chakra-ui/react'
import { Link, router, usePage } from '@inertiajs/react'
import React, { useState } from 'react'

import AuthLayout from '../../components/layout/AuthLayout'

const Register = () => {
  const { errors } = usePage().props
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    agree: false,
    optin: false,
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
    router.post('/register', values)
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
          <Heading size="lg">Register</Heading>
        </CardHeader>
        <CardBody>
          <FormControl my={2} isInvalid={errors?.name}>
            <FormLabel>
              <Text>Name</Text>
            </FormLabel>
            <Input
              value={values.name}
              type="text"
              id="name"
              placeholder="Name"
              onChange={handleChange}
            />
            <FormErrorMessage>{errors?.name}</FormErrorMessage>
          </FormControl>
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
          <FormControl my={2} isInvalid={errors?.password}>
            <FormLabel>
              <Text>Password</Text>
            </FormLabel>
            <Input
              value={values.password}
              type="password"
              id="password"
              placeholder="Password"
              onChange={handleChange}
            />
            <FormErrorMessage>{errors?.password}</FormErrorMessage>
          </FormControl>
          <Button width="100%" onClick={(e) => handleSubmit(e)}>
            Register
          </Button>
        </CardBody>
      </Card>
      <Box className="mt-2">
        <ChakraLink as={Link} href="/login">
          Already have an account?
        </ChakraLink>
      </Box>
    </Flex>
  )
}

Register.layout = (page) => <AuthLayout children={page} title="Register" />

export default Register
