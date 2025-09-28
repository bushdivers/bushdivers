import { Box, Button, Flex, Input, Text } from '@chakra-ui/react'
import { router, usePage } from '@inertiajs/react'
import React, { useState } from 'react'

const CustomContract = ({ hideSection }) => {
  const { auth } = usePage().props
  const [error, setError] = useState(null)
  const [dep, setDep] = useState(auth.user.location.identifier)
  const [arr, setArr] = useState('')

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
      await router.post('/contracts/custom', { departure: dep, arrival: arr })
      hideSection()
    } else {
      setError('Please enter a departure and arrival ICAO')
    }
  }

  return (
    <Flex alignItems="end" gap={2}>
      {error && (
        <Text color="red.500" size="sm" mt={1}>
          {error}
        </Text>
      )}
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
  )
}

export default CustomContract
