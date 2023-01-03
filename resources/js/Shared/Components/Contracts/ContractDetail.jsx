import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowUp,
  faCheck,
  faPlane
} from '@fortawesome/free-solid-svg-icons'
import { formatDistanceToNowStrict } from 'date-fns'

function renderCargo (contract) {
  let cargoType
  switch (contract.cargo_type) {
    case 1:
      cargoType = ' lbs'
      break
    case 2:
      cargoType = ''
      break
  }
  return `${parseFloat(contract.cargo_qty).toLocaleString()}${cargoType} ${contract.cargo}`
}

const ContractDetail = ({ contract, addToFlight }) => {
  return (
    <div className="bg-neutral py-3 px-2 w-full border-neutral shadow-lg flex items-center justify-between my-2 space-x-2">
      <div className="flex items-center justify-start space-x-4 w-2/3">
        <div className="flex flex-col items-center space-y-1 w-1/3">
          <div className="flex items-center justify-start content-center space-x-2">
            <span className="text-xl">{contract.current_airport_id}</span>
            <span className="p-1 border rounded"><FontAwesomeIcon icon={faPlane} /></span>
            <span className="text-xl">{contract.arr_airport.identifier}</span>
          </div>
          <span className="text-lg font-bold">${parseFloat(contract.contract_value).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
      <div>
      </div>
      <div className="flex flex-col items-center space-y-1 w-1/3">
        <span>{contract.distance} nm</span>
        <div className="flex items-center">
          <span style={{ transform: `rotate(${contract.heading}deg)` }}><FontAwesomeIcon icon={faArrowUp} className="text-secondary" /></span>
          <span className="ml-1">{contract.heading}&deg;</span>
        </div>
      </div>
      <div className="text-sm w-1/3">
        {renderCargo(contract)}
      </div>
      </div>
      <div className="flex justify-end items-center space-x-4 w-1/3">
      <div className="flex flex-col items-center text-sm w-2/3">
        <span>Expires In</span>
        <span>{formatDistanceToNowStrict(new Date(contract.expires_at))}</span>
      </div>
      <div className="w-1/3 flex justify-end">
        {contract.user_id === null
          ? (
            <button onClick={() => addToFlight(contract)} className="btn btn-primary btn-xs">
              <FontAwesomeIcon icon={faCheck} />
            </button>
            )
          : <span className="text-sm">Assigned</span>
        }
        </div>
      </div>
    </div>
  )
}

export default ContractDetail
