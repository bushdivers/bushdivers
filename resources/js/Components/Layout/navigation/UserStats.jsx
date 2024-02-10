import { Link as ChakraLink, Flex, Text } from '@chakra-ui/react'
import { Link as InertiaLink, usePage } from '@inertiajs/react'
import React from 'react'

import { displayNumber } from '../../../Helpers/number.helpers.js'

const UserStats = () => {
  const { auth } = usePage().props
  return (
    <Flex px={4} justifyContent="space-between" gap={2}>
      <Flex direction="column">
        <Text fontSize="xs">${displayNumber(auth.user.balance)}</Text>
        <Text fontSize="xs">XP {displayNumber(auth.user.points, false)}</Text>
      </Flex>
      <ChakraLink
        as={InertiaLink}
        href={`/airports/${auth.user.current_airport_id}`}
      >
        <Text fontSize="xs">{auth.user.current_airport_id}</Text>
      </ChakraLink>
    </Flex>
  )
}

export default UserStats
