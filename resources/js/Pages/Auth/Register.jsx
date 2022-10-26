import React, { useState } from 'react'
import { Inertia } from '@inertiajs/inertia'
import { Link, usePage } from '@inertiajs/inertia-react'
import LayoutAuth from '../../Shared/LayoutAuth'
import TextInput from '../../Shared/Elements/Forms/TextInput'
import CheckBox from '../../Shared/Elements/Forms/CheckBox'

const Register = () => {
  const { errors } = usePage().props
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    agree: false,
    optin: false
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
    Inertia.post('/register', values)
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="mb-2 mt-8"><img src="https://res.cloudinary.com/dji0yvkef/image/upload/v1628691598/BDLogo.png" height="150" width="150"/></div>
      <div className="rounded-md shadow-sm bg-white p-4 w-96 m-2">
        <p className="text-center text-2xl mb-2">Register</p>
        <form onSubmit={handleSubmit}>
          <TextInput id="name" label="Full Name" onChange={handleChange} type="text" value={values.name} placeHolder="John Doe" error={errors?.name} />
          <TextInput id="email" label="Email" onChange={handleChange} type="email" value={values.email} placeHolder="john@doe.com" error={errors?.email} />
          <TextInput id="password" label="Password" onChange={handleChange} type="password" value={values.password} placeHolder="Enter a Password" error={errors?.password} />
          <CheckBox id="agree" label="I agree to the terms and conditions" onChange={handleChange} value={values.agree} error={errors?.agree} />
          <CheckBox id="optin" label="Opt in to emails from Bush Divers VA" onChange={handleChange} value={values.optin} />
          <button className="btn btn-primary w-full mt-2">Register</button>
          <div className="mt-2">
            <Link className="link-primary" href="/login">Already have an account?</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

Register.layout = page => <LayoutAuth children={page} title="Register" />

export default Register
