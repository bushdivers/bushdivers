import React, { useState } from 'react'
import { usePage } from '@inertiajs/inertia-react'
import { Inertia } from '@inertiajs/inertia'
import AppLayout from '../../Shared/AppLayout'

const Submission = () => {
  const { errors } = usePage().props
  const [values, setValues] = useState({
    pirep_id: null,
    fuel_used: null,
    distance: null,
    flight_time_mins: null
  })

  function handleChange (e) {
    const key = e.target.id
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setValues(values => ({
      ...values,
      [key]: value
    }))
  }

  function handleSubmit (e) {
    e.preventDefault()
    Inertia.post('/pireps/submit', values)
  }

  return (
    <div className="p-4">
      <p>This page is for submitting pireps manually, in case Bush Tracker is unable to submit a pirep. All submission will be reviewed by management</p>
      <div className="bg-white rounded shadow p-4 mt-4">
        <div className="w-1/2">
          <form onSubmit={handleSubmit}>
            <div className="my-2">
              <label htmlFor="pirep_id" className="block"><span className="text-gray-700">Pirep Id</span><span className="text-sm ml-2">(Can be found on dispatch page)</span></label>
              <input id="pirep_id" value={values.pirep_id} onChange={handleChange} type="text" className="form-input form" />
              {errors.pirep_id && <div className="text-sm text-red-500">{errors.pirep_id}</div>}
            </div>
            <div className="my-2">
              <label htmlFor="fuel_used" className="block"><span className="text-gray-700">Fuel Used (Gal)</span></label>
              <input id="fuel_used" value={values.fuel_used} onChange={handleChange} type="text" className="form-input form" />
              {errors.fuel_used && <div className="text-sm text-red-500">{errors.fuel_used}</div>}
            </div>
            <div className="my-2">
              <label htmlFor="distance" className="block"><span className="text-gray-700">Distance Flown (nm)</span></label>
              <input id="distance" value={values.distance} onChange={handleChange} type="text" className="form-input form" />
              {errors.distance && <div className="text-sm text-red-500">{errors.distance}</div>}
            </div>
            <div className="my-2">
              <label htmlFor="flight_time_mins" className="block"><span className="text-gray-700">Flight Time (minutes)</span></label>
              <input id="flight_time_mins" value={values.flight_time_mins} onChange={handleChange} type="text" className="form-input form" />
              {errors.flight_time_mins && <div className="text-sm text-red-500">{errors.flight_time_mins}</div>}
            </div>
            <button className="btn btn-primary">Submit Pirep for Review</button>
          </form>
        </div>
      </div>
    </div>
  )
}

Submission.layout = page => <AppLayout children={page} title="Submit Pirep" heading="Submit Manual Pirep" />

export default Submission
