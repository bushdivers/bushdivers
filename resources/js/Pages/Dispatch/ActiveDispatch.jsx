import React from 'react'
import DispatchSummary from '../../Shared/Components/Dispatch/DispatchSummary'
import { Inertia } from '@inertiajs/inertia'
import AppLayout from '../../Shared/AppLayout'
import { Link } from '@inertiajs/inertia-react'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Card from '../../Shared/Elements/Card'

const ActiveDispatch = ({ cargo, aircraft, cargoWeight, fuelWeight, passengerCount, pirep }) => {
  const personWeight = 170.00

  function handleCancel () {
    const res = window.confirm('You have an active flight, if you cancel now you will lose all progress')
    if (res) {
      Inertia.post('/dispatch/cancel', { pirep: pirep.id })
    }
  }

  return (
    <div>
      <div>{pirep.id} <Link className="ml-2" href="/pireps/submit"><button className="btn btn-secondary">Submit Manual Pirep</button></Link></div>
      {pirep.state === 2 && <div><span className="text-primary">Current flight in progress</span></div>}
      <div className="flex flex-col md:flex-row justify-between">
        <div className="md:mr-2 md:w-1/2">
          <div className="mt-4">
            <Card title="Selected Cargo">
            <div className="overflow-x-auto">
            <table className="table table-compact w-full">
              <thead>
              <tr>
                <th>Contract</th>
                <th>Current</th>
                <th>Arrival</th>
                <th>Distance</th>
                <th>Heading</th>
                <th>Type</th>
                <th>Cargo</th>
              </tr>
              </thead>
              <tbody>
              {cargo.map((detail) => (
                <tr key={detail.id}>
                  <td>{detail.id}</td>
                  <td>{detail.current_airport_id}</td>
                  <td>{detail.contract.arr_airport_id}</td>
                  <td>{detail.contract.distance} nm</td>
                  <td>
                    <div className="flex items-center">
                      <div className="w-1/2">
                        <span className="mr-2">{detail.contract.heading}</span>
                      </div>
                      <div className="w-1/2 flex">
                        <span style={{ transform: `rotate(${detail.contract.heading}deg)` }}><FontAwesomeIcon icon={faArrowUp} /></span>
                      </div>
                    </div>
                  </td>
                  <td>{detail.cargo_type_id === 1 ? 'Cargo' : 'Passenger'}</td>
                  <td>
                    {detail.cargo_type_id === 1
                      ? <div><span>{detail.cargo_qty} lbs</span> <span className="text-xs">{detail.cargo}</span></div>
                      : <div><span>{detail.cargo_qty}</span> <span className="text-xs">{detail.cargo}</span></div>
                    }
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
            </div>
            </Card>
          </div>
        </div>
        <div className="md:ml-2 md:w-1/2">
          <div className="mt-4">
            <DispatchSummary
              selectedAircraft={aircraft}
              selectedCargo={cargo}
              personWeight={personWeight}
              cargoWeight={cargoWeight}
              fuelWeight={fuelWeight}
              passengerCount={passengerCount}
              pirep={pirep}
              deadHead={pirep.is_empty}
            />
            <div className="text-right mt-2"><button onClick={handleCancel} className="btn btn-primary">Cancel Dispatch</button></div>
          </div>
        </div>
      </div>
    </div>
  )
}

ActiveDispatch.layout = page => <AppLayout children={page} title="Active Dispatch" heading="Active Dispatch" />

export default ActiveDispatch
