import { Box, Flex } from '@chakra-ui/react'
import React from 'react'

export default function NoContent({ content }) {
  return (
    <Box py={3}>
      <Flex direction="column" alignItems="center" justifyContent="center">
        {content}
      </Flex>
    </Box>
  )
}
