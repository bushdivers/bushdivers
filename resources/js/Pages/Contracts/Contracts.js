import React, { useEffect, useState } from 'react'
import NoContent from '../../Shared/Elements/NoContent'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tooltip from '../../Shared/Elements/Tooltip'
import { Link, usePage } from '@inertiajs/inertia-react'
import dayjs, { convertMinuteDecimalToHoursAndMinutes } from '../../Helpers/date.helpers'
import ContractMap from '../../Shared/Components/Contracts/ContractMap'
import { Inertia } from '@inertiajs/inertia'
import CargoDetails from '../../Shared/Components/Contracts/CargoDetails'
import CustomContract from '../../Shared/Components/Contracts/CustomContract'
import AppLayout from '../../Shared/AppLayout'
import StatBlock from '../../Shared/Elements/StatBlock'
import {
  faArrowDownShortWide, faArrowUp,
  faBoxArchive,
  faCheck,
  faCompass, faDollarSign, faLocationDot, faMinus, faPlaneArrival, faPlaneDeparture, faPlus,
  faSuitcase,
  faUserGroup
} from '@fortawesome/free-solid-svg-icons'

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
  const [searchIcao, setSearchIcao] = useState(auth.user.current_airport_id)
  const [sort, setSort] = useState('heading')
  const [showSort, setShowSort] = useState(false)
  // const [contracts, setContracts] = useState([])
  const [selectedContract, setSelectedContract] = useState({})
  const [error, setError] = useState(null)
  const [showDetail, setShowDetail] = useState(false)
  const [showDetailId, setShowDetailId] = useState(0)
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

  useEffect(async () => {
    if (contracts.length > 0) {
      await handleSearch()
    }
  }, [sort])

  function handleChange (e) {
    setSearchIcao(e.target.value)
  }

  const handleSearch = async () => {
    setError(null)
    setSelectedContract('')
    setShowCustom(false)
    if (searchIcao.length > 0) {
      // Call api to find contracts
      Inertia.post('/contracts', { icao: searchIcao, sort: sort })
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
      icao: searchIcao,
      sort: sort
    }
    Inertia.post('/contracts/bid', data)
  }

  const toggleDetail = (id) => {
    setShowDetail(!showDetail)
    setShowDetailId(id)
  }

  const toggleSort = () => {
    setShowSort(!showSort)
    setShowCustom(false)
  }

  const toggleCustom = () => {
    setShowCustom(!showCustom)
    setShowSort(false)
  }

  const handleSort = (s) => {
    setShowSort(false)
    if (contracts.length > 0) {
      setSort(s)
    }
  }

  return (
    <div className="relative">
      <ContractMap departure={selectedAirport} destination={selectedContract.arr_airport} size="full" mapStyle={auth.user.map_style} />
        <div className="absolute z-30 top-4 left-4 py-2 px-4 bg-white w-1/2 md:w-1/3 opacity-90 shadow rounded">
          <div className="flex flex-col md:flex-row justify-start items-baseline">
            <div>
              <input id="icao" type="text" placeholder="search ICAO" className="form-input form" value={searchIcao} onChange={handleChange} />
            </div>
            <div><button onClick={() => handleSearch()} className="btn btn-secondary ml-2">Find</button></div>
            <div>
              <Tooltip direction="top" content="Create custom contract">
                <button onClick={() => toggleCustom()} className="btn btn-secondary ml-2">Custom</button>
              </Tooltip>
            </div>
            <div>
              <Tooltip direction="top" content="Sort contract list">
                <button onClick={() => toggleSort()} className="btn btn-light ml-2"><FontAwesomeIcon icon={faArrowDownShortWide} /></button>
              </Tooltip>
            </div>
          </div>
          {error && <span className="text-sm text-red-500">{error}</span>}
        </div>
      {showCustom && (
        <div className="absolute z-30 top-4 left-1/3 ml-8 py-2 px-4 bg-white w-1/2 md:w-1/3 opacity-90 shadow rounded">
          <CustomContract departureIcao={searchIcao} hideSection={() => setShowCustom(false)} />
        </div>
      )}
      {showSort && (
        <div className="absolute z-30 top-4 left-1/3 ml-8 bg-white w-1/2 md:w-1/5 opacity-90 shadow rounded">
          <div onClick={() => handleSort('heading')} className="border-b-2 border-gray-200 rounded-t py-2 hover:bg-orange-200 cursor-pointer"><span className="px-2">Heading (asc)</span></div>
          <div onClick={() => handleSort('distance')} className="border-b-2 border-gray-200 py-2 hover:bg-orange-200 cursor-pointer"><span className="px-2">Distance (asc)</span></div>
          <div onClick={() => handleSort('contract_value')} className="border-b-2 border-gray-200 py-2 hover:bg-orange-200 cursor-pointer"><span className="px-2">Value (desc)</span></div>
          <div onClick={() => handleSort('payload')} className="border-b-2 border-gray-200 py-2 hover:bg-orange-200 cursor-pointer"><span className="px-2">Payload (desc)</span></div>
          <div onClick={() => handleSort('pax')} className="rounded-b py-2 hover:bg-orange-200 cursor-pointer"><span className="px-2">Pax (desc)</span></div>
        </div>
      )}
      {showContracts && (<div className="absolute z-30 top-20 left-4 bottom-4 bg-white w-1/2 md:w-1/3 opacity-90 shadow rounded h-auto overflow-y-auto mb-2">
          {contracts && contracts.map((contract) => (
            <div key={contract.id} onClick={() => updateSelectedContract(contract)} className={`${contract.id === selectedContract.id ? 'bg-orange-200 hover:bg-orange-100' : ''} border-t-2 text-sm cursor-pointer z-40`}>
              <div className="px-4 py-2 flex justify-between items-center">
                <Tooltip direction="right" content="Expiry date">
                <div className="text-xs text-gray-700">
                  {dayjs(contract.expires_at).format('DD/MM/YYYY HH:mm')}
                </div>
                </Tooltip>
                <Tooltip direction="bottom" content="Destination">
                  <div className="text-sm text-gray-800 font-bold">
                    {contract.arr_airport_id}
                  </div>
                </Tooltip>
                <Tooltip direction="left" content="Accept contract">
                <button onClick={() => bidForContract(contract)} className="btn btn-secondary btn-small">
                  <FontAwesomeIcon icon={faCheck} />
                </button>
                </Tooltip>
              </div>
              <div className="px-4 py-2 flex justify-between">
                <div className="flex items-center space-x-4">
                  <Tooltip direction="right" content="Number of cargo items">
                  <div className="mx-1 flex items-center space-x-1">
                    <FontAwesomeIcon icon={faBoxArchive} />
                    <span>{contract.cargo.length}</span>
                  </div>
                  </Tooltip>
                  <Tooltip direction="bottom" content="Total cargo">
                  <div className="mx-1 flex items-center space-x-1">
                    <FontAwesomeIcon icon={faSuitcase} />
                    <span>{contract.payload ? <>{contract.payload}</> : <>0</>} lbs</span>
                  </div>
                  </Tooltip>
                  <Tooltip direction="bottom" content="Total pax">
                  <div className="mx-1 flex items-center space-x-1">
                    <FontAwesomeIcon icon={faUserGroup} />
                    <span>{contract.pax ? <>{contract.pax}</> : <>0</>}</span>
                  </div>
                  </Tooltip>
                  <Tooltip direction="bottom" content="Distance">
                  <div className="mx-1 flex items-center space-x-1">
                    <FontAwesomeIcon icon={faCompass} />
                    <span>{contract.distance} nm</span>
                  </div>
                  </Tooltip>
                  <Tooltip direction="bottom" content="Heading">
                  <div className="mx-1 flex items-center space-x-1">
                    <span style={{ transform: `rotate(${contract.heading}deg)` }}><FontAwesomeIcon icon={faArrowUp} className="text-gray-700" /></span>
                  </div>
                  </Tooltip>
                  <Tooltip direction="left" content="Contract value">
                  <div className="mx-1 flex items-center space-x-1">
                    <FontAwesomeIcon icon={faDollarSign} />
                    <span>${contract.contract_value}</span>
                  </div>
                  </Tooltip>
                </div>
              </div>
              <div className="flex justify-start pl-4 py-1">
                <Tooltip direction="right" content="Show cargo details">
                <button className="btn btn-light flex justify-center items-center text-center" onClick={() => toggleDetail(contract.id)}>
                  {showDetail && showDetailId === contract.id ? <FontAwesomeIcon icon={faMinus} /> : <FontAwesomeIcon icon={faPlus} />}
                </button>
                </Tooltip>
              </div>
              {showDetail && showDetailId === contract.id && (
              <div className="flex justify-between px-4 py-2">
                <div className="mt-1 text-xs">
                  {contracts && contract.cargo.map((c) => (
                    <div key="c.id" className="flex justify-between items-center cursor-pointer">
                      <div className="flex justify-between items-center text-sm">
                        <Tooltip direction="right" content="Current location">
                        <div className="flex items-baseline space-x-1 mr-4">
                          <FontAwesomeIcon icon={faLocationDot} />
                          <div className="">{c.current_airport_id}</div>
                        </div>
                        </Tooltip>
                        <div className="flex items-center space-x-1 mr-4">
                          <Tooltip direction="top" content="Origin">
                          <div className="mr-1 flex items-center space-x-1">
                            <FontAwesomeIcon icon={faPlaneDeparture} />
                            <span>{c.dep_airport_id}</span>
                          </div>
                          </Tooltip>
                          <Tooltip direction="top" content="Destination">
                          <div className="mr-2 flex items-center space-x-1">
                            <FontAwesomeIcon icon={faPlaneArrival} />
                            <span>{c.arr_airport_id}</span>
                          </div>
                          </Tooltip>
                        </div>
                        <Tooltip direction="top" content="Cargo">
                        <div className="mr-2 flex items-center space-x-1">
                          <div className="mr-1">{c.cargo_qty} {c.cargo_type_id === 1 ? 'lbs' : ''}</div>
                          <div className="mr-2">{c.cargo}</div>
                        </div>
                        </Tooltip>
                        <Tooltip direction="left" content="Heading">
                        <div className="flex items-center space-x-1">
                          <span style={{ transform: `rotate(${contract.heading}deg)` }}><FontAwesomeIcon icon={faArrowUp} className="text-gray-700" /></span>
                        </div>
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              )}
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
