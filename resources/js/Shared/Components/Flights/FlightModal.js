import React, { useState, useEffect, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import FlightMap from './FlightMap'

const FlightModal = (props) => {
  const [show, setShow] = useState(false)

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
                    <FlightMap flight={props.flight} size="small" />
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

export default FlightModal
