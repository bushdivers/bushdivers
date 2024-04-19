import { Flex, Icon, Tag, Text } from '@chakra-ui/react'
import React from 'react'
import { Marker } from 'react-map-gl'

const ContractMarker = ({
  identifier,
  lon,
  lat,
  contract,
  updateSelectedContract,
  color,
  icon,
}) => {
  return (
    <Marker
      scale={0.75}
      longitude={lon}
      latitude={lat}
      onClick={() => updateSelectedContract(contract)}
    >
      <Tag colorScheme={color} cursor="pointer">
        <Flex alignItems="center" gap={1}>
          <Icon as={icon} />
          <Text>{identifier}</Text>
        </Flex>
      </Tag>
    </Marker>
  )
}

export default ContractMarker
