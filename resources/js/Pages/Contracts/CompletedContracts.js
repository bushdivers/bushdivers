import React from 'react'
import dayjs from '../../Helpers/date.helpers'
import { Link } from '@inertiajs/inertia-react'
import Pagination from '../../Shared/Elements/Pagination'
import AppLayout from '../../Shared/AppLayout'
import { faPlaneDeparture, faPlaneArrival } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const CompletedContracts = ({ contracts }) => {
  return (
    <div className="p-4">
      <div className="mt-1">
        {contracts && contracts.data.map((contract) => (
          <div key={contract.id} className="mt-1 shadow rounded bg-white py-4 px-8 overflow-x-auto">
            <div className="flex justify-between items-center">
              <div className="flex flex-col items-center content-center">
                <FontAwesomeIcon icon={faPlaneDeparture} />
                <Link href={`/airports/${contract.dep_airport_id}`}>{contract.dep_airport_id}</Link>
                <div className="text-sm">{contract.dep_airport.name}</div>
              </div>
              <div className="flex flex-col items-center content-center">
                <FontAwesomeIcon icon={faPlaneArrival} />
                <Link href={`/airports/${contract.arr_airport_id}`}>{contract.arr_airport_id}</Link>
                <div className="text-sm">{contract.arr_airport.name}</div>
              </div>
              <div className="flex flex-col items-center content-center">
                <div>Distance</div>
                {contract.distance.toLocaleString(navigator.language)}nm
              </div>
              <div className="flex flex-col items-center content-center">
                <div>Contract Value</div>
                ${parseFloat(contract.cargo.map(detail => detail.contract_value).reduce((total, num) => total + Math.fround(num), 0)).toFixed(2)}
              </div>
              <div className="flex flex-col items-center content-center">
                <div>Completed Date</div>
                {dayjs(contract.completed_at).format('DD/MM/YYYY')}
              </div>
            </div>
            <table className="table-condensed table-auto mt-2">
              <thead>
              <tr className="">
                <th>Id</th>
                <th>Type</th>
                <th>Cargo</th>
                <th>Qty</th>
                <td>Completed Date</td>
              </tr>
              </thead>
              <tbody>
              {contract.cargo.map((cargo) => (
                <tr key={cargo.id}>
                  <td>{cargo.id}</td>
                  <td>{cargo.cargo_type_id === 1 ? <span>Cargo</span> : <span>Passengers</span>}</td>
                  <td>{cargo.cargo}</td>
                  <td>{cargo.cargo_qty.toLocaleString(navigator.language)}</td>
                  <td> {dayjs(cargo.completed_at).format('DD/MM/YYYY')}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <div className="mt-2 shadow rounded">
        <Pagination pages={contracts} />
      </div>
    </div>
  )
}

CompletedContracts.layout = page => <AppLayout children={page} title="Completed Contracts" heading="Completed Contracts" />

export default CompletedContracts
