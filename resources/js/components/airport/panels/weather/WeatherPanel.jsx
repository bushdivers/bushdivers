import { Box, Divider, Flex, Heading, Icon, Tag, Text } from '@chakra-ui/react'
import { formatDistanceToNowStrict } from 'date-fns'
import { MoveUp } from 'lucide-react'
import React from 'react'

import Conditions from './Conditions.jsx'
import WeatherItem from './WeatherItem.jsx'

const renderFlightCategoryColor = (category) => {
  switch (category) {
    case 'VFR':
      return 'green'
    case 'MVFR':
      return 'blue'
    case 'IFR':
      return 'red'
    case 'LIFR':
      return 'purple'
    default:
      return 'gray'
  }
}

const WeatherPanel = ({ metar }) => {
  return (
    <Box>
      <Flex alignItems="start" justifyContent="space-between" direction="row">
        <Heading mb={2} size="md">
          Weather
        </Heading>
        {metar.flight_category && (
          <Tag colorScheme={renderFlightCategoryColor(metar.flight_category)}>
            {metar.flight_category}
          </Tag>
        )}
      </Flex>
      <Flex
        alignItems="start"
        justifyContent="space-between"
        direction="row"
        gap={4}
      >
        <WeatherItem heading="Conditions">
          <Conditions metar={metar} />
        </WeatherItem>
        <WeatherItem heading="Temperature">
          <Flex alignItems="center" direction="row">
            <Text fontSize="xl">{metar.temperature?.celsius} &#176;</Text>
            <Text>C</Text>
          </Flex>
        </WeatherItem>
        <WeatherItem heading="Wind">
          <Box style={{ transform: `rotate(${metar.wind?.degrees}deg)` }}>
            <Icon boxSize={6} as={MoveUp} />
          </Box>
          <Text fontSize="md">
            {metar.wind?.degrees}&#176; {metar.wind?.speed} kts
          </Text>
        </WeatherItem>
      </Flex>
      <Divider my={4} />
      <Flex
        alignItems="start"
        justifyContent="space-between"
        direction="row"
        gap={4}
      >
        <WeatherItem heading="Air Pressure">
          <Text fontSize="md">{metar.barometer?.hpa} hPa</Text>
          <Text fontSize="md">{metar.barometer?.hg} inHg</Text>
        </WeatherItem>
        <WeatherItem heading="Dew Point">
          <Flex alignItems="center" direction="row">
            <Text fontSize="xl">{metar.dewpoint?.celsius} &#176;</Text>
            <Text>C</Text>
          </Flex>
        </WeatherItem>
        <WeatherItem heading="Humidity">
          <Text fontSize="md">{metar.humidity?.percent}%</Text>
        </WeatherItem>
      </Flex>
      <Divider my={4} />
      <Flex
        alignItems="start"
        justifyContent="space-between"
        direction="row"
        gap={4}
        mb={2}
      >
        <Heading size="sm">Latest METAR</Heading>
        <Text fontSize="sm">
          {formatDistanceToNowStrict(metar.observed)} ago
        </Text>
      </Flex>
      <Text>{metar.raw_text}</Text>
    </Box>
  )
}

export default WeatherPanel
