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
  switch (metar.clouds[0]?.code) {
    case 'CLR':
      icon = Sun
      text = 'Clear'
      break
    case 'CAVOK':
      icon = Sun
      text = 'Clear'
      break
    case 'FEW':
      icon = CloudSun
      text = 'Cloudy'
      break
    case 'SCT':
      icon = CloudSun
      text = 'Cloudy'
      break
    case 'BKN':
      icon = CloudSun
      text = 'Cloudy'
      break
    case 'OVC':
      icon = Cloud
      text = 'Overcast'
      break
    default:
      icon = CloudSun
      text = 'Cloudy'
  }

  if (metar.rain?.length > 0) {
    icon = CloudRain
    text = 'Rain'
  }

  if (metar.conditions?.length > 0) {
    if (
      metar.conditions?.find(
        (condition) => condition.code === 'RA' || condition.code === 'SHRA'
      )
    ) {
      icon = CloudRain
      text = 'Rain'
    } else if (metar.conditions?.find((condition) => condition.code === 'TS')) {
      icon = CloudLightning
      text = 'Stormy'
    } else if (metar.conditions?.find((condition) => condition.code === 'SN')) {
      icon = CloudSnow
      text = 'Snow'
    } else {
      icon = CloudRain
      text = 'Rain'
    }
  }

  return (
    <Flex direction="column" alignItems="center" gap={2}>
      {icon && <Icon boxSize={8} as={icon} />}
      <Text fontSize="md">{text}</Text>
    </Flex>
  )
}
const Conditions = ({ metar }) => {
  return <>{renderConditions(metar)}</>
}

export default Conditions
