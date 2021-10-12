import React, { useState } from 'react'
import PageTitle from '../../Shared/Navigation/PageTitle'
import Layout from '../../Shared/Layout'
import { Inertia } from '@inertiajs/inertia'
import { usePage } from '@inertiajs/inertia-react'
import ApiKey from '../../Shared/Components/Crew/ApiKey'
import TransferHub from '../../Shared/Components/Crew/TransferHub'

const Profile = ({ profile, hubs }) => {
  const { errors } = usePage().props
  const [values, setValues] = useState({
    email: profile.email,
    password: null,
    name: profile.name,
    opt_in: profile.opt_in,
    msfs_username: profile.msfs_username,
    volanta_username: profile.volanta_username,
    discord_username: profile.discord_username
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
    Inertia.put('/profile', values)
  }

  return (
    <div>
      <PageTitle title="Profile" />
      <div className="flex flex-col md:flex-row justify-between md:items-start">
        <div className="bg-white rounded shadow mt-4 p-4 md:w-1/2">
          <form onSubmit={handleSubmit}>
            <div className="my-2">
              <label htmlFor="email" className="block"><span className="text-gray-700">Email</span></label>
              <input id="email" value={values.email} onChange={handleChange} type="email" className="form-input form" />
              {errors.email && <div className="text-sm text-red-500">{errors.email}</div>}
            </div>
            <div className="my-2">
              <label htmlFor="name" className="block"><span className="text-gray-700">Name</span></label>
              <input id="name" value={values.name} onChange={handleChange} type="text" className="form-input form" />
              {errors.name && <div className="text-sm text-red-500">{errors.name}</div>}
            </div>
            <div className="my-2">
              <label htmlFor="password" className="block"><span className="text-gray-700">Password</span></label>
              <input id="password" value={values.password} onChange={handleChange} type="password" className="form-input form" />
              {errors.password && <div className="text-sm text-red-500">{errors.password}</div>}
            </div>
            <div className="my-2">
              <label htmlFor="msfs_username" className="block"><span className="text-gray-700">MSFS username</span></label>
              <input id="msfs_username" value={values.msfs_username} onChange={handleChange} type="text" className="form-input form" />
            </div>
            <div className="my-2">
              <label htmlFor="volanta_username" className="block"><span className="text-gray-700">Volanta username</span></label>
              <input id="volanta_username" value={values.volanta_username} onChange={handleChange} type="text" className="form-input form" />
            </div>
            <div className="my-2">
              <label htmlFor="discord_username" className="block"><span className="text-gray-700">Discord username</span></label>
              <input id="discord_username" value={values.discord_username} onChange={handleChange} type="text" className="form-input form" />
            </div>
            <div className="my-2">
              <label htmlFor="opt_in" className="inline-flex items-center">
                <input id="opt_in" checked={values.opt_in} onChange={handleChange} type="checkbox" className="form-checkbox rounded border-gray-300 text-orange-500 shadow-sm focus:border-orange-300 focus:ring focus:ring-offset-0 focus:ring-orange-200 focus:ring-opacity-50" />
                <span className="text-gray-700 ml-2">Opt in to notification emails</span>
              </label>
            </div>
            <button className="btn btn-primary">Update profile</button>
          </form>
        </div>
        <div className="md:w-1/2 md:ml-4 mt-4">
          <div className="bg-white rounded shadow p-4">
            <ApiKey apiKey={profile.api_token} />
          </div>
          <div className="bg-white rounded shadow p-4 mt-4">
            <TransferHub currentHub={profile.hub} hubs={hubs} />
          </div>
        </div>
      </div>
    </div>
  )
}

Profile.layout = page => <Layout children={page} title="Profile" />

export default Profile
