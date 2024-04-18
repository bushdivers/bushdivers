import {
  Box,
  Flex,
  Icon,
  StackDivider,
  VStack,
  useColorMode,
} from '@chakra-ui/react'
import { useAtom } from 'jotai'
import { CloudSunRain, Filter, Fuel, Layers2 } from 'lucide-react'
import React from 'react'

import { PANELSTATE, selectedMapPanelAtom } from '../../../state/map.state.js'

const AirportOptions = () => {
  const { colorMode } = useColorMode()
  const [selectedMapPanel, setSelectedMapPanel] = useAtom(selectedMapPanelAtom)
  return (
    <Box
      position="absolute"
      right={selectedMapPanel === '' ? 0 : 300}
      top="50%"
      margin={0}
      w={'auto'}
      roundedLeft="md"
      bg={colorMode === 'light' ? 'gray.50' : 'gray.900'}
      py={4}
      px={2}
      css={{ transform: 'translateY(-50%)' }}
    >
      <VStack
        divider={
          <StackDivider
            borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
          />
        }
        spacing={3}
      >
        <Flex
          onClick={() =>
            setSelectedMapPanel(
              selectedMapPanel === PANELSTATE.WEATHER ? '' : PANELSTATE.WEATHER
            )
          }
          rounded="md"
          p={2}
          cursor="pointer"
          bgColor={
            selectedMapPanel === PANELSTATE.WEATHER
              ? colorMode === 'light'
                ? 'gray.100'
                : 'gray.700'
              : ''
          }
          _hover={{ bgColor: colorMode === 'light' ? 'gray.100' : 'gray.700' }}
        >
          <Icon boxSize={5} as={CloudSunRain} />
        </Flex>
        <Flex
          onClick={() =>
            setSelectedMapPanel(
              selectedMapPanel === PANELSTATE.FUEL ? '' : PANELSTATE.FUEL
            )
          }
          rounded="md"
          p={2}
          cursor="pointer"
          bgColor={
            selectedMapPanel === PANELSTATE.FUEL
              ? colorMode === 'light'
                ? 'gray.100'
                : 'gray.700'
              : ''
          }
          _hover={{ bgColor: colorMode === 'light' ? 'gray.100' : 'gray.700' }}
        >
          <Icon boxSize={5} as={Fuel} />
        </Flex>
        <Flex
          onClick={() =>
            setSelectedMapPanel(
              selectedMapPanel === PANELSTATE.FILTERS ? '' : PANELSTATE.FILTERS
            )
          }
          rounded="md"
          p={2}
          cursor="pointer"
          bgColor={
            selectedMapPanel === PANELSTATE.FILTERS
              ? colorMode === 'light'
                ? 'gray.100'
                : 'gray.700'
              : ''
          }
          _hover={{ bgColor: colorMode === 'light' ? 'gray.100' : 'gray.700' }}
        >
          <Icon boxSize={5} as={Filter} />
        </Flex>
        <Flex
          onClick={() =>
            setSelectedMapPanel(
              selectedMapPanel === PANELSTATE.LAYERS ? '' : PANELSTATE.LAYERS
            )
          }
          rounded="md"
          p={2}
          cursor="pointer"
          bgColor={
            selectedMapPanel === PANELSTATE.LAYERS
              ? colorMode === 'light'
                ? 'gray.100'
                : 'gray.700'
              : ''
          }
          _hover={{ bgColor: colorMode === 'light' ? 'gray.100' : 'gray.700' }}
        >
          <Icon boxSize={5} as={Layers2} />
        </Flex>
      </VStack>
    </Box>
  )
}

export default AirportOptions
