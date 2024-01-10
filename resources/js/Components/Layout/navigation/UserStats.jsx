import { Flex, Text } from '@chakra-ui/react'
import React from 'react'

const UserStats = () => {
  return (
    <Flex px={4} justifyContent="space-between" gap={2}>
      <Text fontSize="xs">$34,998</Text>
      <Text fontSize="xs">KEUG</Text>
    </Flex>
  )
}

export default UserStats
