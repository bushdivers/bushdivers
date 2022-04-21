import React from 'react'
import Tooltip from '../../Elements/Tooltip'

const CargoDetails = (props) => {
  console.log(props.contract.cargo)
  return (
    <>
      {props.contract.cargo.map((detail) => (
        <tr key={detail.id} className="bg-gray-50">
          <td>{detail.id}</td>
          <td>Current Location: {detail.current_airport_id}</td>
          <td>Cargo Type: {detail.cargo_type_id === 1 ? 'Cargo' : 'Passenger'}</td>
          <td>Cargo: {detail.cargo_qty.toLocaleString(navigator.language)} {detail.cargo_type_id === 1 ? 'lbs' : ''} {detail.cargo}</td>
          <td>Value: ${detail.contract_value}</td>
          <td>
            {detail.is_completed ? <i className="material-icons md-18 text-green-500">check_circle</i> : '' }
            {detail.active_pirep && (
              <Tooltip content="Active Dispatch" position="top">
                <i className="material-icons md-18 text-orange-500">assignment_returned</i>
              </Tooltip>
            )}
          </td>
        </tr>
      ))}
    </>
  )
}

export default CargoDetails
