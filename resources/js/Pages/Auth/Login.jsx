import React, { useState } from 'react'
import { Inertia } from '@inertiajs/inertia'
import { Link, usePage } from '@inertiajs/inertia-react'
import LayoutAuth from '../../Shared/LayoutAuth'
import TextInput from '../../Shared/Elements/Forms/TextInput'
import CheckBox from '../../Shared/Elements/Forms/CheckBox'

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
          <TextInput value={values.email} type="email" id="email" label="Email" placeHolder="Email" onChange={handleChange} error={errors?.email} />
          <TextInput value={values.password} type="password" id="password" label="Password" placeHolder="Password" onChange={handleChange} error={errors?.password} />
          <div className="my-2 flex items-center justify-between">
            <CheckBox id="remember" value={values.remember} label="Remember me" onChange={handleChange} />
            <div className="w-1/2 inline-flex justify-end align-text-bottom">
              <Link href="/password" className="link-primary">Forgotten password?</Link>
            </div>
          </div>
          <button className="btn btn-primary w-full">Login</button>
        </form>
        <div className="mt-2">
          <Link className="link-primary" href="/register">New to Bush Divers?</Link>
        </div>
      </div>
    </div>
  )
}

Login.layout = page => <LayoutAuth children={page} title="Login" />

export default Login
