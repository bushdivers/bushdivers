import React, { useState, useEffect, Fragment } from 'react'
import { Dialog, Transition, RadioGroup } from '@headlessui/react'
import axios from 'axios'
import { usePage } from '@inertiajs/inertia-react'
import { Inertia } from '@inertiajs/inertia'

const DispatchModal = (props) => {
  const { errors } = usePage().props
  const [show, setShow] = useState(false)
  const [values, setValues] = useState({
    aircraft: '',
    booking: '',
    cruise: ''
  })
  const [cargoType, setCargoType] = useState('')
  const [availableAircraft, setAvailableAircraft] = useState([])

  useEffect(async () => {
    const response = await axios.get(`/api/aircraft/${props.flight.dep_airport_id}`)
    const acList = response.data.aircraft.map((aircraft) => (<option key={aircraft.id}>{aircraft.fleet.name} - {aircraft.registration}</option>))
    setAvailableAircraft(acList)
  }, [props.booking])

  useEffect(() => {
    setValues(values => ({
      ...values,
      booking: props.booking
    }))
  }, [props.booking])

  function handleChange (e) {
    const key = e.target.id
    const value = e.target.value
    setValues(values => ({
      ...values,
      [key]: value
    }))
  }

  async function handleSubmit (e) {
    e.preventDefault()
    const data = {
      aircraft: values.aircraft,
      booking: values.booking,
      cargo: cargoType,
      flight: props.flight.id,
      cruise: values.cruise
    }
    await Inertia.post('/bookings/dispatch/create', data)
    onCloseModal()
  }

  useEffect(() => {
    setShow(props.show)
  }, [props.show])

  function onCloseModal () {
    props.onClose()
  }

  return (
    <>
      <Transition appear show={show} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => null}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-lg rounded">
                <div className="flex items-center justify-between">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-medium leading-6 text-gray-900"
                  >
                    Flight - BDV{props.flight.flight_number}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="p-1 rounded-full text-gray-700 hover:bg-gray-50 focus:outline-none block"
                    onClick={onCloseModal}
                  >
                    <span className="sr-only">View notifications</span>
                    <div className="h-6 w-6" aria-hidden="true"><i className="material-icons">close</i></div>
                  </button>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between items-center">
                    <div>
                      Departure:
                      <p className="text-2xl mt-1">{props.flight.dep_airport_id}</p>
                    </div>
                    <div>
                      <span>{props.flight.distance}nm</span>
                    </div>
                    <div>
                      Arrival:
                      <p className="text-2xl mt-1">{props.flight.arr_airport_id}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <form onSubmit={handleSubmit}>
                      <div className="my-2">
                        <label htmlFor="aircraft" className="block"><span className="text-gray-700">Select Aircraft</span></label>
                        <select id="aircraft" value={values.aircraft} onChange={handleChange} className="form-select form">
                          <option>Please select an aircraft</option>
                          {availableAircraft}
                        </select>
                        {errors.aircraft && <div className="text-sm text-red-500">{errors.aircraft}</div>}
                      </div>
                      <div className="my-2">
                        <label htmlFor="cruise" className="block"><span className="text-gray-700">Cruise Altitude</span></label>
                        <input id="cruise" value={values.cruise} onChange={handleChange} type="text" className="form-input form" />
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
                      <button className="btn btn-secondary">Create Dispatch</button>
                    </form>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default DispatchModal
