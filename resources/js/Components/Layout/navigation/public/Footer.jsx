import { Box, Link as ChakraLink, Flex } from '@chakra-ui/react'
import { Link } from '@inertiajs/react'
import React from 'react'

const Footer = () => {
  const date = new Date().getFullYear()

  return (
    <Box p={6}>
      <Flex justifyContent="space-between">
        <Box>&copy; Bush Divers {date}</Box>
        <Flex alignItems="center" gap={2}>
          <ChakraLink as={Link} href="/privacy">
            Privacy Policy
          </ChakraLink>
          <ChakraLink as={Link} href="/supporters">
            Supporters
          </ChakraLink>
        </Flex>
      </Flex>
    </Box>
  )
}

export default Footer
