import React from 'react'
import { Card, CardBody, Box, Text, Heading } from '@chakra-ui/react'

const FlashMessage = props => {
  return (
      <Box mb={2}>
        <Card bg={`${props.type === 'success' ? 'green.200' : 'red.200'}`}>
          <CardBody>
          <Box>
            {props.type === 'success'
              ? <Heading size="sm" color="green.800">Success</Heading>
              : <Heading size="sm" color="red.800">Error</Heading>
            }
          </Box>
            <Box>
            {props.type === 'success'
              ? <Text color="green.700">{props.message}</Text>
              : <Text color="red.700">{props.message}</Text>
          }
          </Box>
          </CardBody>
        </Card>
      </Box>
  )
}

export default FlashMessage
