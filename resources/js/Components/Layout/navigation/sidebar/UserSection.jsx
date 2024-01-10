import { Avatar, Box, Link as ChakraLink, Flex, Text } from '@chakra-ui/react'
import { Link as InertiaLink } from '@inertiajs/inertia-react'
import React from 'react'

import UserStats from '../UserStats'

const UserSection = () => {
  return (
    <Box my={4}>
      <Flex justifyContent="space-between" alignItems="center" gap={3}>
        <Flex alignItems="center" gap={3}>
          <Avatar size="sm" />
          <Box>
            <Text as="b">BDV00001</Text>
            <Text fontSize="xs">First Officer</Text>
          </Box>
        </Flex>
        <ChakraLink to="/logout" as={InertiaLink}>
          <Text fontSize="sm">Sign out</Text>
        </ChakraLink>
      </Flex>
      <Box mt={4}>
        <UserStats />
      </Box>
    </Box>
  )
}

export default UserSection
