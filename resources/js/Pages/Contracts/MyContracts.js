import React, { useEffect, useState } from 'react'
import PageTitle from '../../Shared/Navigation/PageTitle'
import Layout from '../../Shared/Layout'
import axios from 'axios'
import NoContent from '../../Shared/Elements/NoContent'
import Tooltip from '../../Shared/Elements/Tooltip'
import { Link } from '@inertiajs/inertia-react'
import dayjs from '../../Helpers/date.helpers'
import ContractMap from '../../Shared/Components/Contracts/ContractMap'
import { Inertia } from '@inertiajs/inertia'
import CargoDetails from '../../Shared/Components/Contracts/CargoDetails'
import MyContractMap from '../../Shared/Components/Contracts/MyContractMap'

const EmptyData = (props) => {
  return (
    <>
      <i className="material-icons md-48">airplane_ticket</i>
      <div>You have no contracts</div>
    </>
  )
}

const AirportToolTip = (props) => {
  return (
    <>
      <div>Altitude: {props.airport.altitude}ft</div>
      <div>Longest Runway: {props.airport.longest_runway_surface} - {props.airport.longest_runway_length}ft x {props.airport.longest_runway_width}ft</div>
    </>
  )
}

const MyContracts = ({ contracts }) => {
  const [selectedContract, setSelectedContract] = useState('')
  const [showDetail, setShowDetail] = useState(false)

  const updateSelectedContract = (contract) => {
    setSelectedContract(contract)
  }

  const cancelBid = (contract) => {
    const data = {
      id: contract.id
    }
    Inertia.post('/contracts/cancel', data)
  }

  const toggleDetail = () => {
    setShowDetail(!showDetail)
  }

  return (
    <div>
      <PageTitle title="My Contracts" />
      <div className="flex flex-col lg:flex-row justify-between mt-4">
        <div className="lg:w-2/3 lg:mr-2">
          <div className="rounded shadow bg-white overflow-x-auto mt-4">
            {!contracts && <NoContent content={<EmptyData />} />}
            {contracts && contracts.length > 0 &&
            // (
                <div>
                  <div>
                    <button onClick={toggleDetail} className="btn btn-secondary m-2">Toggle Cargo Details</button>
                  </div>
                  <table className="table-condensed table-auto">
                    <thead>
                    <tr className="">
                      <th>Departure</th>
                      <th>Arrival</th>
                      <th>Distance</th>
                      <th>Heading</th>
                      <th>Total Cargo</th>
                      <th>Pay</th>
                      <th>Expires</th>
                      <td>Cancel</td>
                    </tr>
                    </thead>
                    <tbody>
                    {contracts && contracts.map((contract) => (
                      <>
                      <tr key={contract.id} onClick={() => updateSelectedContract(contract)} className={contract.id === selectedContract.id ? 'bg-orange-200 hover:bg-orange-100' : ''}>
                        <td>
                           <Tooltip content={<AirportToolTip airport={contract.dep_airport} />} direction="top">
                            <Link href={`/airports/${contract.dep_airport_id}`}>{contract.dep_airport_id}</Link><br/>
                            <span className="text-xs">{contract.dep_airport.name}</span>
                           </Tooltip>
                        </td>
                        <td>
                           <Tooltip content={<AirportToolTip airport={contract.arr_airport} />} direction="top">
                            <Link href={`/airports/${contract.arr_airport_id}`}>{contract.arr_airport_id}</Link><br/>
                            <span className="text-xs">{contract.arr_airport.name}</span>
                           </Tooltip>
                        </td>
                        <td>{contract.distance}</td>
                        <td>{contract.heading}</td>
                        <td>
                          {contract.cargo.map((detail) => (
                            <>
                              <span className="mr-1">{detail.contract_type_id === 1 ? 'Cargo' : 'Pax'}</span>
                              <span>{detail.cargo_qty} {detail.contract_type_id === 1 ? 'kg' : ''} {detail.cargo}</span>
                              <br/>
                            </>
                          ))}
                        </td>
                        <td>${contract.contract_value.toLocaleString()}</td>
                        <td>
                          <Tooltip content={dayjs(contract.expires_at).format('HH:mm a')} direction="top">
                          {dayjs(contract.expires_at).format('DD/MM/YYYY')}
                          </Tooltip>
                        </td>
                        <td>
                          <button onClick={() => cancelBid(contract)} className="btn btn-secondary flex items-center">
                            <i className="material-icons md-18">close</i>
                          </button>
                        </td>
                      </tr>
                      { showDetail && <CargoDetails contract={contract} />}
                      </>
                    ))}
                    </tbody>
                  </table>
                </div>
              // )
            }
          </div>
        </div>
        <div className="lg:w-1/3 lg:ml-2 mt-2 lg:mt-0">
          { contracts && contracts.length > 0 && <div className="rounded shadow bg-white p-4">
            <MyContractMap data={selectedContract} size="large" />
          </div>}
        </div>
      </div>
    </div>
  )
}

MyContracts.layout = page => <Layout children={page} title="My Contracts" />

export default MyContracts
