import React, { useState, useEffect } from 'react'
import PageTitle from '../../Shared/Navigation/PageTitle'
import Layout from '../../Shared/Layout'
import axios from 'axios'
import { RadioGroup } from '@headlessui/react'
import { usePage } from '@inertiajs/inertia-react'
import { Inertia } from '@inertiajs/inertia'
import CharterMap from '../../Shared/Components/Flights/CharterMap'

const CharterFlight = ({ user }) => {
  const { errors } = usePage().props
  const [error, setError] = useState(null)
  const [distance, setDistance] = useState(null)
  const [airport, setAirport] = useState('')
  const [icao, setIcao] = useState('')
  const [destination, setDestination] = useState('')
  const [destinationDetail, setDestinationDetail] = useState(null)
  const [values, setValues] = useState({
    aircraft: '',
    cruise: ''
  })
  const [cargoType, setCargoType] = useState('')
  const [availableAircraft, setAvailableAircraft] = useState([])

  useEffect(async () => {
    const response = await axios.get(`/api/aircraft/${user.location.identifier}`)
    const acList = response.data.aircraft.map((aircraft) => (<option key={aircraft.id}>{aircraft.fleet.name} - {aircraft.registration}</option>))
    setAvailableAircraft(acList)
  }, [])

  const handleChange = async (e) => {
    setError(null)
    setAirport(null)
    setIcao(e.target.value)
    if (e.target.value.length >= 3) {
      const response = await axios.get(`/api/airport/search/${e.target.value}`)
      if (response.data.airport) {
        setAirport(`${response.data.airport.identifier} - ${response.data.airport.name}`)
        setDestination(response.data.airport.identifier)
        setDestinationDetail(response.data.airport)
        setError(null)
        const disResp = await axios.get(`/api/flights/distance/${user.current_airport_id}/${response.data.airport.identifier}`)
        if (disResp.status === 200) {
          setDistance(disResp.data.distance)
        } else {
          setError('Cannot calculate distance')
        }
      } else {
        setDestinationDetail(null)
        setDestination('')
        setError('No airport found')
      }
    }
  }

  function handleCreateFormChange (e) {
    const key = e.target.id
    const value = e.target.value
    setValues(values => ({
      ...values,
      [key]: value
    }))
  }

  async function handleSubmit (e) {
    e.preventDefault()
    if (!icao) {
      setError('Please specify an destination')
      return
    }
    const data = {
      aircraft: values.aircraft,
      cargo: cargoType,
      cruise: values.cruise,
      dep: user.location.identifier,
      arr: destination,
      distance: distance
    }
    await Inertia.post('/charter', data)
  }

  return (
    <div>
      <PageTitle title="Charter Flight" />
      <div className="flex justify-between">
        <div className="w-1/2 rounded shadow p-4 mx-2 mt-4 bg-white">
          <div className="flex justify-between">
            <div className="w-1/3">
              <div>Current Location:</div>
              <div className="text-lg">{user.location.identifier} - {user.location.name}</div>
            </div>
            <div className="w-1/3">
              {distance && (
                <>
                  <div>Distance:</div>
                  <div>{distance} nm</div>
                </>
              )}
            </div>
            <div className="w-1/3">
              <label htmlFor="arr"><span className="text-gray-700">Destination (ICAO)</span></label>
              <input id="arr" type="text" className="form-input form" value={icao} onChange={handleChange} />
              {error && <div className="text-sm text-red-500 mt-1">{error}</div>}
              {airport && <div className="text-sm mt-1">{airport}</div>}
            </div>
          </div>

          {destination && (
            <div className="mt-2">
            <form onSubmit={handleSubmit}>
              <div className="my-2">
                <label htmlFor="aircraft" className="block"><span className="text-gray-700">Select Aircraft</span></label>
                <select id="aircraft" value={values.aircraft} onChange={handleCreateFormChange} className="form-select form">
                  <option>Please select an aircraft</option>
                  {availableAircraft}
                </select>
                {errors.aircraft && <div className="text-sm text-red-500">{errors.aircraft}</div>}
              </div>
              <div className="my-2">
                <label htmlFor="cruise" className="block"><span className="text-gray-700">Cruise Altitude</span></label>
                <input id="cruise" value={values.cruise} onChange={handleCreateFormChange} type="text" className="form-input form" />
                {errors.cruise && <div className="text-sm text-red-500">{errors.cruise}</div>}
              </div>
              <div className="my-2">
                <RadioGroup value={cargoType} onChange={setCargoType}>
                  <RadioGroup.Label>Cargo Type</RadioGroup.Label>
                  <div className="bg-white my-1 rounded">
                    <RadioGroup.Option
                      value="cargo"
                      className={({ checked }) => `
                                ${checked ? 'bg-orange-50 border-orange-200' : 'border-gray-200'}
                                relative border p-4 flex rounded
                              `}
                    >
                      {({ checked }) => (
                        <div className="flex flex-col">
                          {/* This Label is for the `RadioGroup.Option`.  */}
                          <RadioGroup.Label
                            as="span"
                            className={'block text-sm font-medium ' + (
                              checked ? 'text-orange-900' : 'text-gray-900'
                            )}
                          >
                            Cargo
                          </RadioGroup.Label>

                          {/* This Description is for the `RadioGroup.Option`.  */}
                          <RadioGroup.Description
                            as="span"
                            className={'block text-sm ' + (
                              checked ? 'text-orange-700' : 'text-gray-500'
                            )}
                          >
                            Cargo type will be determined later
                          </RadioGroup.Description>
                        </div>
                      )}
                    </RadioGroup.Option>
                  </div>
                  <div className="bg-white rounded-md">
                    <RadioGroup.Option
                      value="pax"
                      className={({ checked }) => `
                                ${checked ? 'bg-orange-50 border-orange-200' : 'border-gray-200'}
                                relative border p-4 flex rounded
                              `}
                    >
                      {({ checked }) => (
                        <div className="flex flex-col">
                          {/* This Label is for the `RadioGroup.Option`.  */}
                          <RadioGroup.Label
                            as="span"
                            className={'block text-sm font-medium ' + (
                              checked ? 'text-orange-900' : 'text-gray-900'
                            )}
                          >
                            Passenger
                          </RadioGroup.Label>

                          {/* This Description is for the `RadioGroup.Option`.  */}
                          <RadioGroup.Description
                            as="span"
                            className={'block text-sm ' + (
                              checked ? 'text-orange-700' : 'text-gray-500'
                            )}
                          >
                            Passengers and their cargo
                          </RadioGroup.Description>
                        </div>
                      )}
                    </RadioGroup.Option>
                  </div>
                </RadioGroup>
              </div>
              <button className="btn btn-secondary">Create Charter Flight</button>
            </form>
          </div>
          )}
        </div>
        <div className="w-1/2 mt-4 rounded shadow p-4 bg-white mx-2">
          <CharterMap departure={user.location} destination={destinationDetail} size="large" />
        </div>
      </div>
    </div>
  )
}

CharterFlight.layout = page => <Layout children={page} title="Charter Flight" />

export default CharterFlight
