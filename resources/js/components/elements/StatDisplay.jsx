import { Box, Flex, Text } from '@chakra-ui/react'
import { Link } from '@inertiajs/react'
import React from 'react'

import AirportLabel from '../airport/AirportLabel.jsx'

const StatDisplay = ({ stat, title, link = false, airport = null }) => {
  return (
    <Box>
      <Flex alignItems="center" direction="column">
        <Text fontSize="sm">{title}</Text>
        {airport ? (
          <AirportLabel airport={airport} size="xl" />
        ) : !link ? (
          <Text fontSize="xl">{stat}</Text>
        ) : (
          <>
            <Link href={link} className="ml-2">
              <Text fontSize="xl">{stat}</Text>
            </Link>
          </>
        )}
      </Flex>
    </Box>
  )
}

export default StatDisplay
