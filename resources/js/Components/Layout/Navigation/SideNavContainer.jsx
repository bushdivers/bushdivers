import React from 'react'
import { Inertia } from '@inertiajs/inertia'
import { List, Image, VStack, GridItem, Box, Avatar, Tooltip, IconButton, ListItem, Flex, Text } from '@chakra-ui/react'
import { ClipboardSignature, BookText, Globe2, AreaChart, BadgeDollarSign, Route, Plane, UserCog, Ticket } from 'lucide-react'
import { Link, usePage } from '@inertiajs/inertia-react'
import SideNavItem from './SideNavItem'
import { displayNumber } from '../../../Helpers/number.helpers'

const SideNavContainer = () => {
  const { auth, url } = usePage().props
  const navItems = [
    { label: 'Live Map', icon: <Globe2 />, to: '/live-flights' },
    { label: 'Dispatch', icon: <Route />, to: '/dispatch' },
    { label: 'Contracts', icon: <ClipboardSignature />, to: '/contracts' },
    { label: 'Logbook', icon: <BookText />, to: '/logbook' },
    { label: 'Aircraft', icon: <Plane />, to: '/aircraft' },
    { label: 'Finances', icon: <BadgeDollarSign />, to: '/finances' },
    { label: 'Stats', icon: <AreaChart />, to: '/stats' }
  ]

  function logout () {
    Inertia.get('/logout')
  }

  return (
      <>
      <GridItem area="sidebar" as="aside" w="full" p={0}>
      <Box
          pos="sticky"
          top={0}
          w={{ base: 0, md: '72px' }}
          bg="gray.900"
          borderRight="1px solid"
          borderColor="gray.700"
          p={{ base: 0, md: 2 }}
          paddingTop={8}
          height="100vh"
          overflow="auto"
          css={{
            '&::-webkit-scrollbar': {
              height: 'var(--chakra-sizes-1)',
              width: 'var(--chakra-sizes-1)'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'var(--chakra-colors-gray-400)'
            }
          }}
        >
          <VStack spacing="5" as="nav" display="flex">
      <Image src="https://res.cloudinary.com/dji0yvkef/image/upload/v1628691598/BDLogo.png" boxSize={10} />
      <List spacing={3}>
          {navItems.map((item, index) => <SideNavItem key={index} index={index} item={item} />)}
      </List>
      <List position="fixed" bottom={0} mb={4} spacing={3}>
        <Flex direction="column" alignItems="center" gap={3}>
          <ListItem key="stats">
              <Tooltip label={`Cash: $${displayNumber(auth.user.balance)}; Points: ${displayNumber(auth.user.points)}`} placement="right">
                <Text cursor="pointer">{auth.user.current_airport_id}</Text>
              </Tooltip>
            </ListItem>
            <ListItem key="jumpseat">
            <Tooltip label="Jumpseat" placement="right">
              <IconButton
                isActive={url === '/jumpseat'}
                bg="gray.700"
                color="gray.300"
                key="jumpseat"
                as={Link}
                aria-label="Jumpseat"
                borderRadius="xl"
                icon={<Ticket />}
                href="/jumpseat"
              />
            </Tooltip>
          </ListItem>
          <ListItem key="profile">
            <Tooltip label="Profile" placement="right">
              <IconButton
                isActive={url === '/profile'}
                bg="gray.700"
                color="gray.300"
                key="profile"
                as={Link}
                aria-label="Profile"
                borderRadius="xl"
                icon={<UserCog />}
                href="/profile"
              />
            </Tooltip>
          </ListItem>
          <ListItem key="avatar">
            <Tooltip label="Signout" placement="right">
              <Avatar onClick={() => logout()} cursor="pointer" size="sm" name={auth.user.name} />
            </Tooltip>
          </ListItem>
        </Flex>
      </List>
      </VStack>
          </Box>
    </GridItem>
    </>
  )
}

export default SideNavContainer
