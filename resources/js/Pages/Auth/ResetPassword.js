import React, { useState } from 'react'
import { Inertia } from '@inertiajs/inertia'
import { usePage } from '@inertiajs/inertia-react'
import LayoutAuth from '../../Shared/LayoutAuth'

const ResetPassword = ({ token }) => {
  const { errors } = usePage().props
  console.log(errors)
  const [values, setValues] = useState({
    password: '',
    token: token
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
    Inertia.post('/password/reset', values)
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="mb-2 mt-8"><img src="https://res.cloudinary.com/dji0yvkef/image/upload/v1628691598/BDLogo.png" height="150" width="150"/></div>
      <div className="rounded-md shadow-sm bg-white p-4 w-96 m-2">
        <p className="text-center text-2xl mb-2">Reset Password</p>
        <form onSubmit={handleSubmit}>
          <div className="my-2">
            <label htmlFor="password" className="block"><span className="text-gray-700">Password</span></label>
            <input id="password" value={values.password} onChange={handleChange} type="password" className="form-input form" />
            {errors.password && <div className="text-sm text-red-500">{errors.password}</div>}
          </div>
          <button className="btn btn-primary w-full">Reset password</button>
        </form>
      </div>
    </div>
  )
}

ResetPassword.layout = page => <LayoutAuth children={page} title="Reset Password" />

export default ResetPassword
