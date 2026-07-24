import { Flex, Icon, Text } from '@chakra-ui/react'
import {
  Cloud,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
} from 'lucide-react'
import React from 'react'

const renderConditions = (metar) => {
  let icon = null
  let text = ''

  // Split condition codes into 2-character pairs per METAR spec
  // (e.g. VCSH → VC + SH, SHRA → SH + RA, TSRA → TS + RA)
  if (metar.conditions?.length > 0) {
    const pairs = metar.conditions.flatMap((c) => {
      const code = c.code
      const result = []
      for (let i = 0; i < code.length; i += 2) {
        result.push(code.substring(i, i + 2))
      }
      return result
    })

    if (pairs.includes('TS')) {
      // Thunderstorm — takes top priority
      icon = CloudLightning
      text = 'Stormy'
    } else if (pairs.includes('GR')) {
      // Hail — severe enough to lump with storms
      icon = CloudLightning
      text = 'Stormy'
    } else if (pairs.includes('SN') || pairs.includes('GS')) {
      // Snow and small hail / snow pellets — frozen precip
      icon = CloudSnow
      text = 'Snow'
    } else if (
      pairs.includes('SH') ||
      pairs.includes('RA') ||
      pairs.includes('DZ')
    ) {
      // Showers, Rain, Drizzle — all wet precipitation
      icon = CloudRain
      text = 'Rain'
    } else if (pairs.includes('FG') || pairs.includes('BR')) {
      icon = Cloud
      text = 'Fog'
    } else if (pairs.includes('HZ')) {
      icon = Cloud
      text = 'Haze'
    }
  }

  // Fall back to cloud cover if no conditions matched
  if (!icon && metar.clouds?.length > 0) {
    switch (metar.clouds[0]?.code) {
      case 'CLR':
      case 'SKC':
      case 'CAVOK':
        icon = Sun
        text = 'Clear'
        break
      case 'FEW':
        icon = CloudSun
        text = 'Mostly Clear'
        break
      case 'SCT':
        icon = CloudSun
        text = 'Partly Cloudy'
        break
      case 'BKN':
        icon = Cloud
        text = 'Mostly Cloudy'
        break
      case 'OVC':
        icon = Cloud
        text = 'Overcast'
        break
      default:
        icon = CloudSun
        text = 'Cloudy'
    }
  }

  // If nothing matched, show clear
  if (!icon) {
    icon = Sun
    text = 'Clear'
  }

  return (
    <Flex direction="column" alignItems="center" gap={1}>
      {icon && <Icon boxSize={6} as={icon} />}
      <Text fontSize="md" textAlign="center">
        {text}
      </Text>
    </Flex>
  )
}
const Conditions = ({ metar }) => {
  return <>{renderConditions(metar)}</>
}

export default Conditions
