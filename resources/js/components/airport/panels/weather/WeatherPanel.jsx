import { Box, Divider, Flex, Heading, Icon, Tag, Text } from '@chakra-ui/react'
import { Deferred } from '@inertiajs/react'
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
      <Deferred data="metar" fallback={<Text>Loading...</Text>}>
        {metar?.icao ? (
          <>
            {/* Header */}
            <Box borderBottomWidth="1px" mb={3}>
              <Flex alignItems="center" justifyContent="space-between" pb={2}>
                <Heading size="md">Weather ({metar.icao})</Heading>
                {metar.flight_category != null && (
                  <Tag
                    size="md"
                    colorScheme={renderFlightCategoryColor(
                      metar.flight_category
                    )}
                  >
                    {metar.flight_category}
                  </Tag>
                )}
              </Flex>
              {metar.distance != null && metar.bearing != null && (
                <Flex alignItems="center" gap={1} color="gray.500">
                  <Text>{`Distance: ${metar.distance} nm, Bearing: `} </Text>
                  <Icon
                    boxSize={3}
                    as={MoveUp}
                    style={{
                      transform: `rotate(${metar.bearing}deg)`,
                    }}
                  />
                  <Text>{`${metar.bearing}°`}</Text>
                </Flex>
              )}
            </Box>

            {/* Row 1: Can I land? — Wind | Wind Var / Gusts | Vis + Ceiling */}
            <Flex
              alignItems="start"
              justifyContent="space-between"
              direction="row"
              gap={4}
              mb={3}
            >
              <WeatherItem heading="Wind">
                <Icon
                  boxSize={6}
                  as={MoveUp}
                  style={{
                    transform: `rotate(${metar.wind?.degrees ?? 0}deg)`,
                  }}
                />
                <Text fontSize="md">
                  {metar.wind?.degrees != null ? `${metar.wind.degrees}°` : '-'}
                </Text>
                <Text fontSize="md">
                  {metar.wind?.speed?.kts != null
                    ? `${metar.wind.speed.kts} kts`
                    : '-'}
                </Text>
                {metar.wind?.gust?.kts != null && (
                  <Text fontSize="xs" color="gray.500">
                    Gust {metar.wind.gust.kts} kts
                  </Text>
                )}
              </WeatherItem>
              <WeatherItem heading="Wind Var">
                {metar.wind?.variable != null ? (
                  <>
                    <Text fontSize="md" textAlign="center">
                      {metar.wind.variable.from}° to {metar.wind.variable.to}°
                    </Text>
                  </>
                ) : metar.wind?.gust?.kts != null ? (
                  <Text fontSize="md">Gust {metar.wind.gust.kts} kts</Text>
                ) : (
                  <Text fontSize="md" color="gray.400">
                    -
                  </Text>
                )}
              </WeatherItem>
              <WeatherItem heading="Visibility">
                <Text fontSize="md">
                  {metar.visibility?.miles != null
                    ? `${metar.visibility.miles} mi`
                    : '-'}
                </Text>
                {metar.ceiling != null && (
                  <Text fontSize="xs" color="gray.500">
                    {metar.ceiling.feet?.toLocaleString()} ft ceiling
                  </Text>
                )}
              </WeatherItem>
            </Flex>

            {/* Row 2: What hazards? — Conditions | Pressure | Cloud Layers */}
            <Divider mb={3} />
            <Flex
              alignItems="start"
              justifyContent="space-between"
              direction="row"
              gap={4}
              mb={3}
            >
              <WeatherItem heading="Conditions">
                <Conditions metar={metar} />
              </WeatherItem>
              <WeatherItem heading="Pressure">
                <Text fontSize="md">{metar.pressure?.mb ?? '-'} hPa</Text>
                {metar.pressure?.hg != null && (
                  <Text fontSize="md">{metar.pressure.hg.toFixed(2)} inHg</Text>
                )}
              </WeatherItem>
              <WeatherItem heading="Clouds">
                {metar.clouds?.length > 0 ? (
                  <Flex direction="column" alignItems="center" gap={0}>
                    {metar.clouds.map((cloud, i) => (
                      <Text
                        key={i}
                        fontSize="2xs"
                        color="gray.500"
                        lineHeight="short"
                      >
                        {cloud.code} {cloud.feet?.toLocaleString()} ft
                      </Text>
                    ))}
                  </Flex>
                ) : (
                  <Text fontSize="md" color="gray.400">
                    -
                  </Text>
                )}
              </WeatherItem>
            </Flex>

            {/* Row 3: Other context — Temp | Dew Point | Humidity */}
            <Divider mb={3} />
            <Flex
              alignItems="start"
              justifyContent="space-between"
              direction="row"
              gap={4}
              mb={3}
            >
              <WeatherItem heading="Temperature">
                <Flex alignItems="center" direction="row">
                  <Text fontSize="md">
                    {metar.temperature?.celsius ?? '-'} &#176;
                  </Text>
                  <Text>C</Text>
                </Flex>
              </WeatherItem>
              <WeatherItem heading="Dew Pt">
                <Flex alignItems="center" direction="row">
                  <Text fontSize="md">
                    {metar.dewpoint?.celsius ?? '-'} &#176;
                  </Text>
                  <Text>C</Text>
                </Flex>
              </WeatherItem>
              <WeatherItem heading="Humidity">
                <Text fontSize="md">
                  {metar.humidity != null ? `${metar.humidity}%` : '-'}
                </Text>
              </WeatherItem>
            </Flex>

            {/* Raw METAR */}
            <Divider mb={2} />
            <Box mb={2}>
              <Heading size="sm" mb={1}>
                Latest METAR
              </Heading>
              <Text fontSize="sm">{metar.raw_text}</Text>
            </Box>

            {/* Remarks */}
            {metar.remarks?.length > 0 && (
              <>
                <Divider mb={2} />
                <Box mb={2}>
                  <Heading size="sm" mb={1}>
                    Remarks
                  </Heading>
                  <Text fontSize="sm">{metar.remarks.join(' ')}</Text>
                </Box>
              </>
            )}
          </>
        ) : (
          <Text>No weather data available</Text>
        )}
      </Deferred>
    </Box>
  )
}

export default WeatherPanel
