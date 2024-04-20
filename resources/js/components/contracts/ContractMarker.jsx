import { Flex, Icon, Tag, Text } from '@chakra-ui/react'
import { useSetAtom } from 'jotai'
import React from 'react'
import { Marker } from 'react-map-gl'

import { selectedContractAtom } from '../../state/contract.state.js'

const ContractMarker = ({ identifier, lon, lat, contract, color, icon }) => {
  const setSelectedContract = useSetAtom(selectedContractAtom)
  return (
    <Marker
      scale={0.75}
      longitude={lon}
      latitude={lat}
      onClick={() => setSelectedContract(contract)}
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
