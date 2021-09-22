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
      <div>Longest Runway: {props.airport.longest_runway_surface} - {props.airport.longest_runway_length}ft x {props.airport.longest_runway_width}ft</div>
    </>
  )
}

const Contracts = ({ contracts, airport }) => {
  const [selectedAirport, setSelectedAirport] = useState('')
  const [title, setTitle] = useState('Contracts')
  // const [icao, setIcao] = useState('')
  const [values, setValues] = useState({
    icao: '',
    distance: 'Up to 50nm',
    cargo: 1000,
    pax: 12
  })
  // const [contracts, setContracts] = useState([])
  const [selectedContract, setSelectedContract] = useState({})
  const [error, setError] = useState(null)
  const [showDetail, setShowDetail] = useState(false)

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
    if (values.icao.length > 0) {
      // Call api to find contracts
      Inertia.post('/contracts', values)
      // const response = await axios.get(`/api/contracts/search/${values.icao}/${values.distance}/${values.cargo}/${values.pax}`)
      // if (!response.data.airport) {
      //   setError('No airport found')
      //   setTitle('Contracts')
      //   return
      // }
      // if (response.data.airport) {
      //   setAirport(response.data.airport)
      //   setTitle(`Contracts - ${response.data.airport.name} (${response.data.airport.identifier})`)
      // }
      // if (response.data.contracts.length > 0) {
      //   setContracts(response.data.contracts)
      //   setError(null)
      // } else {
      //   setError('No contracts found')
      // }
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
    <div>
      <PageTitle title={title} />
      <div className="flex justify-between mt-4">
        <div className="w-2/3 mr-2">
          <div className="rounded shadow bg-white p-4">
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
                <label htmlFor="cargo"><span className="text-gray-700">Max cargo (kg)</span></label>
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
                      {/*<th>Current</th>*/}
                      <th>Arrival</th>
                      <th>Distance</th>
                      <th>Heading</th>
                      <th>Total Cargo</th>
                      {/*<th>Type</th>*/}
                      {/*<th>Cargo</th>*/}
                      <th>Pay</th>
                      <th>Expires</th>
                      <td>Bid</td>
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
                        {/* <td> */}
                        {/*   <Tooltip content={<AirportToolTip airport={contract.current_airport} />} direction="top"> */}
                        {/*    <Link href={`/airports/${contract.current_airport_id}`}>{contract.current_airport_id}</Link><br/> */}
                        {/*    <span className="text-xs">{contract.current_airport.name}</span> */}
                        {/*   </Tooltip> */}
                        {/* </td> */}
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
                        {/*<td>{contract.contract_type_id === 1 ? 'Cargo' : 'Passenger'}</td>*/}
                        {/*<td>*/}
                        {/*  {contract.contract_type_id === 1*/}
                        {/*    ? <div><span>{contract.cargo_qty} kg</span><br /><span className="text-xs">{contract.cargo}</span></div>*/}
                        {/*    : <div><span>{contract.pax_qty}</span><br /><span className="text-xs">{contract.pax}</span></div>*/}
                        {/*  }*/}
                        {/*</td>*/}
                        <td>${contract.contract_value.toLocaleString()}</td>
                        <td>
                          <Tooltip content={dayjs(contract.expires_at).format('HH:mm a')} direction="top">
                          {dayjs(contract.expires_at).format('DD/MM/YYYY')}
                          </Tooltip>
                        </td>
                        <td><button onClick={() => bidForContract(contract)} className="btn btn-secondary btn-small">Bid</button></td>
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
        <div className="w-1/3 ml-2">
          { airport && <div className="rounded shadow bg-white p-4">
            <ContractMap departure={selectedAirport} destination={selectedContract.arr_airport} size="large" />
          </div>}
        </div>
      </div>
    </div>
  )
}

Contracts.layout = page => <Layout children={page} title="Find a Contract" />

export default Contracts
