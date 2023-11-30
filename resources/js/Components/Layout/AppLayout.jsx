import React from 'react'
import { Head, usePage } from '@inertiajs/inertia-react'
import FlashMessage from '../../Shared/Elements/FlashMessage'
import { Toaster } from 'react-hot-toast'
import { Box, Heading, Flex, Grid, GridItem } from '@chakra-ui/react'
import SideNavContainer from './Navigation/SideNavContainer'

export default function AppLayout ({ children, title, heading, fullSize = false }) {
  const { flash } = usePage().props

  return (
    <>
    <Toaster toastOptions={{ style: { marginTop: '4rem' } }} />
    <Head><title>{title}</title></Head>
    <Grid templateAreas={'\'sidebar main\''} templateColumns="auto 1fr">
      <SideNavContainer />
      <GridItem as="main" area="main">
        <Box className={`${!fullSize ? 'p-6' : ''}`}>
          {flash.error && <FlashMessage type="error" message={flash.error} />}
          {flash.success && <FlashMessage type="success" message={flash.success} />}
          <Flex alignItems="center" justifyContent="space-between">
            {!fullSize
              ? (
                <Heading size="lg">{heading}</Heading>
                )
              : (
                <></>
                )}
          </Flex>
          <Box>{children}</Box>
        </Box>
      </GridItem>
    </Grid>
  </>
  )
}
