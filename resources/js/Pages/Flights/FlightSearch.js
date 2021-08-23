import React, { useState } from 'react'
import Layout from '../../Shared/Layout'
import PageTitle from '../../Shared/Navigation/PageTitle'
import NoContent from '../../Shared/Elements/NoContent'
import Tooltip from '../../Shared/Elements/Tooltip'
import { usePage, Link } from '@inertiajs/inertia-react'
import { Inertia } from '@inertiajs/inertia'

const EmptyData = () => {
  return (
    <>
      <i className="material-icons md-48">airplane_ticket</i>
      <div>There are no flights</div>
    </>
  )
}

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

const FlightSearch = ({ flights }) => {
  console.log(flights)
  return (
    <div>
      <PageTitle title="Flight Search" />
      <SearchInput />
      <p className="text-sm mb-1">{flights.length > 0 && <span>Total results: {flights.length} </span> } </p>
      <div className="bg-white rounded shadow overflow-x-auto">
        {flights.length === 0
          ? <NoContent content={<EmptyData />} />
          : (
            <div>
              <table className="table table-auto">
                <thead>
                <tr>
                  <th>Flight</th>
                  <th>Departure</th>
                  <th>Arrival</th>
                  <th>Distance</th>
                  <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {flights.map((flight) => (
                  <tr key={flight.id}>
                    <td>BDV{flight.flight_number}</td>
                    <td>{flight.dep_airport_id}</td>
                    <td>{flight.arr_airport_id}</td>
                    <td>{flight.distance}</td>
                    <td>
                      <Tooltip content="Book flight" direction="top">
                        <button className="btn btn-secondary flex items-center">
                          <i className="material-icons">airplane_ticket</i>
                        </button>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
            )
        }
      </div>
    </div>
  )
}

FlightSearch.layout = page => <Layout children={page} title="Flight Search" />

export default FlightSearch
