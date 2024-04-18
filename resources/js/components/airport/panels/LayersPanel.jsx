import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Switch,
} from '@chakra-ui/react'
import { useAtom } from 'jotai'
import React from 'react'

import {
  contractMapLayersAtom,
  contractMapStyleAtom,
} from '../../../state/map.state.js'

const LayersPanel = () => {
  const [contractMapLayers, setContractMapLayers] = useAtom(
    contractMapLayersAtom
  )
  const [contractMapStyle, setContractMapStyle] = useAtom(contractMapStyleAtom)
  function handleChange(e) {
    const key = e.target.id
    const value = e.target.checked
    setContractMapLayers((values) => ({
      ...values,
      [key]: value,
    }))
  }

  function handleStyleChange(e) {
    setContractMapStyle(e.target.id)
  }

  return (
    <Box>
      <Heading size="md" mb={2}>
        Layers
      </Heading>
      <Flex mt={4} direction="column" alignItems="start" gap={3}>
        <Heading size="sm" mb={2}>
          Map Details
        </Heading>
        <FormControl display="flex" alignItems="center" gap={2}>
          <Switch
            onChange={handleChange}
            isChecked={contractMapLayers.contracts}
            id="contracts"
          />
          <FormLabel htmlFor="contracts" mb="0">
            Contract List
          </FormLabel>
        </FormControl>
        <FormControl display="flex" alignItems="center" gap={2}>
          <Switch
            onChange={handleChange}
            isChecked={contractMapLayers.fleet}
            id="fleet"
          />
          <FormLabel htmlFor="fleet" mb="0">
            Fleet Aircraft
          </FormLabel>
        </FormControl>
        <FormControl display="flex" alignItems="center" gap={2}>
          <Switch
            onChange={handleChange}
            isChecked={contractMapLayers.myAircraft}
            id="myAircraft"
          />
          <FormLabel htmlFor="myAircraft" mb="0">
            My Aircraft
          </FormLabel>
        </FormControl>
        <FormControl display="flex" alignItems="center" gap={2}>
          <Switch
            onChange={handleChange}
            isChecked={contractMapLayers.myContracts}
            id="myContracts"
          />
          <FormLabel htmlFor="myContracts" mb="0">
            My Contracts
          </FormLabel>
        </FormControl>
        <FormControl display="flex" alignItems="center" gap={2}>
          <Switch
            onChange={handleChange}
            isChecked={contractMapLayers.sharedContracts}
            id="sharedContracts"
          />
          <FormLabel htmlFor="sharedContracts" mb="0">
            Shared Contracts
          </FormLabel>
        </FormControl>
        <Heading size="sm" my={2}>
          Map Style
        </Heading>
        <FormControl display="flex" alignItems="center" gap={2}>
          <Switch
            onChange={handleStyleChange}
            isChecked={contractMapStyle === 'default'}
            id="default"
          />
          <FormLabel htmlFor="default" mb="0">
            Default
          </FormLabel>
        </FormControl>
        <FormControl display="flex" alignItems="center" gap={2}>
          <Switch
            onChange={handleStyleChange}
            isChecked={contractMapStyle === 'terrain'}
            id="terrain"
          />
          <FormLabel htmlFor="terrain" mb="0">
            Terrain
          </FormLabel>
        </FormControl>
        <FormControl display="flex" alignItems="center" gap={2}>
          <Switch
            onChange={handleStyleChange}
            isChecked={contractMapStyle === 'satellite'}
            id="satellite"
          />
          <FormLabel htmlFor="satellite" mb="0">
            Satellite
          </FormLabel>
        </FormControl>
      </Flex>
    </Box>
  )
}

export default LayersPanel
