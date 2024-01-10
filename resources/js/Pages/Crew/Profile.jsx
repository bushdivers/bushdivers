import { Card, CardBody, Icon } from '@chakra-ui/react'
import { Inertia, Link, usePage } from '@inertiajs/react'
import { Award, CheckCircle2 } from 'lucide-react'
import React, { useState } from 'react'

import ApiKey from '../../components/crew/ApiKey'
import CheckBox from '../../components/elements/forms/CheckBox'
import TextInput from '../../components/elements/forms/TextInput'
import AppLayout from '../../components/layout/AppLayout'
import { convertMinuteDecimalToHoursAndMinutes } from '../../helpers/date.helpers'

const Profile = ({ profile, rank, nextRank, awards }) => {
  const { errors } = usePage().props
  const [values, setValues] = useState({
    email: profile.email,
    password: null,
    name: profile.name,
    opt_in: profile.opt_in,
    msfs_username: profile.msfs_username,
    volanta_username: profile.volanta_username,
    discord_username: profile.discord_username,
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
    Inertia.put('/profile', values)
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between md:items-start">
        <div className="mt-4 md:w-1/2">
          <Card>
            <CardBody>
              <form onSubmit={handleSubmit}>
                <TextInput
                  id="email"
                  type="email"
                  value={values.email}
                  label="Email"
                  error={errors?.email}
                  onChange={handleChange}
                />
                <TextInput
                  id="name"
                  type="text"
                  value={values.name}
                  label="Name"
                  error={errors?.name}
                  onChange={handleChange}
                />
                <TextInput
                  id="password"
                  type="password"
                  value={values.password}
                  label="Password"
                  error={errors?.password}
                  onChange={handleChange}
                />
                <TextInput
                  id="msfs_username"
                  type="text"
                  value={values.msfs_username}
                  label="MSFS Username"
                  error={errors?.msfs_username}
                  onChange={handleChange}
                />
                <TextInput
                  id="volanta_username"
                  type="text"
                  value={values.volanta_username}
                  label="Volanta Username"
                  error={errors?.volanta_username}
                  onChange={handleChange}
                />
                <TextInput
                  id="discord_username"
                  type="text"
                  value={values.discord_username}
                  label="Discord Username"
                  error={errors?.discord_username}
                  onChange={handleChange}
                />
                <div className="mt-2">
                  <CheckBox
                    id="opt_in"
                    label="Opt in to notification emails"
                    value={values.opt_in}
                    onChange={handleChange}
                  />
                </div>
                <div className="text-right">
                  <button className="btn btn-primary">Update profile</button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
        <div className="md:w-1/2 md:ml-4 mt-4">
          <Card>
            <CardBody>
              <ApiKey apiKey={profile.api_token} />
            </CardBody>
          </Card>
          <div className="mt-4">
            <Card>
              <CardBody>
                {!nextRank ? (
                  <div>
                    Congratulations, {rank.name}.<br />
                    You have achieved the highest rank.
                  </div>
                ) : (
                  <>
                    <div>Next Rank:</div>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-center">
                        <img width="60" src={nextRank.image} />{' '}
                        <span className="ml-2 text-sm">{nextRank.name}</span>
                      </div>
                      <div className="text-sm flex">
                        <div className="mr-2">
                          Hours:{' '}
                          {profile.flights_time >= nextRank.hours * 60 ? (
                            <Icon
                              className="text-green-500"
                              as={CheckCircle2}
                            />
                          ) : (
                            <span>
                              {convertMinuteDecimalToHoursAndMinutes(
                                nextRank.hours * 60 - profile.flights_time
                              )}
                            </span>
                          )}
                          <br />
                          Points:{' '}
                          {profile.points >= nextRank.points ? (
                            <Icon
                              className="text-green-500"
                              as={CheckCircle2}
                            />
                          ) : (
                            <span>{nextRank.points - profile.points}</span>
                          )}
                        </div>
                      </div>
                      <div className="">
                        <div className="text-sm flex items-center"></div>
                      </div>
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          </div>
          <div className="mt-4">
            <Card>
              <CardBody>
                <div className="text-lg flex items-center">
                  <Icon as={Award} className="mr-2" /> Awards
                </div>
                {!awards.length ? (
                  <div className="mt-1 text-sm text-center">
                    No awards yet. <Link href="/ranks#awards">Earn some!</Link>
                  </div>
                ) : (
                  <div className="mt-4 flex flex-col md:flex-row flex-wrap justify-center items-center">
                    {awards &&
                      awards.map((award) => (
                        <div
                          className="mx-2 my-1 w-1/6 flex flex-col items-center"
                          key={award.id}
                        >
                          <img height="100" width="100" src={award.image} />
                          <div className="mt-1 text-sm text-center">
                            {award.name}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

Profile.layout = (page) => (
  <AppLayout children={page} title="Profile" heading="Profile" />
)

export default Profile
