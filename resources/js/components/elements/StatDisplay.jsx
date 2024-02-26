import { Box, Flex, Text } from '@chakra-ui/react'
import { Link } from '@inertiajs/react'
import React from 'react'

const StatDisplay = ({ stat, title, link = false }) => {
  return (
    <Box>
      <Flex alignItems="center" direction="column">
        <Text fontSize="sm">{title}</Text>
        {!link ? (
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
