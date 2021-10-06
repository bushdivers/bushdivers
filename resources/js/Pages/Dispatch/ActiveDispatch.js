import React from 'react'
import Layout from '../../Shared/Layout'
import PageTitle from '../../Shared/Navigation/PageTitle'
import DispatchSummary from '../../Shared/Components/Dispatch/DispatchSummary'
import { Inertia } from '@inertiajs/inertia'

const ActiveDispatch = ({ cargo, aircraft, cargoWeight, fuelWeight, passengerCount, pirep }) => {
  const personWeight = 80.00

  function handleCancel () {
    Inertia.post('/dispatch/cancel', { pirep: pirep.id })
  }

  return (
    <div>
      <PageTitle title="Current Dispatch" />
      {pirep.state === 2 && <div><span className="text-orange-500">Current flight in progress</span></div>}
      <div className="flex justify-between">
        <div className="mr-2 w-1/2">
          <div className="bg-white rounded shadow mt-4 p-4">
            <div className="mb-2 text-xl">Selected Cargo</div>
            <table className="table table-auto table-condensed">
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
                  <td>{detail.contract.distance}</td>
                  <td>{detail.contract.heading}</td>
                  <td>{detail.contract_type_id === 1 ? 'Cargo' : 'Passenger'}</td>
                  <td>
                    {detail.contract_type_id === 1
                      ? <div><span>{detail.cargo_qty} kg</span> <span className="text-xs">{detail.cargo}</span></div>
                      : <div><span>{detail.cargo_qty}</span> <span className="text-xs">{detail.cargo}</span></div>
                    }
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="ml-2 w-1/2">
          <div className="bg-white rounded shadow mt-4 p-4">
            <DispatchSummary
              selectedAircraft={aircraft}
              selectedCargo={cargo}
              personWeight={personWeight}
              cargoWeight={cargoWeight}
              fuelWeight={fuelWeight}
              passengerCount={passengerCount}
            />
            {pirep.state === 1 && <div className="text-right"><button onClick={handleCancel} className="btn btn-primary">Cancel Dispatch</button></div>}
          </div>
        </div>
      </div>
    </div>
  )
}

ActiveDispatch.layout = page => <Layout children={page} title="Active Dispatch" />

export default ActiveDispatch
