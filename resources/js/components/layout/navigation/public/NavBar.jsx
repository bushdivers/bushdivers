import { Box, Button, Flex, Heading, Image } from '@chakra-ui/react'
import { Link, usePage } from '@inertiajs/react'
import React from 'react'

export default function NavBar() {
  const { auth } = usePage().props
  return (
    <Box p={3} position="fixed" width="100%" top={0} left={0} right={0}>
      <Flex justifyContent="space-between" alignItems="center">
        <Flex alignItems="center" gap={2}>
          <Image
            src="https://res.cloudinary.com/dji0yvkef/image/upload/v1628691598/BDLogo.png"
            boxSize={10}
            alt="Bush Divers Logo"
          />
          <Heading size="sm">Bush Divers</Heading>
        </Flex>
        <Flex alignItems="center" gap={2}>
          {!auth.user && (
            <>
              <Link href="/login">
                <Button>Crew Login</Button>
              </Link>
              <Link href="/register">
                <Button colorScheme="gray">Get started</Button>
              </Link>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  )
}
