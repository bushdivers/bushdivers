import { Box, Button, Flex, Input } from '@chakra-ui/react'
import { router, usePage } from '@inertiajs/react'
import React, { useState } from 'react'

const CustomContract = ({ hideSection }) => {
  const { auth } = usePage().props
  const [error, setError] = useState(null)
  const [dep, setDep] = useState(auth.user.current_airport_id)
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
    <Flex className="flex items-end space-x-2">
      {error && <div className="text-sm text-red-500 mt-1">{error}</div>}
      <Input
        inline
        id="icaoDep"
        value={dep}
        type="text"
        onChange={handleChangeDep}
        placeHolder="Departure ICAO"
        label="Departure (ICAO)"
      />
      <Input
        inline
        id="icaoArr"
        value={arr}
        type="text"
        onChange={handleChangeArr}
        placeHolder="Arrival ICAO"
        label="Arrival (ICAO)"
      />
      <Box className="inline-block">
        <Button onClick={() => handleCreate()}>Create</Button>
      </Box>
    </Flex>
  )
}

export default CustomContract
