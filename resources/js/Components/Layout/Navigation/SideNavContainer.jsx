import React from 'react'
import { List, Image, VStack, GridItem, Box, Avatar } from '@chakra-ui/react'
import { ClipboardSignature, BookText, Globe2, AreaChart, BadgeDollarSign, Route, Plane } from 'lucide-react'
import SideNavItem from './SideNavItem'

const SideNavContainer = () => {
  const navItems = [
    { label: 'Live Map', icon: <Globe2 />, to: '/live-flights' },
    { label: 'Dispatch', icon: <Route />, to: '/dispatch' },
    { label: 'Contracts', icon: <ClipboardSignature />, to: '/contracts' },
    { label: 'Logbook', icon: <BookText />, to: '/logbook' },
    { label: 'Aircraft', icon: <Plane />, to: '/aircraft' },
    { label: 'Finances', icon: <BadgeDollarSign />, to: '/finances' },
    { label: 'Stats', icon: <AreaChart />, to: '/stats' }
  ]

  return (
      <>
      <GridItem area="sidebar" as="aside" w="full" p={0}>
      <Box
          pos="sticky"
          top={0}
          w={{ base: 0, md: '72px' }}
          borderRight="1px solid"
          borderColor="gray.100"
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
          <VStack spacing="5" as="nav" display={{ base: 'none', md: 'flex' }}>
      <Image src="https://res.cloudinary.com/dji0yvkef/image/upload/v1628691598/BDLogo.png" boxSize={10} /> {/* OR PUT YOUR LOGO HERE */}
      <List spacing={3}>
          {navItems.map((item, index) => <SideNavItem key={index} index={index} item={item} />)}
      </List>
      <Avatar position="fixed" bottom={0} mb={4} name='Kola Tioluwani' src='https://bit.ly/tioluwani-kolawole' />
      </VStack>
          </Box>
    </GridItem>
    </>
  )
}

export default SideNavContainer
