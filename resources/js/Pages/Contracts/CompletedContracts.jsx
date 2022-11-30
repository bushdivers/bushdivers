import React from 'react'
import dayjs from '../../Helpers/date.helpers'
import { Link } from '@inertiajs/inertia-react'
import Pagination from '../../Shared/Elements/Pagination'
import AppLayout from '../../Shared/AppLayout'
import { faPlaneDeparture, faPlaneArrival } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Card from '../../Shared/Elements/Card'

const CompletedContracts = ({ contracts }) => {
  return (
    <div className="p-4">
      <div className="mt-1">
        {contracts && contracts.data.map((contract) => (
          <div key={contract.id} className="mt-1">
            <Card>
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
                <div>Cargo</div>
                <div className="flex justify-start space-x-1">
                  <span></span>
                  <span>{contract.cargo_qty} {contract.cargo_type === 1 ? <span>lbs</span> : <span>PAX</span>}</span>
                  <span>{contract.cargo}</span>
                </div>
              </div>
              <div className="flex flex-col items-center content-center">
                <div>Contract Value</div>
                ${parseFloat(contract.contract_value).toLocaleString()}
              </div>
              <div className="flex flex-col items-center content-center">
                <div>Completed Date</div>
                {dayjs(contract.completed_at).format('DD/MM/YYYY')}
              </div>
            </div>
            </Card>
          </div>
        ))}
      </div>
      <div className="mt-2">
        <Pagination pages={contracts} />
      </div>
    </div>
  )
}

CompletedContracts.layout = page => <AppLayout children={page} title="Completed Contracts" heading="Completed Contracts" />

export default CompletedContracts
