import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Image,
  Text,
} from '@chakra-ui/react'
import React from 'react'

const Error = ({ status = 500 }) => {
  const title = {
    403: 'Forbidden',
    404: 'Page Not Found',
    500: 'Server Error',
    503: 'Service Unavailable',
  }[status]

  const message = {
    403: 'Sorry, you are not authorized to access this page.',
    404: 'Sorry, the page you are looking for could not be found.',
    500: 'Whoops, something went wrong on our side.',
    503: 'Sorry, the service is unavailable.',
  }[status]

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
          <Heading size="lg">{title}</Heading>
        </CardHeader>
        <CardBody>
          {message}
          {status === 500 && (
            <Text marginTop={3}>Our maintenance crew have been notified.</Text>
          )}
          <Text marginTop={3}>
            If you continue to have issues, reach out on Discord.
          </Text>
        </CardBody>
        <CardBody>
          <Text>
            <a href="/dashboard">Return to home</a>
          </Text>
        </CardBody>
      </Card>
    </Flex>
  )
}

export default Error
