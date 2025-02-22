import {
  Box,
  Button,
  Link as ChakraLink,
  Container,
  Flex,
  Heading,
  Icon,
  Show,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { Head, Link as InertiaLink, usePage } from '@inertiajs/react'
import { Menu } from 'lucide-react'
import React, { useEffect } from 'react'

import FlashSection from './FlashSection'
import MobileNav from './navigation/MobileNav'
import ThemeToggle from './navigation/ThemeToggle'
import UserStats from './navigation/UserStats'
import SidebarContainer from './navigation/sidebar/SideBarContainer'

const AppLayout = ({ children, title, heading, isFullSize = false }) => {
  const { flash } = usePage().props
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    if (flash.error) {
      toast({
        title: flash.error,
        status: 'error',
        isClosable: true,
      })
    }
    if (flash.success) {
      toast({
        title: flash.success,
        status: 'success',
        isClosable: true,
      })
    }
  }, [flash])

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {/* <Toast /> */}
      <Show above="md">
        <SidebarContainer />
        {!isFullSize ? (
          <Container pl="252px" maxW="container.xl" mt={2}>
            <Heading size="lg" mb={4}>
              {heading}
            </Heading>
            {children}
          </Container>
        ) : (
          <Box pl="265px" pr={4} mt={2}>
            <Heading size="lg" mb={4}>
              {heading}
            </Heading>
            {children}
          </Box>
        )}
      </Show>
      <Show below="md">
        <Box p={2}>
          <Flex justifyContent="space-between" alignItems="center" gap={3}>
            <Button size="sm" onClick={onOpen} variant="ghost">
              <Icon as={Menu} />
            </Button>
            <Flex alignItems="center">
              <ThemeToggle />
              <UserStats />
              <ChakraLink href="/logout" as={InertiaLink}>
                <Text fontSize="sm">Sign out</Text>
              </ChakraLink>
            </Flex>
          </Flex>
        </Box>
        <Box p={4}>
          <MobileNav isOpen={isOpen} onClose={onClose} />
          <FlashSection />
          <Heading size="lg" mb={4}>
            {title}
          </Heading>
          {children}
        </Box>
      </Show>
    </>
  )
}

export default AppLayout
