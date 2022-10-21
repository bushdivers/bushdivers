import React, { useState } from 'react'
import { Inertia } from '@inertiajs/inertia'

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
    <div className="flex items-end">
      {error && <div className="text-sm text-red-500 mt-1">{error}</div>}
      <div className="inline-block mx-2">
        <label htmlFor="icao"><span>Departure Airport (ICAO)</span></label>
        <input id="icao" type="text" className="form-input form" value={dep} onChange={handleChangeDep} />
      </div>
      <div className="inline-block mx-2">
        <label htmlFor="icao"><span>Arrival Airport (ICAO)</span></label>
        <input id="icao" type="text" className="form-input form" value={arr} onChange={handleChangeArr} />
      </div>
      <div className="inline-block mx-2">
        <button onClick={() => handleCreate()} className="btn btn-primary">Create</button>
      </div>
    </div>
  )
}

export default CustomContract
