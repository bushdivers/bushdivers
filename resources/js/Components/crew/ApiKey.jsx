import { Box, Heading, Text } from '@chakra-ui/react'
import React, { useState } from 'react'

const ApiKey = ({ apiKey }) => {
  const [show, setShow] = useState(false)

  function showKey() {
    setShow(!show)
    navigator.clipboard.writeText(apiKey)
  }

  return (
    <Box>
      <Heading size="md">
        Bush Tracker Key{' '}
        <Text fontSize="xs">(click to display key and copy to clipboard)</Text>
      </Heading>
      <Box cursor="pointer" mt={2} onClick={showKey}>
        {show ? apiKey : '***************'}
      </Box>
    </Box>
  )
}

export default ApiKey
