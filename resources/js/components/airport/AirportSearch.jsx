import { Button, Flex, Icon, Input, useColorModeValue } from '@chakra-ui/react'
import { router } from '@inertiajs/react'
import { Search } from 'lucide-react'
import React, { useState } from 'react'

const AirportSearch = () => {
  const [airportSearch, setAirportSearch] = useState('')
  const handleSearchChange = (e) => {
    setAirportSearch(e.target.value)
  }

  const handleAirportSearch = () => {
    if (airportSearch !== '') {
      router.get(`/airports/${airportSearch}`)
    }
  }

  return (
    <Flex gap={1} ml={4}>
      <Input
        value={airportSearch}
        onChange={handleSearchChange}
        placeholder="Search ICAO"
        size="sm"
        type="text"
        bgColor={useColorModeValue('white', 'gray.800')}
      />
      <Button size="sm" onClick={() => handleAirportSearch(airportSearch)}>
        <Icon as={Search} />
      </Button>
    </Flex>
  )
}

export default AirportSearch
