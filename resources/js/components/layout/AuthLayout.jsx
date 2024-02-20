import { Box } from '@chakra-ui/react'
import { Head } from '@inertiajs/react'
import React from 'react'

import FlashSection from '../layout/FlashSection'

export default function LayoutAuth({ children, title }) {
  return (
    <Box h="100vh">
      <Head title={title} />
      <FlashSection />
      {children}
    </Box>
  )
}
