import React from 'react'
import { Link } from '@inertiajs/inertia-react'
import { Box, Flex, Link as ChakraLink } from '@chakra-ui/react'

const Footer = () => {
  const date = new Date().getFullYear()

  return (
    <Box p={6}>
      <Flex justifyContent="space-between">
        <Box>
          &copy; Bush Divers {date}
        </Box>
        <Flex alignItems="center" gap={2}>
          <ChakraLink as={Link} href="/privacy">Privacy Policy</ChakraLink>
          <ChakraLink as={Link} href="/supporters">Supporters</ChakraLink>
        </Flex>
      </Flex>
    </Box>
  )
}

export default Footer
