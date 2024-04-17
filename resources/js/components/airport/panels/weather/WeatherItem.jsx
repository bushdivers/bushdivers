import { Flex, Heading } from '@chakra-ui/react'
import React from 'react'

const WeatherItem = ({ heading, children }) => {
  return (
    <Flex direction="column" alignItems="center" gap={2}>
      <Heading size="sm">{heading}</Heading>
      {children}
    </Flex>
  )
}

export default WeatherItem
