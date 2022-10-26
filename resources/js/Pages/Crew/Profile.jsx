import React, { useState } from 'react'
import { Inertia } from '@inertiajs/inertia'
import { Link, usePage } from '@inertiajs/inertia-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ApiKey from '../../Shared/Components/Crew/ApiKey'
import { convertMinuteDecimalToHoursAndMinutes } from '../../Helpers/date.helpers'
import AppLayout from '../../Shared/AppLayout'
import { faAward, faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { Button } from '../../Components/Button'
import Card from '../../Shared/Elements/Card'
import TextInput from '../../Shared/Elements/Forms/TextInput'
import CheckBox from '../../Shared/Elements/Forms/CheckBox'

const Profile = ({ profile, hubs, rank, nextRank, awards }) => {
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
  const [mapStyle, setMapStyle] = useState(profile.map_style)

  function handleMapChange (e) {
    setMapStyle(e.target.value)
  }

  function handleUpdateMap () {
    console.log('map updated')
    Inertia.put('/settings/map', { map_style: mapStyle })
  }

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
      <div className="flex flex-col md:flex-row justify-between md:items-start">
        <div className="mt-4 md:w-1/2">
          <Card>
          <form onSubmit={handleSubmit}>
            <TextInput id="email" type="email" value={values.email} label="Email" error={errors?.email} onChange={handleChange} />
            <TextInput id="name" type="text" value={values.name} label="Name" error={errors?.name} onChange={handleChange} />
            <TextInput id="password" type="password" value={values.password} label="Password" error={errors?.password} onChange={handleChange} />
            <TextInput id="msfs_username" type="text" value={values.msfs_username} label="MSFS Username" error={errors?.msfs_username} onChange={handleChange} />
            <TextInput id="volanta_username" type="text" value={values.volanta_username} label="Volanta Username" error={errors?.volanta_username} onChange={handleChange} />
            <TextInput id="discord_username" type="text" value={values.discord_username} label="Discord Username" error={errors?.discord_username} onChange={handleChange} />
            <div className="mt-2">
            <CheckBox id="opt_in" label="Opt in to notification emails" value={values.opt_in} onChange={handleChange} />
            </div>
            <div className="text-right"><button className="btn btn-primary">Update profile</button></div>
          </form>
          </Card>
        </div>
        <div className="md:w-1/2 md:ml-4 mt-4">
          <Card>
            <ApiKey apiKey={profile.api_token} />
          </Card>
          <div className="mt-4">
            <Card>
            {!nextRank
              ? <div>Congratulations, {rank.name}.<br/>You have achieved the highest rank.</div>
              : <><div>Next Rank:</div>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center"><img width="60" src={nextRank.image} /> <span className="ml-2 text-sm">{nextRank.name}</span></div>
                  <div className="text-sm flex">
                    <div className="mr-2">
                      Hours: {profile.flights_time >= (nextRank.hours * 60) ? <FontAwesomeIcon className="text-green-500" icon={faCircleCheck} /> : <span>{convertMinuteDecimalToHoursAndMinutes((nextRank.hours * 60) - profile.flights_time)}</span>}<br/>
                      Points: {profile.points >= nextRank.points ? <FontAwesomeIcon className="text-green-500" icon={faCircleCheck} /> : <span>{nextRank.points - profile.points}</span>}
                    </div>
                  </div>
                  <div className="">
                    <div className="text-sm flex items-center">
                    </div>
                  </div>
                </div>
              </>
            }
            </Card>
          </div>
          <div className="mt-4">
            <Card>
            <div className="text-lg flex items-center">
              <FontAwesomeIcon icon={faAward} className="mr-2"/> Awards
            </div>
            {!awards.length
              ? <div className="mt-1 text-sm text-center">No awards yet. <Link href="/ranks#awards">Earn some!</Link></div>
              : <div className="mt-4 flex flex-col md:flex-row flex-wrap justify-center items-center">
                {awards && awards.map((award) => (
                  <div className="mx-2 my-1 w-1/6 flex flex-col items-center"
                       key={award.id}>
                    <img height="100" width="100" src={award.image}/>
                    <div className="mt-1 text-sm text-center">{award.name}</div>
                  </div>
                ))}
              </div>
            }
            </Card>
          </div>
          <div className="mt-4">
            <Card>
            <div>Map Style</div>
            <div className="my-2 flex flex-wrap">
              <div className="mx-2 flex flex-col items-start">
                <label className="inline-flex items-center">
                  <input type="radio" className="form-radio" name="accountType" value="dark" checked={mapStyle === 'dark'} onChange={handleMapChange} />
                  <span className="mx-2 cursor-pointer">Dark</span>
                </label>
                <img src="https://res.cloudinary.com/dji0yvkef/image/upload/c_scale,w_150/v1647292891/BDVA/maps/dark_ftbhz9.png" />
              </div>
              <div className="mx-2 flex flex-col items-start">
                <label className="inline-flex items-center">
                  <input type="radio" className="form-radio" name="accountType" value="light" checked={mapStyle === 'light'} onChange={handleMapChange} />
                    <span className="mx-2 cursor-pointer">Light</span>
                </label>
                <img src="https://res.cloudinary.com/dji0yvkef/image/upload/c_scale,w_150/v1647292892/BDVA/maps/light_ascwde.png"/>
              </div>
              <div className="mx-2 flex flex-col items-start">
                <label className="inline-flex items-center">
                  <input type="radio" className="form-radio" name="accountType" value="street" checked={mapStyle === 'street'} onChange={handleMapChange} />
                  <span className="mx-2 cursor-pointer">Street</span>
                </label>
                <img src="https://res.cloudinary.com/dji0yvkef/image/upload/c_scale,w_150/v1647292892/BDVA/maps/street_liemax.png" />
              </div>
              <div className="mx-2 flex flex-col items-start">
                <label className="inline-flex items-center">
                  <input type="radio" className="form-radio" name="accountType" value="satellite" checked={mapStyle === 'satellite'} onChange={handleMapChange} />
                  <span className="mx-2 cursor-pointer">Satellite</span>
                </label>
                <img src="https://res.cloudinary.com/dji0yvkef/image/upload/c_scale,w_150/v1647292892/BDVA/maps/satellite_rcdhkd.png" />
              </div>
              <div className="mx-2 flex flex-col items-start">
                <label className="inline-flex items-center">
                  <input type="radio" className="form-radio" name="accountType" value="terrain" checked={mapStyle === 'terrain'} onChange={handleMapChange} />
                  <span className="mx-2 cursor-pointer">Terrain (outdoor)</span>
                </label>
                <img src="https://res.cloudinary.com/dji0yvkef/image/upload/c_scale,w_150/v1658312019/BDVA/maps/terrain_khjw8s.png" />
              </div>
            </div>
            <div className="text-right"><Button onClick={handleUpdateMap} appearance="primary">Update</Button></div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

Profile.layout = page => <AppLayout children={page} title="Profile" heading="Profile" />

export default Profile
