import React, { useState } from 'react'
import { usePage } from '@inertiajs/inertia-react'
import { Inertia } from '@inertiajs/inertia'

const SearchInput = () => {
  const { errors } = usePage().props
  const urlParams = new URLSearchParams(window.location.search)
  const departure = urlParams.get('dep') === null ? '' : urlParams.get('dep')
  const arrival = urlParams.get('arr') === null ? '' : urlParams.get('arr')

  const [values, setValues] = useState({
    dep: departure,
    arr: arrival
  })

  function handleChange (e) {
    const key = e.target.id
    const value = e.target.value
    Inertia.remember(value, key)
    setValues(values => ({
      ...values,
      [key]: value
    }))
  }

  function handleSubmit (e) {
    e.preventDefault()
    Inertia.get(`/flights/search/?dep=${values.dep}&arr=${values.arr}`)
  }

  function handleReset () {
    setValues({ dep: '', arr: '' })
    Inertia.get('/flights')
  }

  return (
    <div className="shadow rounded bg-white p-2 mb-4">
      <form className="md:flex md:items-center" onSubmit={handleSubmit}>
        <div className="my-2 md:w-1/3 md:flex">
          <label htmlFor="dep"><span className="text-gray-700">Departure ICAO</span></label>
          <input id="dep" type="text" className="form-input form" value={values.dep} onChange={handleChange} />
          {errors.dep && <div className="text-sm text-red-500">{errors.dep}</div>}
        </div>
        <div className="my-2 md:ml-2 md:w-1/3 md:flex">
          <label htmlFor="dep" className="inline"><span className="text-gray-700">Arrival ICAO</span></label>
          <input id="arr" type="text" className="form-input form" value={values.arr} onChange={handleChange} />
          {errors.arr && <div className="text-sm text-red-500">{errors.arr}</div>}
        </div>
        <button type="submit" className="btn btn-primary md:flex md:ml-2">Search</button>
        <button type="reset" onClick={handleReset} className="btn btn-primary md:flex md:ml-2">Clear Results</button>
      </form>
    </div>
  )
}

export default SearchInput
