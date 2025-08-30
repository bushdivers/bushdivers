import {
  Avatar,
  Box,
  Card,
  Link as ChakraLink,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { Link as InertiaLink, usePage } from '@inertiajs/react'
import { Anchor, Package } from 'lucide-react'
import React from 'react'

import { displayNumber } from '../../../../helpers/number.helpers'

const UserSection = () => {
  const bg = useColorModeValue('gray.50', 'gray.600')
  const { auth } = usePage().props
  return (
    <Menu>
      <MenuButton _hover={{ bg: bg, cursor: 'pointer' }} as={Card} p={2} my={4}>
        <Flex alignItems="center" justifyContent="space-between" gap={3}>
          <Box>
            <Flex alignItems="center" gap={3}>
              <Avatar size="sm" name={auth.user.name} />
              <Box>
                <Text as="b">{auth.user.pilot_id}</Text>
                <Text fontSize="xs">{auth.user.rank.name}</Text>
              </Box>
            </Flex>
          </Box>
          <Box>
            <Flex direction="column" align="flex-end">
              <Text fontSize="xs">${displayNumber(auth.user.balance)}</Text>
              <Text fontSize="xs">
                {auth.user.location.longest_runway_surface === 'W' && (
                  <Icon as={Anchor} color="blue.500" />
                )}
                {auth.user.location.is_thirdparty && (
                  <Icon as={Package} color="green.500" />
                )}
                {auth.user.location.identifier}
              </Text>
            </Flex>
          </Box>
        </Flex>
      </MenuButton>
      <MenuList>
        <ChakraLink href="/profile" as={InertiaLink}>
          <MenuItem>Profile</MenuItem>
        </ChakraLink>
        <ChakraLink href="/jumpseat" as={InertiaLink}>
          <MenuItem>Jumpseat</MenuItem>
        </ChakraLink>
        <ChakraLink
          href={'/airports/' + auth.user.location.identifier}
          as={InertiaLink}
        >
          <MenuItem>Current Airport</MenuItem>
        </ChakraLink>
        <MenuDivider />
        <ChakraLink href="/logout" as={InertiaLink}>
          <MenuItem>Sign Out</MenuItem>
        </ChakraLink>
      </MenuList>
      {/* <Flex justifyContent="space-between" alignItems="center" gap={3}>
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
      </Box> */}
    </Menu>
  )
}

export default UserSection
