import { Box, Button, Flex, Heading, Select, Text } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import React from 'react'

import { contractFiltersAtom } from '../../../state/contract.state.js'

const FilterPanel = () => {
  const [filters, setFilters] = useAtom(contractFiltersAtom)
  function handleFilterChange(event) {
    setFilters({ ...filters, [event.target.id]: event.target.value })
  }

  return (
    <Box>
      <Heading size="md" mb={2}>
        Contract Filters
      </Heading>
      <Flex direction="column">
        <Flex direction="column" gap={1}>
          <Text fontSize="sm">Distance</Text>
          <Select
            value={filters.distance}
            onChange={handleFilterChange}
            id="distance"
          >
            <option value="0">All</option>
            <option value="60">{'< 60'}</option>
            <option value="100">60 - 100</option>
            <option value="300">{'> '} 100</option>
          </Select>
        </Flex>
        <Flex direction="column" gap={1}>
          <Text fontSize="sm">Payload</Text>
          <Select
            value={filters.payload}
            onChange={handleFilterChange}
            id="payload"
          >
            <option value="0">All</option>
            <option value="1000">{'< 1000'}</option>
            <option value="3000">1000 - 3000</option>
            <option value="10000">{'> '} 3000</option>
          </Select>
        </Flex>
      </Flex>
      <Button
        onClick={() => setFilters({ distance: 0, payload: 0 })}
        mt={4}
        colorScheme="gray"
        size="sm"
      >
        Reset Filters
      </Button>
    </Box>
  )
}

export default FilterPanel
