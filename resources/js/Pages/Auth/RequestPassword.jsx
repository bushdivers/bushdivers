import React, { useState } from 'react'
import { Inertia } from '@inertiajs/inertia'
import { usePage } from '@inertiajs/inertia-react'
import LayoutAuth from '../../Shared/LayoutAuth'

const RequestPassword = () => {
  const { errors } = usePage().props
  console.log(errors)
  const [values, setValues] = useState({
    email: ''
  })

  function handleChange (e) {
    const key = e.target.id
    const value = e.target.value
    setValues(values => ({
      ...values,
      [key]: value
    }))
  }

  function handleSubmit (e) {
    e.preventDefault()
    Inertia.post('/password', values)
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="mb-2 mt-8"><img src="https://res.cloudinary.com/dji0yvkef/image/upload/v1628691598/BDLogo.png" height="150" width="150"/></div>
      <div className="rounded-md shadow-sm bg-white p-4 w-96 m-2">
        <p className="text-center text-2xl mb-2">Request new password</p>
        <form onSubmit={handleSubmit}>
          <div className="my-2">
            <label htmlFor="email" className="block"><span className="text-gray-700">Email</span></label>
            <input id="email" value={values.email} onChange={handleChange} type="email" className="form-input form" />
            {errors.email && <div className="text-sm text-red-500">{errors.email}</div>}
          </div>
          <button className="btn btn-primary w-full">Request password</button>
        </form>
      </div>
    </div>
  )
}

RequestPassword.layout = page => <LayoutAuth children={page} title="Request Password" />

export default RequestPassword
