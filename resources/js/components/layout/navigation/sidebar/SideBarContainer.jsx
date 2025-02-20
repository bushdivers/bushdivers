import {
  Box,
  Divider,
  Flex,
  Heading,
  Image,
  useColorModeValue,
} from '@chakra-ui/react'
import React from 'react'

import ThemeToggle from '../ThemeToggle'
import NavMenuItems from './NavMenuItems'
import UserSection from './UserSection'

const SidebarContainer = () => {
  const bg = useColorModeValue('gray.100', 'gray.800')
  const border = useColorModeValue('gray.300', 'gray.700')
  return (
    <Box
      p={3}
      position="fixed"
      top={0}
      bottom={0}
      w="250px"
      bg={bg}
      overflowY="auto"
      borderRight="2px"
      borderColor={border}
    >
      <Box>
        <Flex alignItems="center" gap={2} justifyContent="space-between">
          <Flex alignItems="center" gap={2}>
            <Image
              src="https://res.cloudinary.com/dji0yvkef/image/upload/v1628691598/BDLogo.png"
              boxSize={10}
              alt="Bush Divers Logo"
            />
            <Heading size="md">Bush Divers</Heading>
          </Flex>
          <ThemeToggle />
        </Flex>
      </Box>
      <Divider mt={4} />
      <UserSection />
      <Divider mt={4} />
      <NavMenuItems />
    </Box>
  )
}

export default SidebarContainer
