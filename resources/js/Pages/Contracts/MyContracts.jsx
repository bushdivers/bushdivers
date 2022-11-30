import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, usePage } from '@inertiajs/inertia-react'
import { Inertia } from '@inertiajs/inertia'
import MyContractMap from '../../Shared/Components/Contracts/MyContractMap'
import AppLayout from '../../Shared/AppLayout'
import { faAnchor, faArrowUp, faCheck } from '@fortawesome/free-solid-svg-icons'
import Card from '../../Shared/Elements/Card'
import { formatDistanceToNowStrict } from 'date-fns'
import axios from 'axios'
import toast from 'react-hot-toast'

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
  return `${contract.cargo_qty}${cargoType} ${contract.cargo}`
}

const MyContracts = ({ contracts }) => {
  const { auth } = usePage().props
  const [selectedContract, setSelectedContract] = useState('')

  function updateSelectedContract (contract) {
    setSelectedContract(contract)
  }

  async function addToFlight (id) {
    const data = {
      id,
      userId: auth.user.id,
      action: 'assign'
    }
    const bid = axios.post('/api/contracts/assign', data)
    await toast.promise(bid, {
      loading: '...Assigning contract',
      success: 'Contract added!',
      error: 'Issue assigning contract'
    }, { position: 'top-right' })
    Inertia.reload()
  }

  return (
    <div className="flex space-x-2">
      <div className="w-3/5 max-h-fit">
        <Card>
          <div className="table-wrp flex max-h-96">
            <table className="table h-auto table-compact w-full overflow-x-auto">
              <thead className="sticky top-0 z-10">
              <tr>
                <th>Departure</th>
                <th>Destination</th>
                <th>Distance</th>
                <th>Heading</th>
                <th>Cargo</th>
                <th>Value</th>
                <th>Expires</th>
                <th></th>
              </tr>
              </thead>
              <tbody className="h-96 overflow-y-auto">
              {contracts && contracts.map((contract) => (
                <tr key={contract.id} onClick={() => updateSelectedContract(contract)} className={`${contract.id === selectedContract.id ? 'active' : ''} cursor-pointer`}>
                  <td><Link href={`/airports/${contract.dep_airport_id}`}>{contract.dep_airport_id}</Link> {contract.dep_airport.longest_runway_surface === 'W' && <FontAwesomeIcon icon={faAnchor} />}</td>
                  <td><Link href={`/airports/${contract.arr_airport_id}`}>{contract.arr_airport_id}</Link> {contract.arr_airport.longest_runway_surface === 'W' && <FontAwesomeIcon icon={faAnchor} />}</td>
                  <td>{contract.distance}</td>
                  <td>
                    <div className="flex items-center">
                      <div className="w-1/2">
                        <span className="mr-2">{contract.heading}</span>
                      </div>
                      <div className="w-1/2 flex">
                        <span style={{ transform: `rotate(${contract.heading}deg)` }}><FontAwesomeIcon icon={faArrowUp} className="text-secondary" /></span>
                      </div>
                    </div>
                  </td>
                  <td>{renderCargo(contract)}</td>
                  <td>${parseFloat(contract.contract_value).toLocaleString()}</td>
                  <td>{formatDistanceToNowStrict(new Date(contract.expires_at))}</td>
                  <td>
                    {contract.user_id === null
                      ? (<button onClick={() => addToFlight(contract.id)} className="btn btn-secondary btn-xs"><FontAwesomeIcon icon={faCheck} /></button>)
                      : (<span>Assigned</span>)
                    }
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      <div className="w-2/5">
        <Card>
          <MyContractMap data={selectedContract} size="large" mapStyle={auth.user.map_style} />
        </Card>
      </div>
    </div>
  )
}

MyContracts.layout = page => <AppLayout children={page} title="Available Contracts" heading="Available Contracts" />

export default MyContracts
