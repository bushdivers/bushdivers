import React, { useState } from 'react'
import { usePage } from '@inertiajs/inertia-react'
import { Inertia } from '@inertiajs/inertia'
import AppLayout from '../../Shared/AppLayout'
import Card from '../../Shared/Elements/Card'
import TextInput from '../../Shared/Elements/Forms/TextInput'

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
      <div className="mt-4">
        <Card>
        <div className="w-1/2">
          <form onSubmit={handleSubmit}>
            <TextInput id="pirep_id" value={values.pirep_id} type="text" label="Pirep Id" onChange={handleChange} error={errors?.pirep_id} />
            <TextInput id="fuel_used" value={values.fuel_used} type="text" label="Fuel Used (gal)" onChange={handleChange} error={errors?.fuel_used} />
            <TextInput id="distance" value={values.distance} type="text" label="Distance (nm)" onChange={handleChange} error={errors?.distance} />
            <TextInput id="flight_time_mins" value={values.flight_time_mins} type="text" label="Flight Time (mins)" onChange={handleChange} error={errors?.flight_time_mins} />
            <button className="btn btn-primary mt-2">Submit Pirep for Review</button>
          </form>
        </div>
        </Card>
      </div>
    </div>
  )
}

Submission.layout = page => <AppLayout children={page} title="Submit Pirep" heading="Submit Manual Pirep" />

export default Submission
