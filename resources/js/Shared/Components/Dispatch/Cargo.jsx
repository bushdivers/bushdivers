import React, { useState } from 'react'
import NoContent from '../../Elements/NoContent'
import { faArrowUp, faTicket, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Card from '../../Elements/Card'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Inertia } from '@inertiajs/inertia'
import { usePage } from '@inertiajs/inertia-react'
import CustomContract from '../Contracts/CustomContract'

const EmptyData = (props) => {
  return (
    <>
      <FontAwesomeIcon icon={faTicket} />
      <div>There are no available {props.content}</div>
    </>
  )
}

const Cargo = (props) => {
  const { auth } = usePage().props
  const [showCustom, setShowCustom] = useState(false)

  async function removeFromFlight (contract) {
    const data = {
      id: contract.id,
      userId: auth.user.id,
      action: 'remove'
    }
    const assign = axios.post('/api/contracts/assign', data)
    await toast.promise(assign, {
      loading: '...Removing contract',
      success: 'Contract removed!',
      error: 'Issue removing contract'
    }, { position: 'top-right' })
    Inertia.reload()
  }

  return (
    <div className="mt-2 mr-2">
      <Card title="Select Cargo">
        <div className="flex justify-between">
          <div className="">
            <label htmlFor="deadHead" className="inline-flex items-center">
              <input id="deadHead" checked={props.deadHead} onChange={props.handleDeadHead} type="checkbox" className="form-checkbox rounded border-gray-300 dark:bg-gray-700 text-orange-500 shadow-sm focus:border-orange-300 focus:ring focus:ring-offset-0 focus:ring-orange-200 focus:ring-opacity-50" />
              <span className="ml-2">Deadhead - Run empty</span>
            </label>
          </div>
          <button onClick={() => setShowCustom(!showCustom)} className="btn btn-secondary btn-sm">{showCustom ? <FontAwesomeIcon icon={faTimes} /> : 'Create Custom Contract'}</button>
        </div>
        {showCustom && (<div className="my-4 flex justify-center"><CustomContract hideSection={() => setShowCustom(false)} /></div>)}
      {props.cargo.cargoAtAirport.length === 0
        ? <NoContent content={<EmptyData content="Cargo" />} />
        : (
            !props.deadHead && (
            <div className="overflow-x-auto">
              <h4>Cargo at Current Location</h4>
              <table className="table w-full table-compact mt-2">
                <thead>
                <tr>
                  <td></td>
                  <th>Current</th>
                  <th>Arrival</th>
                  <th>Distance</th>
                  <th>Heading</th>
                  <th>Type</th>
                  <th>Cargo</th>
                  <th></th>
                </tr>
                </thead>
                <tbody>
                {props.cargo.cargoAtAirport.map((detail) => (
                  <tr key={detail.id} className={props.selectedCargo.some(s => s.id === detail.id) ? 'bg-orange-200 hover:bg-orange-100 dark:bg-gray-700 dark:hover:bg-gray-600' : ''}>
                    <td><input id="sel" checked={props.selectedCargo.some(s => s.id === detail.id)} onChange={() => props.handleCargoSelect(detail)} type="checkbox" className="form-checkbox rounded border-gray-300 dark:bg-gray-700 text-orange-500 shadow-sm focus:border-orange-300 focus:ring focus:ring-offset-0 focus:ring-orange-200 focus:ring-opacity-50" /></td>
                    <td>{detail.current_airport_id}</td>
                    <td>{detail.arr_airport_id} {detail.arr_airport.longest_runway_surface === 'W' && <span className="material-icons md-18">anchor</span>}</td>
                    <td>{detail.distance.toLocaleString(navigator.language)} nm</td>
                    <td>
                      <div className="flex items-center">
                        <div className="w-1/2">
                          <span className="mr-2">{detail.heading}</span>
                        </div>
                        <div className="w-1/2 flex">
                          <span style={{ transform: `rotate(${detail.heading}deg)` }}><FontAwesomeIcon icon={faArrowUp} /></span>
                        </div>
                      </div>
                    </td>
                    <td>{detail.cargo_type === 1 ? 'Cargo' : 'Passenger'}</td>
                    <td>
                      {detail.cargo_type === 1
                        ? <div><span>{detail.cargo_qty.toLocaleString(navigator.language)} lbs</span> <span className="text-xs">{detail.cargo}</span></div>
                        : <div><span>{detail.cargo_qty}</span> <span className="text-xs">{detail.cargo}</span></div>
                      }
                      {detail.is_custom && <span className="badge badge-primary">custom</span>}
                    </td>
                    <td><button onClick={() => removeFromFlight(detail)} className="btn btn-secondary btn-xs"><FontAwesomeIcon icon={faTimes} /></button></td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
            )
          )
      }
        {props.cargo.cargoElsewhere && (
        <div className="overflow-x-auto mt-2">
          <h4>Cargo Elsewhere</h4>
          <table className="table w-full table-compact mt-2">
            <thead>
            <tr>
              <th>Current</th>
              <th>Arrival</th>
              <th>Distance</th>
              <th>Heading</th>
              <th>Type</th>
              <th>Cargo</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            {props.cargo.cargoElsewhere.map((detail) => (
              <tr key={detail.id}>
                <td>{detail.current_airport_id}</td>
                <td>{detail.arr_airport_id} {detail.arr_airport.longest_runway_surface === 'W' && <span className="material-icons md-18">anchor</span>}</td>
                <td>{detail.distance.toLocaleString(navigator.language)} nm</td>
                <td>
                  <div className="flex items-center">
                    <div className="w-1/2">
                      <span className="mr-2">{detail.heading}</span>
                    </div>
                    <div className="w-1/2 flex">
                      <span style={{ transform: `rotate(${detail.heading}deg)` }}><FontAwesomeIcon icon={faArrowUp} /></span>
                    </div>
                  </div>
                </td>
                <td>{detail.cargo_type === 1 ? 'Cargo' : 'Passenger'}</td>
                <td>
                  {detail.cargo_type === 1
                    ? <div><span>{detail.cargo_qty.toLocaleString(navigator.language)} lbs</span> <span className="text-xs">{detail.cargo}</span></div>
                    : <div><span>{detail.cargo_qty}</span> <span className="text-xs">{detail.cargo}</span></div>
                  }
                </td>
                <td><button onClick={() => removeFromFlight(detail)} className="btn btn-secondary btn-xs"><FontAwesomeIcon icon={faTimes} /></button></td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
        )}
      </Card>
    </div>
  )
}

export default Cargo
