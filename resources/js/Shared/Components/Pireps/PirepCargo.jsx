import React from 'react'
import Card from '../../Elements/Card'

const PirepCargo = (props) => {
  return (
    <div className="mt-2 mx-2 overflow-x-auto">
      <Card compact="true">
      <table className="table table-auto table-condensed">
        <thead>
        <tr>
          <th>Contract</th>
          <th>Pick Up</th>
          <th>Destination</th>
          <th>Distance</th>
          <th>Heading</th>
          <th>Type</th>
          <th>Cargo</th>
        </tr>
        </thead>
        <tbody>
        {props.cargo.map((detail) => (
          <tr key={detail.id}>
            <td>{detail.id}</td>
            <td>{detail.contract.dep_airport_id}</td>
            <td>{detail.contract.arr_airport_id}</td>
            <td>{detail.contract.distance.toLocaleString(navigator.language)}</td>
            <td>{detail.contract.heading}</td>
            <td>{detail.cargo_type_id === 1 ? 'Cargo' : 'Passenger'}</td>
            <td>
              {detail.cargo_type_id === 1
                ? <div><span>{detail.cargo_qty.toLocaleString(navigator.language)} lbs</span> <span className="text-xs">{detail.cargo}</span></div>
                : <div><span>{detail.cargo_qty}</span> <span className="text-xs">{detail.cargo}</span></div>
              }
            </td>
          </tr>
        ))}
        </tbody>
      </table>
      </Card>
    </div>
  )
}

export default PirepCargo
