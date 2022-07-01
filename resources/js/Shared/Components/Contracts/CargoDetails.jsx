import React from 'react'
import Tooltip from '../../Elements/Tooltip'
import { faAnchor, faCheckCircle, faFileArrowDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
            <span className="text-green-500">{detail.is_completed ? <FontAwesomeIcon icon={faCheckCircle} /> : <></> }</span>
            {detail.active_pirep && (
              <Tooltip content="Active Dispatch" position="top">
                <span className="text-orange-500"><FontAwesomeIcon icon={faFileArrowDown} /></span>
              </Tooltip>
            )}
          </td>
        </tr>
      ))}
    </>
  )
}

export default CargoDetails
