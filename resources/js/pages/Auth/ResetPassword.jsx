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

const ResetPassword = ({ token, email }) => {
  const { errors } = usePage().props
  const [values, setValues] = useState({
    password: '',
    email: email,
    token: token,
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
    router.post('/password/reset', values)
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
          <Heading size="lg">Reset Password</Heading>
        </CardHeader>
        <CardBody>
          <FormControl my={2} isInvalid={errors?.password}>
            <FormLabel>
              <Text>Password</Text>
            </FormLabel>
            <Input
              value={values.password}
              type="password"
              id="password"
              placeholder="Enter new password"
              onChange={handleChange}
            />
            <FormErrorMessage>{errors?.password}</FormErrorMessage>
          </FormControl>
          <Button width="100%" onClick={(e) => handleSubmit(e)}>
            Reset password
          </Button>
        </CardBody>
      </Card>
    </Flex>
  )
}

ResetPassword.layout = (page) => (
  <AuthLayout children={page} title="Reset Password" />
)

export default ResetPassword
