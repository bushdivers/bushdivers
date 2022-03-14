import React, { useEffect, useState } from 'react'
import NoContent from '../../Shared/Elements/NoContent'
import Tooltip from '../../Shared/Elements/Tooltip'
import { Link, usePage } from '@inertiajs/inertia-react'
import dayjs from '../../Helpers/date.helpers'
import ContractMap from '../../Shared/Components/Contracts/ContractMap'
import { Inertia } from '@inertiajs/inertia'
import CargoDetails from '../../Shared/Components/Contracts/CargoDetails'
import CustomContract from '../../Shared/Components/Contracts/CustomContract'
import AppLayout from '../../Shared/AppLayout'

const EmptyData = (props) => {
  return (
    <>
      <i className="material-icons md-48">airplane_ticket</i>
      <div>{props.airport ? 'There are no contracts for this airport' : 'Please enter an airport'}</div>
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

const Contracts = ({ contracts, airport }) => {
  const { auth } = usePage().props
  const [selectedAirport, setSelectedAirport] = useState('')
  const [title, setTitle] = useState('Contracts')
  // const [icao, setIcao] = useState('')
  const [values, setValues] = useState({
    icao: auth.user.current_airport_id,
    distance: 'Up to 50nm',
    cargo: 10000,
    pax: 12
  })
  // const [contracts, setContracts] = useState([])
  const [selectedContract, setSelectedContract] = useState({})
  const [error, setError] = useState(null)
  const [showDetail, setShowDetail] = useState(false)
  const [showCustom, setShowCustom] = useState(false)

  useEffect(() => {
    if (contracts && airport) {
      setTitle(`Contracts - ${airport.name} (${airport.identifier})`)
      setSelectedAirport(airport)
    } else {
      setTitle('Contracts')
    }
  }, [contracts])

  function handleChange (e) {
    const key = e.target.id
    const value = e.target.value
    setValues(values => ({
      ...values,
      [key]: value
    }))
  }

  const handleSearch = async () => {
    setError(null)
    // setSelectedAirport(null)
    // setContracts([])
    setSelectedContract('')
    setShowCustom(false)
    if (values.icao.length > 0) {
      // Call api to find contracts
      Inertia.post('/contracts', values)
    }
  }

  const updateSelectedContract = (contract) => {
    setSelectedContract(contract)
  }

  const bidForContract = (contract) => {
    const data = {
      id: contract.id,
      icao: values.icao,
      distance: values.distance,
      cargo: values.cargo,
      pax: values.pax
    }
    Inertia.post('/contracts/bid', data)
  }

  const toggleDetail = () => {
    setShowDetail(!showDetail)
  }

  return (
    <div className="p-4">
      <h1>{title}</h1>
      <div className="flex flex-col lg:flex-row justify-between mt-4">
        <div className="lg:w-2/3 lg:mr-2">
          <div className="rounded shadow bg-white p-4">
            <div className="flex justify-between items-end">
              <div>
                {error && <div className="text-sm text-red-500 mt-1">{error}</div>}
                <div className="inline-block mx-2">
                  <label htmlFor="icao"><span className="text-gray-700">Airport (ICAO)</span></label>
                  <input id="icao" type="text" className="form-input form" value={values.icao} onChange={handleChange} />
                </div>
                <div className="inline-block mx-2">
                  <label htmlFor="distance" className="block"><span className="text-gray-700">Distance range</span></label>
                  <select id="distance" value={values.distance} onChange={handleChange} className="form-select form">
                    <option key="Up to 50nm">Up to 50nm</option>
                    <option key="50nm-150nm">50nm-150nm</option>
                    <option key="150nm+">150nm+</option>
                  </select>
                </div>
                <div className="inline-block mx-2">
                  <label htmlFor="cargo"><span className="text-gray-700">Max cargo (lbs)</span></label>
                  <input id="cargo" type="text" className="form-input form" value={values.cargo} onChange={handleChange} />
                </div>
                <div className="inline-block mx-2">
                  <label htmlFor="pax"><span className="text-gray-700">Max passengers (qty)</span></label>
                  <input id="pax" type="text" className="form-input form" value={values.pax} onChange={handleChange} />
                </div>
                <div className="inline-block mx-2">
                  <button onClick={() => handleSearch()} className="btn btn-secondary">Find</button>
                </div>
              </div>
            <div className="inline-block mx-2">
              <button onClick={() => setShowCustom(true)} className="btn btn-secondary">Create Custom</button>
            </div>
            </div>
          </div>
          {showCustom && <CustomContract departureIcao={values.icao} hideSection={() => setShowCustom(false)} />}
          <div className="rounded shadow bg-white overflow-x-auto mt-4">
            {!airport && !contracts && <NoContent content={<EmptyData airport="" />} />}
            {airport && contracts && contracts.length === 0 && <NoContent content={<EmptyData airport={airport} />} />}
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
                      <td>Accept</td>
                    </tr>
                    </thead>
                    <tbody className="cursor-pointer">
                    {contracts && contracts.map((contract) => (
                      <>
                      <tr key={contract.id} onClick={() => updateSelectedContract(contract)} className={contract.id === selectedContract.id ? 'bg-orange-200 hover:bg-orange-100 cursor-pointer' : 'cursor-pointer'}>
                        <td>
                           <Tooltip content={<AirportToolTip airport={contract.dep_airport} />} direction="right">
                            <Link href={`/airports/${contract.dep_airport_id}`}>{contract.dep_airport_id}</Link> {contract.dep_airport.longest_runway_surface === 'W' && <span className="material-icons">anchor</span>}<br/>
                             <span className="text-xs">{contract.dep_airport.name}</span>
                           </Tooltip>
                        </td>
                        <td>
                           <Tooltip content={<AirportToolTip airport={contract.arr_airport} />} direction="top">
                            <Link href={`/airports/${contract.arr_airport_id}`}>{contract.arr_airport_id}</Link> {contract.arr_airport.longest_runway_surface === 'W' && <span className="material-icons">anchor</span>}<br/>
                            <span className="text-xs">{contract.arr_airport.name}</span>
                           </Tooltip>
                        </td>
                        <td>{contract.distance} nm</td>
                        <td>
                          <div className="flex items-center">
                            <div className="w-1/2">
                              <span className="mr-2">{contract.heading}</span>
                            </div>
                            <div className="w-1/2 flex">
                              <span style={{ transform: `rotate(${contract.heading}deg)` }}><i className="material-icons md-18 text-gray-800">north</i></span>
                            </div>
                          </div>
                        </td>
                        <td>
                          {contract.cargo.map((detail) => (
                            <>
                              <span className="mr-1">{detail.contract_type_id === 1 ? 'Cargo' : 'Pax'}</span>
                              <span>{detail.cargo_qty.toLocaleString(navigator.language)} {detail.contract_type_id === 1 ? 'lbs' : ''} {detail.cargo}</span>
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
                        <td><button onClick={() => bidForContract(contract)} className="btn btn-secondary btn-small">Accept</button></td>
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
          { airport && <div className="rounded shadow bg-white p-4">
            <ContractMap departure={selectedAirport} destination={selectedContract.arr_airport} size="large" mapStyle={auth.user.map_style} />
          </div>}
        </div>
      </div>
    </div>
  )
}

Contracts.layout = page => <AppLayout children={page} title="Find a Contract" heading="Find a Contract" />

export default Contracts
