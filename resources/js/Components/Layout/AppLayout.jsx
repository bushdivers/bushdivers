import {
  Box,
  Button,
  Link as ChakraLink,
  Flex,
  Heading,
  Icon,
  Show,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { Head, Link as InertiaLink } from '@inertiajs/react'
import { Menu } from 'lucide-react'
import React from 'react'

import FlashSection from './FlashSection'
import MobileNav from './navigation/MobileNav'
import ThemeToggle from './navigation/ThemeToggle'
import UserStats from './navigation/UserStats'
import SidebarContainer from './navigation/sidebar/SideBarContainer'

const AppLayout = ({ children, title, heading, isFullSize = false }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Show above="md">
        <SidebarContainer />
        <Box ml="250px" p={!isFullSize ? '4' : ''}>
          <FlashSection />
          {!isFullSize && <Heading mb={4}>{heading}</Heading>}
          <Box>{children}</Box>
        </Box>
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
        <Box p={!isFullSize ? '4' : ''}>
          <MobileNav isOpen={isOpen} onClose={onClose} />
          <FlashSection />
          {!isFullSize && <Heading mb={4}>{title}</Heading>}
          {children}
        </Box>
      </Show>
    </>
  )
}

export default AppLayout
