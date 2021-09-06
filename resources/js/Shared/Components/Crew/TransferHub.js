import React, { useState } from 'react'
import { Inertia } from '@inertiajs/inertia'

const TransferHub = ({ currentHub, hubs }) => {
  const [values, setValues] = useState({
    hub: ''
  })

  function handleChange (e) {
    console.log(e.target.value)
    const key = e.target.id
    const value = e.target.value
    setValues(values => ({
      ...values,
      [key]: value
    }))
  }

  function handleSubmit (e) {
    e.preventDefault()
    Inertia.put('/profile/transfer', { hub: values.hub })
  }

  return (
    <div>
      <h2 className="text-lg font-bold">Transfer Hub</h2>
      <p>Current Hub: {currentHub.identifier} - {currentHub.name}</p>
      <form onSubmit={handleSubmit}>
        <div className="my-2">
          <label htmlFor="hub" className="block"><span className="text-gray-700">Select a new hub</span></label>
          <select id="hub" value={values.hub.identifier} onChange={handleChange} className="form-select form">
            {hubs.map((hub) => (<option key={hub.identifier} value={hub.identifier}>{hub.identifier} - {hub.name}</option>))}
          </select>
        </div>
        <button className="btn btn-primary">Transfer Hub</button>
      </form>
    </div>
  )
}

export default TransferHub
