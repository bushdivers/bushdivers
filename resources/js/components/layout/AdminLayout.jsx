import {
  Box,
  Button,
  Link as ChakraLink,
  Flex,
  Grid,
  GridItem,
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

const AdminLayout = ({ children, title, heading, isFullSize = false }) => {
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
          <Grid templateColumns="repeat(6, 1fr)" gap={2}>
            <GridItem colSpan={1}>
              <AdminMenu />
            </GridItem>
            <GridItem colSpan={5}>
              {!isFullSize && <Heading mb={4}>{heading}</Heading>}
              <Box>{children}</Box>
            </GridItem>
          </Grid>
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
          <Grid templateColumns="repeat(6, 1fr)" gap={2}>
            <GridItem colSpan={1}>
              <AdminMenu />
            </GridItem>
            <GridItem colSpan={5}>
              {!isFullSize && <Heading mb={4}>{title}</Heading>}
              <Box>{children}</Box>
            </GridItem>
          </Grid>
        </Box>
      </Show>
    </>
  )
}

export default AdminLayout
