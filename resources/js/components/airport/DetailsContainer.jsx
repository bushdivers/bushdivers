import { Box } from '@chakra-ui/react'
import React from 'react'

const DetailsContainer = ({ children }) => {
  return (
    <Box position="absolute" left={4} top={12} bottom={12}>
      {children}
    </Box>
  )
}

export default DetailsContainer
