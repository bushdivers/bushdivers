import React, { useState } from 'react'
import { Inertia } from '@inertiajs/inertia'
import { usePage } from '@inertiajs/inertia-react'
import LayoutAuth from '../../Shared/LayoutAuth'
import { Flex, Box, Input, Card, CardHeader, CardBody, Heading, Image, FormControl, FormLabel, Button, FormErrorMessage, Text } from '@chakra-ui/react'

const ResetPassword = ({ token }) => {
  const { errors } = usePage().props
  console.log(errors)
  const [values, setValues] = useState({
    password: '',
    token: token
  })

  function handleChange (e) {
    const key = e.target.id
    const value = e.target.value
    setValues(values => ({
      ...values,
      [key]: value
    }))
  }

  function handleSubmit (e) {
    e.preventDefault()
    Inertia.post('/password/reset', values)
  }

  return (
    <Flex direction="column" justifyContent="center" alignItems="center">
      <Box my={8}><Image src="https://res.cloudinary.com/dji0yvkef/image/upload/v1628691598/BDLogo.png" boxSize={32}/></Box>
      <Card>
        <CardHeader><Heading size="lg">Request Password</Heading></CardHeader>
        <CardBody>
        <FormControl my={2} isInvalid={errors?.password}>
          <FormLabel><Text>Password</Text></FormLabel>
          <Input value={values.password} type="password" id="password" placeHolder="Enter new password" onChange={handleChange} />
          <FormErrorMessage>{errors?.password}</FormErrorMessage>
        </FormControl>
          <Button width="100%" onClick={(e) => handleSubmit(e)}>Reset password</Button>
        </CardBody>
      </Card>
    </Flex>
  )
}

ResetPassword.layout = page => <LayoutAuth children={page} title="Reset Password" />

export default ResetPassword
