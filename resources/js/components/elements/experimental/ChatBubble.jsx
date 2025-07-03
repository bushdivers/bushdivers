import { Box, Text, useColorModeValue } from '@chakra-ui/react'
import React from 'react'

const ChatBubble = ({ children, side = 'left', isUser = false }) => {
  const bg = isUser
    ? useColorModeValue('gray.100', 'gray.600')
    : useColorModeValue('orange.100', 'orange.600')
  return (
    <Box
      style={{ width: 'fit-content' }}
      maxWidth="65%"
      p={3}
      bgColor={bg}
      borderTopLeftRadius={`${side === 'left' ? 0 : 8}`}
      borderTopRightRadius={`${side === 'right' ? 0 : 8}`}
      borderBottomRightRadius={8}
      borderBottomLeftRadius={8}
    >
      <Text fontSize="sm">{children}</Text>
    </Box>
  )
}

export default ChatBubble
