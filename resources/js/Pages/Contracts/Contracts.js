import React, { useEffect, useState } from 'react'
import NoContent from '../../Shared/Elements/NoContent'
import Tooltip from '../../Shared/Elements/Tooltip'
import { Link, usePage } from '@inertiajs/inertia-react'
import dayjs, { convertMinuteDecimalToHoursAndMinutes } from '../../Helpers/date.helpers'
import ContractMap from '../../Shared/Components/Contracts/ContractMap'
import { Inertia } from '@inertiajs/inertia'
import CargoDetails from '../../Shared/Components/Contracts/CargoDetails'
import CustomContract from '../../Shared/Components/Contracts/CustomContract'
import AppLayout from '../../Shared/AppLayout'
import StatBlock from '../../Shared/Elements/StatBlock'

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
    icao: '' //auth.user.current_airport_id
    // distance: 'Up to 50nm',
    // cargo: 10000,
    // pax: 12
  })
  // const [contracts, setContracts] = useState([])
  const [selectedContract, setSelectedContract] = useState({})
  const [error, setError] = useState(null)
  const [showDetail, setShowDetail] = useState(false)
  const [showCustom, setShowCustom] = useState(false)
  const [showContracts, setShowContracts] = useState(false)

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
    setSelectedContract('')
    setShowCustom(false)
    if (values.icao.length > 0) {
      // Call api to find contracts
      Inertia.post('/contracts', values)
      setShowContracts(true)
    } else {
      setError('Please enter an ICAO')
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
    <div className="relative">
      <ContractMap departure={selectedAirport} destination={selectedContract.arr_airport} size="full" mapStyle={auth.user.map_style} />
        <div className="absolute z-30 top-4 left-4 py-2 px-4 bg-white w-1/2 md:w-1/3 opacity-90 shadow rounded">
          <div className="flex flex-col md:flex-row justify-start items-baseline">
            <div>
              <input id="icao" type="text" placeholder="search ICAO" className="form-input form" value={values.icao} onChange={handleChange} />
            </div>
            <div><button onClick={() => handleSearch()} className="btn btn-secondary ml-2">Find</button></div>
            <div><button onClick={() => setShowCustom(true)} className="btn btn-secondary ml-2">Custom</button></div>
          </div>
          {error && <span className="text-sm text-red-500">{error}</span>}
        </div>
      {showCustom && (
        <div className="absolute z-30 top-4 left-1/3 ml-8 py-2 px-4 bg-white w-1/2 md:w-1/3 opacity-90 shadow rounded">
          <CustomContract departureIcao={values.icao} hideSection={() => setShowCustom(false)} />
        </div>
      )}
      {showContracts && (<div className="absolute z-30 top-20 left-4 bottom-4 bg-white w-1/2 md:w-1/3 opacity-90 shadow rounded h-auto overflow-y-auto mt-2">
          {contracts && contracts.map((contract) => (
            <div key={contract.id} onClick={() => updateSelectedContract(contract)} className={`${contract.id === selectedContract.id ? 'bg-orange-200 hover:bg-orange-100' : ''} border-t-2 text-sm cursor-pointer`}>
              <div className="px-4 py-2 flex justify-between items-center">
                <div className="text-xs text-gray-700">
                  {dayjs(contract.expires_at).format('DD/MM/YYYY HH:mm')}
                </div>
                <button onClick={() => bidForContract(contract)} className="btn btn-secondary btn-small">
                  <i className="material-icons md-16">check</i>
                </button>
              </div>
              <div className="px-4 py-2 flex justify-between">
                <div className="flex items-center space-x-4">
                  <div className="mx-1 flex items-center">
                    <i className="material-icons md-16 mr-1">inventory</i>
                    <span>{contract.cargo.length}</span>
                  </div>
                  <div className="mx-1 flex items-center">
                    <i className="material-icons md-16 mr-1">work</i>
                    <span>{parseFloat(contract.cargo.filter(cc => cc.contract_type_id === 1).map(detail => detail.cargo_qty).reduce((total, num) => total + Math.fround(num), 0))} lbs</span>
                  </div>
                  <div className="mx-1 flex items-center">
                    <i className="material-icons md-16 mr-1">people</i>
                    <span>{parseFloat(contract.cargo.filter(cc => cc.contract_type_id === 2).map(detail => detail.cargo_qty).reduce((total, num) => total + Math.fround(num), 0))}</span>
                  </div>
                  <div className="mx-1 flex items-center">
                    <i className="material-icons md-16 mr-1">location_on</i>
                    <span>{contract.distance} nm</span>
                  </div>
                  <div className="mx-1 flex items-center">
                    <i className="material-icons md-16 mr-1">currency_bitcoin</i>
                    <span>${parseFloat(contract.cargo.map(detail => detail.contract_value).reduce((total, num) => total + Math.fround(num), 0)).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between px-4 py-2">
                <div className="mt-1 text-xs">
                  {contracts && contract.cargo.map((c) => (
                    <div key="c.id" className="flex justify-between items-center cursor-pointer">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-baseline space-x-1 mr-4">
                          <div className="">{c.current_airport_id}</div>
                        </div>
                        <div className="flex items-center space-x-1 mr-4">
                          <div className="mr-1 flex items-center">
                            <i className="material-icons md-16 mr-1">flight_takeoff</i>
                            {c.dep_airport_id}
                          </div>
                          <div className="mr-2 flex items-center">
                            <i className="material-icons md-16 mr-1">flight_land</i>
                            {c.arr_airport_id}
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="mr-1">{c.cargo_qty} {c.contract_type_id === 1 ? 'lbs' : ''}</div>
                          <div className="mr-2">{c.cargo}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
      {/*</div>*/}
    </div>
  )
}

Contracts.layout = page => <AppLayout children={page} title="Find a Contract" heading="Find a Contract" />

export default Contracts
