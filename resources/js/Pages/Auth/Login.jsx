import React, { useState } from 'react'
import { Inertia } from '@inertiajs/inertia'
import { Link, usePage } from '@inertiajs/inertia-react'
import LayoutAuth from '../../Shared/LayoutAuth'

const Login = () => {
  const { errors } = usePage().props
  const [values, setValues] = useState({
    email: '',
    password: '',
    remember: false
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
    Inertia.post('/login', values)
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="mb-2 mt-8"><img src="https://res.cloudinary.com/dji0yvkef/image/upload/v1628691598/BDLogo.png" height="150" width="150"/></div>
      <div className="rounded-md shadow-sm bg-white p-4 w-96 m-2">
        <p className="text-center text-2xl mb-2">Login</p>
        <form onSubmit={handleSubmit}>
          <div className="my-2">
            <label htmlFor="email" className="block"><span className="text-gray-700">Email</span></label>
            <input id="email" value={values.email} onChange={handleChange} type="email" className="form-input form" />
            {errors.email && <div className="text-sm text-red-500">{errors.email}</div>}
          </div>
          <div className="my-2">
            <label htmlFor="password" className="block"><span className="text-gray-700">Password</span></label>
            <input id="password" value={values.password} onChange={handleChange} type="password" className="form-input form" />
            {errors.password && <div className="text-sm text-red-500">{errors.password}</div>}
          </div>
          <div className="my-2">
            <label htmlFor="remember" className="w-1/2 inline-flex items-center">
              <input id="remember" checked={values.remember} onChange={handleChange} type="checkbox" className="form-checkbox rounded border-gray-300 text-orange-500 shadow-sm focus:border-orange-300 focus:ring focus:ring-offset-0 focus:ring-orange-200 focus:ring-opacity-50" />
              <span className="text-gray-700 ml-2">Remember me</span>
            </label>
            <div className="w-1/2 inline-flex justify-end align-text-bottom">
              <Link href="/password" className="text-gray-700">Forgotten password?</Link>
            </div>
          </div>
          <button className="btn btn-primary w-full">Login</button>
        </form>
        <div className="mt-2">
          <Link href="/register">New to Bush Divers?</Link>
        </div>
      </div>
    </div>
  )
}

Login.layout = page => <LayoutAuth children={page} title="Login" />

export default Login
