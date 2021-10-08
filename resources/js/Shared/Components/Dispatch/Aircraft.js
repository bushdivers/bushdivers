import React from 'react'
import NoContent from '../../Elements/NoContent'

const EmptyData = (props) => {
  return (
    <>
      <i className="material-icons md-48">airplane_ticket</i>
      <div>There are no available {props.content}</div>
    </>
  )
}

const Aircraft = (props) => {
  return (
    <div className="shadow rounded p-4 mt-2 mr-2 bg-white">
      {props.aircraft.length === 0
        ? <NoContent content={<EmptyData content="Aircraft" />} />
        : (
          <div>
            <div className="mb-2 text-xl">Select Aircraft</div>
            <table className="table table-auto table-condensed">
              <thead>
              <tr>
                <th>Registration</th>
                <th>Aircraft</th>
                <th>Current Fuel</th>
              </tr>
              </thead>
              <tbody>
              {props.aircraft.map((ac) => (
                <tr key={ac.id} onClick={() => props.handleAircraftSelect(ac)} className={props.selectedAircraft.id === ac.id ? 'bg-orange-200 hover:bg-orange-100' : ''}>
                  <td>{ac.registration}</td>
                  <td>{ac.fleet.manufacturer} {ac.fleet.name} ({ac.fleet.type})</td>
                  <td>{ac.fuel_onboard}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
          )
      }
    </div>
  )
}

export default Aircraft
