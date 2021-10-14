import React from 'react'

const CargoDetails = (props) => {
  return (
    <>
      {props.contract.cargo.map((detail) => (
        <tr key={detail.id} className="bg-gray-50">
          <td>{detail.id}</td>
          <td>Current Location: {detail.current_airport_id}</td>
          <td>Cargo Type: {detail.contract_type_id === 1 ? 'Cargo' : 'Passenger'}</td>
          <td>Cargo: {detail.cargo_qty} {detail.contract_type_id === 1 ? 'lbs' : ''} {detail.cargo}</td>
          <td>{detail.is_completed ? <i className="material-icons md-18">check_circle</i> : '' }</td>
          <td></td>
        </tr>
      ))}
    </>
  )
}

export default CargoDetails
