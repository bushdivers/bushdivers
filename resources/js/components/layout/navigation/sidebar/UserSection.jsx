import { Avatar, Box, Link as ChakraLink, Flex, Text } from '@chakra-ui/react'
import { Link as InertiaLink, usePage } from '@inertiajs/react'
import React from 'react'

import UserStats from '../UserStats'

const UserSection = () => {
  const { auth } = usePage().props
  return (
    <Box my={4}>
      <Flex justifyContent="space-between" alignItems="center" gap={3}>
        <Flex alignItems="center" gap={3}>
          <ChakraLink href="/profile" as={InertiaLink}>
            <Avatar size="sm" name={auth.user.name} />
          </ChakraLink>
          <Box>
            <Text as="b">{auth.user.pilot_id}</Text>
            <Text fontSize="xs">{auth.user.rank.name}</Text>
          </Box>
        </Flex>
        <ChakraLink href="/logout" as={InertiaLink}>
          <Text fontSize="sm">Sign out</Text>
        </ChakraLink>
      </Flex>
      <Box mt={4}>
        <UserStats />
      </Box>
      <Box mt={2}>
        <Flex justifyContent="center">
          <ChakraLink color="orange.400" href="/jumpseat" as={InertiaLink}>
            <Text fontSize="xs">Jumpseat</Text>
          </ChakraLink>
        </Flex>
      </Box>
    </Box>
  )
}

export default UserSection
