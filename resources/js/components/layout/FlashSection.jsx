import { Box } from '@chakra-ui/react'
import { usePage } from '@inertiajs/react'
import React from 'react'

import FlashMessage from '../elements/FlashMessage'

const FlashSection = () => {
  const { flash } = usePage().props
  return (
    <Box position="fixed" zIndex={1} top={5} right={5} width="33%">
      {flash.error && <FlashMessage type="error" message={flash.error} />}
      {flash.success && <FlashMessage type="success" message={flash.success} />}
    </Box>
  )
}

export default FlashSection
