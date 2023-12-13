import React, { useState } from 'react'
import { Inertia } from '@inertiajs/inertia'
import { Link, usePage } from '@inertiajs/inertia-react'
import LayoutAuth from '../../Shared/LayoutAuth'
import { Flex, Box, Input, Card, CardHeader, CardBody, Heading, Link as ChakraLink, Image, FormControl, FormLabel, Button, FormErrorMessage, Text } from '@chakra-ui/react'

const Login = () => {
  const { errors } = usePage().props
  const [values, setValues] = useState({
    email: '',
    password: '',
    remember: false
  })

  function handleChange (e) {
    const key = e.target.id
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setValues(values => ({
      ...values,
      [key]: value
    }))
  }

  function handleSubmit (e) {
    e.preventDefault()
    Inertia.post('/login', values)
  }

  return (
    <Flex direction="column" justifyContent="center" alignItems="center">
      <Box my={8}><Image src="https://res.cloudinary.com/dji0yvkef/image/upload/v1628691598/BDLogo.png" boxSize={32}/></Box>
      <Card>
        <CardHeader><Heading size="lg">Login</Heading></CardHeader>
        <CardBody>
        <FormControl my={2} isInvalid={errors?.email}>
          <FormLabel><Text>Email address</Text></FormLabel>
          <Input value={values.email} type="email" id="email" placeHolder="Email" onChange={handleChange} />
          <FormErrorMessage>{errors?.email}</FormErrorMessage>
        </FormControl>
        <FormControl my={2} isInvalid={errors?.password}>
          <FormLabel><Text>Password</Text></FormLabel>
          <Input value={values.password} type="password" id="password" placeHolder="Password" onChange={handleChange} />
          <FormErrorMessage>{errors?.password}</FormErrorMessage>
        </FormControl>
          <Flex mb={4} justifyContent="right"><ChakraLink as={Link} href="/password"><Text size="xs">Forgotten password?</Text></ChakraLink></Flex>
          <Button width="100%" onClick={(e) => handleSubmit(e)}>Login</Button>
        </CardBody>
      </Card>
      <Box className="mt-2">
          <ChakraLink as={Link} href="/register">New to Bush Divers?</ChakraLink>
        </Box>
    </Flex>
  )
}

Login.layout = page => <LayoutAuth children={page} title="Login" />

export default Login
