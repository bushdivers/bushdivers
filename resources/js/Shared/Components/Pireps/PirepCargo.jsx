import React from 'react'
import Card from '../../Elements/Card'

const PirepCargo = (props) => {
  return (
    <div className="mt-2 mx-2">
      <Card title="Cargo">
        <div className="overflow-x-auto">
      <table className="table table-compact w-full">
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
            <td>{detail.dep_airport_id}</td>
            <td>{detail.arr_airport_id}</td>
            <td>{detail.distance.toLocaleString(navigator.language)}</td>
            <td>{detail.heading}</td>
            <td>{detail.cargo_type === 1 ? 'Cargo' : 'Passenger'}</td>
            <td>
              {detail.cargo_type === 1
                ? <div><span>{detail.cargo_qty.toLocaleString(navigator.language)} lbs</span> <span className="text-xs">{detail.cargo}</span></div>
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
  )
}

export default PirepCargo
