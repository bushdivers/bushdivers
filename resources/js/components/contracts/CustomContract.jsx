import { Box, Button, ButtonGroup, Flex, Input, Text } from '@chakra-ui/react'
import { router, usePage } from '@inertiajs/react'
import React, { useState } from 'react'

const CustomContract = ({ hideSection }) => {
  const { auth } = usePage().props
  const [error, setError] = useState(null)
  const [dep, setDep] = useState(auth.user.location.identifier)
  const [arr, setArr] = useState('')
  const [type, setType] = useState('cargo')

  const handleChangeDep = (e) => {
    setDep(e.target.value)
  }

  const handleChangeArr = (e) => {
    setArr(e.target.value)
  }

  const handleCreate = async () => {
    if (dep && arr) {
      if (dep === arr) {
        setError('Departure and arrival cannot be the same')
        return
      }
      await router.post('/contracts/custom', {
        departure: dep,
        arrival: arr,
        type,
      })
      hideSection()
    } else {
      setError('Please enter a departure and arrival ICAO')
    }
  }

  return (
    <Box>
      <ButtonGroup size="sm" isAttached variant="outline" mb={2}>
        <Button
          onClick={() => setType('cargo')}
          colorScheme={type === 'cargo' ? 'orange' : 'gray'}
          variant={type === 'cargo' ? 'solid' : 'outline'}
        >
          300 lbs cargo
        </Button>
        <Button
          onClick={() => setType('passenger')}
          colorScheme={type === 'passenger' ? 'orange' : 'gray'}
          variant={type === 'passenger' ? 'solid' : 'outline'}
        >
          1 passenger (170 lbs)
        </Button>
      </ButtonGroup>
      {error && (
        <Text color="red.500" size="sm" my="0.5">
          {error}
        </Text>
      )}
      <Flex alignItems="end" gap={2}>
        <Input
          inline
          id="icaoDep"
          value={dep}
          type="text"
          onChange={handleChangeDep}
          placeholder="Departure ICAO"
        />
        <Input
          inline
          id="icaoArr"
          value={arr}
          type="text"
          onChange={handleChangeArr}
          placeholder="Arrival ICAO"
        />
        <Box>
          <Button onClick={() => handleCreate()}>Create</Button>
        </Box>
      </Flex>
    </Box>
  )
}

export default CustomContract
