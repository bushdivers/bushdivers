import React from 'react'
import NoContent from '../../Elements/NoContent'
import Tooltip from '../../Elements/Tooltip'
import { Link } from '@inertiajs/inertia-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnchor, faArrowUp, faTicket, faXmark } from '@fortawesome/free-solid-svg-icons'
import dayjs from '../../../Helpers/date.helpers'
import CargoDetails from './CargoDetails'

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

const CommunityContracts = ({ contracts, toggleDetail, selectedContract, updateSelectedContract, showDetail }) => {
  return (
    <div>
      <h2>Bush Divers Community Contracts</h2>
      <div className="rounded shadow bg-white overflow-x-auto my-4">
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
  )
}

export default CommunityContracts
