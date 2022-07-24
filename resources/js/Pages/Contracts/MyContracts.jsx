import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NoContent from '../../Shared/Elements/NoContent'
import Tooltip from '../../Shared/Elements/Tooltip'
import { Link, usePage } from '@inertiajs/inertia-react'
import dayjs from '../../Helpers/date.helpers'
import { Inertia } from '@inertiajs/inertia'
import CargoDetails from '../../Shared/Components/Contracts/CargoDetails'
import MyContractMap from '../../Shared/Components/Contracts/MyContractMap'
import AppLayout from '../../Shared/AppLayout'
import { faAnchor, faArrowUp, faTicket, faXmark } from '@fortawesome/free-solid-svg-icons'
import CommunityContracts from '../../Shared/Components/Contracts/CommunityContracts'

const EmptyData = (props) => {
  return (
    <>
      <FontAwesomeIcon className="text-xl" icon={faTicket} />
      <div>{props.text}</div>
    </>
  )
}

const AirportToolTip = (props) => {
  return (
    <>
      <div>Altitude: {props.airport.altitude}ft</div>
      <div>Longest Runway: {props.airport.longest_runway_surface} - {props.airport.longest_runway_length.toLocaleString(navigator.language)}ft x {props.airport.longest_runway_width}ft</div>
    </>
  )
}

const MyContracts = ({ contracts, custom, community }) => {
  const { auth } = usePage().props
  const [selectedContract, setSelectedContract] = useState('')
  const [showDetail, setShowDetail] = useState(false)

  const updateSelectedContract = (contract) => {
    setSelectedContract(contract)
  }

  const cancelBid = (contract) => {
    const res = window.confirm('Are you sure you want to cancel this contract? You will lose XP.')
    if (res) {
      const data = {
        id: contract.id
      }
      Inertia.post('/contracts/cancel', data)
    }
  }

  const toggleDetail = () => {
    setShowDetail(!showDetail)
  }

  return (
    <div className="p-4">
      <div className="flex flex-col lg:flex-row justify-between mt-4">
        <div className="lg:w-2/3 lg:mr-2">
          <h2>My Contracts</h2>
          <div className="rounded shadow bg-white overflow-x-auto my-4">
            {!custom && <NoContent content={<EmptyData text="No custom contracts" />} />}
            {custom && custom.length > 0 &&
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
                  <th>Value</th>
                  <th>Expires</th>
                  <td>Cancel</td>
                </tr>
                </thead>
                <tbody className="cursor-pointer">
                {custom && custom.map((contract) => (
                  <>
                    <tr key={contract.id} onClick={() => updateSelectedContract(contract)} className={contract.id === selectedContract.id ? 'bg-orange-200 hover:bg-orange-100' : ''}>
                      <td>
                        <Tooltip content={<AirportToolTip airport={contract.dep_airport} />} direction="top">
                          <Link href={`/airports/${contract.dep_airport_id}`}>{contract.dep_airport_id}</Link> {contract.dep_airport.longest_runway_surface === 'W' && <FontAwesomeIcon icon={faAnchor} />}
                          <span className="text-xs">{contract.dep_airport.name} </span>
                        </Tooltip>
                      </td>
                      <td>
                        <Tooltip content={<AirportToolTip airport={contract.arr_airport} />} direction="top">
                          <Link href={`/airports/${contract.arr_airport_id}`}>{contract.arr_airport_id}</Link> {contract.arr_airport.longest_runway_surface === 'W' && <FontAwesomeIcon icon={faAnchor} />}<br/>
                          <span className="text-xs">{contract.arr_airport.name}</span>
                        </Tooltip>
                      </td>
                      <td>{contract.distance.toLocaleString(navigator.language)} nm</td>
                      <td>
                        <div className="flex items-center">
                          <div className="w-1/2">
                            <span className="mr-2">{contract.heading}</span>
                          </div>
                          <div className="w-1/2 flex">
                            <span style={{ transform: `rotate(${contract.heading}deg)` }}><FontAwesomeIcon icon={faArrowUp} className="text-gray-700" /></span>
                          </div>
                        </div>
                      </td>
                      <td>
                        {contract.cargo.map((detail) => (
                          <>
                            <span className="mr-1">{detail.cargo_type_id === 1 ? 'Cargo' : 'Pax'}</span>
                            <span>{detail.cargo_qty.toLocaleString(navigator.language)} {detail.cargo_type_id === 1 ? 'lbs' : ''} {detail.cargo}</span>
                            <br/>
                          </>
                        ))}
                      </td>
                      {/* <td>${contract.contract_value.toLocaleString()}</td> */}
                      <td>${parseFloat(contract.cargo.map(detail => detail.contract_value).reduce((total, num) => total + Math.fround(num), 0)).toFixed(2)}<br/></td>
                      <td>
                        {dayjs(contract.expires_at).format('DD/MM/YYYY HH:mm')}
                      </td>
                      <td>
                        <button onClick={() => cancelBid(contract)} className="btn btn-secondary flex items-center">
                          <FontAwesomeIcon icon={faXmark} />
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

          <CommunityContracts contracts={community} selectedContract={selectedContract} showDetail={showDetail} toggleDetail={setShowDetail} updateSelectedContract={updateSelectedContract} />

          <h2>Available Contracts</h2>
          <div className="rounded shadow bg-white overflow-x-auto mt-4">
            {!contracts && <NoContent content={<EmptyData text="No available contracts" />} />}
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
                      <th>Value</th>
                      <th>Expires</th>
                      {auth.user.is_admin ? <td>Cancel</td> : <></>}
                    </tr>
                    </thead>
                    <tbody className="cursor-pointer">
                    {contracts && contracts.map((contract) => (
                      <>
                      <tr key={contract.id} onClick={() => updateSelectedContract(contract)} className={contract.id === selectedContract.id ? 'bg-orange-200 hover:bg-orange-100 cursor-pointer' : 'cursor-pointer'}>
                        <td>
                           <Tooltip content={<AirportToolTip airport={contract.dep_airport} />} direction="top">
                             <Link href={`/airports/${contract.dep_airport_id}`}>{contract.dep_airport_id}</Link> {contract.dep_airport.longest_runway_surface === 'W' && <FontAwesomeIcon icon={faAnchor} />}
                            <span className="text-xs">{contract.dep_airport.name} </span>
                           </Tooltip>
                        </td>
                        <td>
                           <Tooltip content={<AirportToolTip airport={contract.arr_airport} />} direction="top">
                            <Link href={`/airports/${contract.arr_airport_id}`}>{contract.arr_airport_id}</Link> {contract.arr_airport.longest_runway_surface === 'W' && <FontAwesomeIcon icon={faAnchor} />}<br/>
                            <span className="text-xs">{contract.arr_airport.name}</span>
                           </Tooltip>
                        </td>
                        <td>{contract.distance.toLocaleString(navigator.language)} nm</td>
                        <td>
                          <div className="flex items-center">
                            <div className="w-1/2">
                              <span className="mr-2">{contract.heading}</span>
                            </div>
                            <div className="w-1/2 flex">
                              <span style={{ transform: `rotate(${contract.heading}deg)` }}><FontAwesomeIcon icon={faArrowUp} className="text-gray-700" /></span>
                            </div>
                          </div>
                        </td>
                        <td>
                          {contract.cargo.map((detail) => (
                            <>
                              <span className="mr-1">{detail.cargo_type_id === 1 ? 'Cargo' : 'Pax'}</span>
                              <span>{detail.cargo_qty.toLocaleString(navigator.language)} {detail.cargo_type_id === 1 ? 'lbs' : ''} {detail.cargo}</span>
                              <br/>
                            </>
                          ))}
                        </td>
                        <td>
                          ${parseFloat(contract.cargo.map(detail => detail.contract_value).reduce((total, num) => total + Math.fround(num), 0)).toFixed(2)}<br/>
                        </td>
                        <td>
                          {dayjs(contract.expires_at).format('DD/MM/YYYY HH:mm')}
                        </td>
                        {auth.user.is_admin
                          ? (
                            <td>
                              <button onClick={() => cancelBid(contract)} className="btn btn-secondary flex items-center">
                                <FontAwesomeIcon icon={faXmark} />
                              </button>
                            </td>
                            )
                          : <></>
                        }
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
            <MyContractMap data={selectedContract} size="large" mapStyle={auth.user.map_style} />
          </div>}
        </div>
      </div>
    </div>
  )
}

MyContracts.layout = page => <AppLayout children={page} title="Available Contracts" heading="Available Contracts" />

export default MyContracts
