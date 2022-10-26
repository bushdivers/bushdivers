import React, { useState } from 'react'
import { Inertia } from '@inertiajs/inertia'
import TextInput from '../../Elements/Forms/TextInput'

const CustomContract = ({ departureIcao, hideSection }) => {
  const [error, setError] = useState(null)
  const [dep, setDep] = useState(departureIcao)
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
      await Inertia.post('/contracts/custom', { departure: dep, arrival: arr })
      hideSection()
    } else {
      setError('Please enter a departure and arrival ICAO')
    }
  }

  return (
    <div className="flex items-end space-x-2">
      {error && <div className="text-sm text-red-500 mt-1">{error}</div>}
      <TextInput inline id="icaoDep" value={dep} type="text" onChange={handleChangeDep} placeHolder="Departure ICAO" label="Departure (ICAO)" />
      <TextInput inline id="icaoArr" value={arr} type="text" onChange={handleChangeArr} placeHolder="Arrival ICAO" label="Arrival (ICAO)" />
      <div className="inline-block">
        <button onClick={() => handleCreate()} className="btn btn-primary">Create</button>
      </div>
    </div>
  )
}

export default CustomContract
