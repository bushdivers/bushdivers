import { Box, Flex } from '@chakra-ui/react'
import React from 'react'

const ChatContainer = ({ children, side = 'left' }) => {
  return (
    <Flex mt={4} justify={`${side === 'left' ? 'flex-start' : 'flex-end'}`}>
      <Box>
        <Flex gap={2} alignItems="start">
          {children}
        </Flex>
      </Box>
    </Flex>
  )
}

export default ChatContainer
