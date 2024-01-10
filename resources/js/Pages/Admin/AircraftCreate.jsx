import { Card, CardBody } from '@chakra-ui/react'
import { Inertia, usePage } from '@inertiajs/react'
import React, { useState } from 'react'

import AppLayout from '../../components/layout/AppLayout'

const AircraftCreate = ({ fleet, hubs, fleetId }) => {
  const { errors } = usePage().props
  const [values, setValues] = useState({
    fleet: fleetId ?? '1',
    registration: '',
    hub: 'AYMR',
  })

  function handleChange(e) {
    const key = e.target.id
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setValues((values) => ({
      ...values,
      [key]: value,
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    Inertia.post('/admin/aircraft/create', values)
  }

  return (
    <div className="p-4">
      <Card>
        <CardBody>
          <div className="lg:w-1/2 mt-2 p-4 rounded shadow">
            <form onSubmit={handleSubmit}>
              <div className="my-2">
                <label htmlFor="fleet" className="block">
                  Fleet type
                </label>
                <select
                  id="fleet"
                  value={values.fleet}
                  onChange={handleChange}
                  className="select"
                >
                  {fleet.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.type}
                    </option>
                  ))}
                </select>
                {errors.fleet && (
                  <div className="text-sm text-red-500">{errors.fleet}</div>
                )}
              </div>
              <div className="my-2">
                <label htmlFor="registration" className="block">
                  Registration
                </label>
                <input
                  id="registration"
                  value={values.registration}
                  onChange={handleChange}
                  type="text"
                  className="input"
                />
                {errors.registration && (
                  <div className="text-sm text-red-500">
                    {errors.registration}
                  </div>
                )}
              </div>
              <div className="my-2">
                <label htmlFor="hub" className="block">
                  Start location
                </label>
                <select
                  id="hub"
                  value={values.hub}
                  onChange={handleChange}
                  className="select"
                >
                  {hubs.map((hub) => (
                    <option key={hub.identifier} value={hub.identifier}>
                      {hub.identifier}
                    </option>
                  ))}
                </select>
                {errors.hub && (
                  <div className="text-sm text-red-500">{errors.hub}</div>
                )}
              </div>
              <div className="my-2">
                <label htmlFor="cost" className="block">
                  Cost
                </label>
                <input
                  id="cost"
                  value={values.cost}
                  onChange={handleChange}
                  type="number"
                  className="input"
                />
              </div>
              <button className="btn btn-primary">Create Aircraft</button>
            </form>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

AircraftCreate.layout = (page) => (
  <AppLayout
    children={page}
    title="Admin - Create Aircraft"
    heading="Create New Aircraft"
  />
)

export default AircraftCreate
