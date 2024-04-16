import { Box, useColorMode } from '@chakra-ui/react'
import { useAtomValue } from 'jotai'
import React from 'react'

import {
  PANELSTATE,
  selectedMapPanelAtom,
} from '../../../state/airport.state.js'
import AirportOptions from './AirportOptions.jsx'
import FilterPanel from './FilterPanel.jsx'
import FuelPanel from './FuelPanel.jsx'
import LayersPanel from './LayersPanel.jsx'
import WeatherPanel from './WeatherPanel.jsx'

const PanelContainer = () => {
  const { colorMode } = useColorMode()
  const selectedMapPanel = useAtomValue(selectedMapPanelAtom)

  return (
    <>
      <AirportOptions />
      {selectedMapPanel !== '' && selectedMapPanel !== undefined && (
        <Box
          position="absolute"
          right={0}
          top="50%"
          margin={0}
          w={300}
          h="50%"
          roundedLeft="md"
          bg={colorMode === 'light' ? 'white' : 'gray.700'}
          py={4}
          px={2}
          css={{ transform: 'translateY(-50%)' }}
        >
          {selectedMapPanel === PANELSTATE.WEATHER && <WeatherPanel />}
          {selectedMapPanel === PANELSTATE.FUEL && <FuelPanel />}
          {selectedMapPanel === PANELSTATE.FILTERS && <FilterPanel />}
          {selectedMapPanel === PANELSTATE.LAYERS && <LayersPanel />}
        </Box>
      )}
    </>
  )
}

export default PanelContainer
