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
} from '@chakra-ui/react'
import { Head, Link as InertiaLink } from '@inertiajs/react'
import { Menu } from 'lucide-react'
import React from 'react'

import FlashSection from './FlashSection.jsx'
import AdminMenu from './navigation/AdminMenu.jsx'
import MobileNav from './navigation/MobileNav.jsx'
import ThemeToggle from './navigation/ThemeToggle.jsx'
import UserStats from './navigation/UserStats.jsx'
import SidebarContainer from './navigation/sidebar/SideBarContainer.jsx'

const AdminLayout = ({
  children,
  heading,
  title = heading,
  subHeading,
  actions,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Show above="md">
        <SidebarContainer />
        <Container pl="252px" maxW="container.xl" mt={2}>
          <FlashSection />
          <Flex justifyContent="space-between" alignItems="center">
            <Heading size="lg" mb={4}>
              {heading}
            </Heading>
            <AdminMenu />
          </Flex>
          {subHeading && (
            <Flex justifyContent="space-between" alignItems="center" mb={6}>
              <Heading size="md">{subHeading}</Heading>
              {actions}
            </Flex>
          )}
          <Box>{children}</Box>
        </Container>
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

          <Heading mb={4}>{title}</Heading>
          <AdminMenu />
          {subHeading && (
            <>
              <Heading size="md">{subHeading}</Heading>
              {actions}
            </>
          )}
          <Box>{children}</Box>
        </Box>
      </Show>
    </>
  )
}

export default AdminLayout
