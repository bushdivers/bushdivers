import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tooltip from '../../Shared/Elements/Tooltip'
import { usePage } from '@inertiajs/inertia-react'
import dayjs from '../../Helpers/date.helpers'
import ContractMap from '../../Shared/Components/Contracts/ContractMap'
import { Inertia } from '@inertiajs/inertia'
import CustomContract from '../../Shared/Components/Contracts/CustomContract'
import AppLayout from '../../Shared/AppLayout'
import {
  faAnchor,
  faArrowUp,
  faCheck,
  faCompass, faDollarSign, faPlaneArrival, faPlaneDeparture,
  faSuitcase,
  faUserGroup
} from '@fortawesome/free-solid-svg-icons'
import { formatNumber } from '../../Helpers/general.helpers'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import TextInput from '../../Shared/Elements/Forms/TextInput'
import Select from '../../Shared/Elements/Forms/Select'

const Contracts = ({ searchedContracts, airport, cacheKey }) => {
  const { auth } = usePage().props
  const [contracts, setContracts] = useState(searchedContracts)
  const [selectedAirport, setSelectedAirport] = useState('')
  const [searchForm, setSearchForm] = useState({
    searchIcao: auth.user.current_airport_id,
    flightLength: 'short',
    aircraftSize: 'small'
  })
  const [selectedContract, setSelectedContract] = useState({})
  const [error, setError] = useState(null)
  const [showCustom, setShowCustom] = useState(false)
  const [showContracts, setShowContracts] = useState(false)

  useEffect(() => {
    if (searchedContracts && airport) {
      setSelectedAirport(airport)
      setContracts(searchedContracts)
    }
  }, [searchedContracts])

  function handleChange (e) {
    const key = e.target.id
    const value = e.target.value
    setSearchForm(values => ({
      ...values,
      [key]: value
    }))
  }

  const handleSearch = async () => {
    setError(null)
    setSelectedContract('')
    setShowCustom(false)
    if (searchForm.searchIcao.length > 0) {
      // Call api to find contracts
      Inertia.post('/contracts', {
        icao: searchForm.searchIcao,
        flightLength: searchForm.flightLength,
        aircraftSize: searchForm.aircraftSize
      })
      setShowContracts(true)
    } else {
      setError('Please enter an ICAO')
    }
  }

  const updateSelectedContract = (contract) => {
    setSelectedContract(contract)
  }

  const bidForContract = async (contract) => {
    const newContracts = contracts.filter(c => c.id !== contract.id)
    const data = {
      contract: contract,
      icao: searchForm.searchIcao,
      userId: auth.user.id,
      contracts: newContracts,
      cacheKey
    }
    const bid = axios.post('/api/contracts/bid', data)
    await toast.promise(bid, {
      loading: '...Bidding on contract',
      success: 'Contract won!',
      error: 'Issue processing bid'
    }, { position: 'top-right' })
    setContracts(newContracts)

    // toast.loading('...Bidding on contract')
    // const data = {
    //   contract: contract,
    //   icao: searchForm.searchIcao
    // }
    // const res = await axios.post('/api/contracts/bid', data)
    // if (res.status === 201) {
    //   toast.success('Contract won!')
    //   const newContracts = contracts.filter(c => c.id !== contract.id)
    //   setContracts(newContracts)
    // } else {
    //   toast.error('Issue processing contract bid')
    // }
  }

  const toggleCustom = () => {
    setShowCustom(!showCustom)
  }

  return (
    <div className="relative">
      <ContractMap departure={selectedAirport} destination={selectedContract.destination} size="full" mapStyle={auth.user.map_style} />
        <div className="absolute z-10 top-4 left-4 py-2 px-4 bg-neutral w-auto md:w-1/3 opacity-90 shadow rounded">
          <div className="flex flex-col md:flex-row justify-start items-center space-x-1">
            <TextInput inline id="searchIcao" type="text" placeHolder="ICAO" value={searchForm.searchIcao} onChange={handleChange} />
              <Select id="flightLength" value={searchForm.flightLength} onChange={handleChange} options={[
                { value: 'short', text: '< 60nm' },
                { value: 'medium', text: '60-150nm' },
                { value: 'long', text: '> 150nm' }
              ]} />
              <Select id="aircraftSize" value={searchForm.aircraftSize} onChange={handleChange} options={[
                { value: 'small', text: 'Small Aircraft' },
                { value: 'medium', text: 'Medium Aircraft' },
                { value: 'large', text: 'Large Aircraft' }
              ]} />
          </div>
          <div className="flex flex-col md:flex-row justify-end items-baseline mt-2">
            <div><button onClick={() => handleSearch()} className="btn btn-primary">Find</button></div>
            <div>
              <Tooltip direction="top" content="Create custom contract">
                <button onClick={() => toggleCustom()} className="btn btn-secondary ml-2">Custom</button>
              </Tooltip>
            </div>
          </div>
          {error && <span className="text-sm text-red-500">{error}</span>}
        </div>
      {showCustom && (
        <div className="absolute z-10 top-4 left-1/3 ml-8 py-2 px-4 bg-neutral w-1/2 md:w-1/3 opacity-90 shadow rounded">
          <CustomContract departureIcao={searchForm.searchIcao} hideSection={() => setShowCustom(false)} />
        </div>
      )}
      {showContracts && contracts && (<div className="absolute z-10 top-40 left-4 bottom-4 bg-neutral w-1/2 md:w-1/3 opacity-90 shadow rounded h-auto overflow-y-auto">
          {contracts && contracts.map((contract) => (
            <div key={contract.id} onClick={() => updateSelectedContract(contract)} className={`${contract.id === selectedContract.id ? 'bg-secondary text-base-100 dark:bg-gray-600' : ''} text-sm cursor-pointer z-10`}>
              <div className="px-4 py-2 flex justify-between items-center">
                <Tooltip direction="right" content="Expiry date">
                <div className="text-xs">
                  {dayjs(contract.expires_at).format('DD/MM/YYYY HH:mm')}
                </div>
                </Tooltip>
                <Tooltip direction="bottom" content="Destination">
                  <div className="text-sm font-bold">
                    {contract.destination.identifier} {contract.destination.longest_runway_surface === 'W' ? <FontAwesomeIcon icon={faAnchor} /> : <></>}
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
                  <Tooltip direction="bottom" content="Total cargo">
                  <div className="mx-1 flex items-center space-x-1">
                    <FontAwesomeIcon icon={faSuitcase} />
                    <span>{contract.cargo_type === 1 ? <>{formatNumber(contract.cargo_qty)}</> : <>0</>} lbs</span>
                  </div>
                  </Tooltip>
                  <Tooltip direction="bottom" content="Total pax">
                  <div className="mx-1 flex items-center space-x-1">
                    <FontAwesomeIcon icon={faUserGroup} />
                    <span>{contract.cargo_type === 2 ? <>{contract.cargo_qty}</> : <>0</>}</span>
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
                    <span style={{ transform: `rotate(${contract.heading}deg)` }}><FontAwesomeIcon icon={faArrowUp} /></span>
                  </div>
                  </Tooltip>
                  <Tooltip direction="left" content="Contract value">
                  <div className="mx-1 flex items-center space-x-1">
                    <FontAwesomeIcon icon={faDollarSign} />
                    <span>{formatNumber(contract.contract_value)}</span>
                  </div>
                  </Tooltip>
                </div>
              </div>
              <div className="flex justify-between px-4 py-2">
                <div className="mt-1 text-xs">
                    <div className="flex justify-between items-center cursor-pointer">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center space-x-1 mr-4">
                          <Tooltip direction="top" content="Origin">
                          <div className="mr-1 flex items-center space-x-1">
                            <FontAwesomeIcon icon={faPlaneDeparture} />
                            <span>{contract.departure}</span>
                          </div>
                          </Tooltip>
                          <Tooltip direction="top" content="Destination">
                          <div className="mr-2 flex items-center space-x-1">
                            <FontAwesomeIcon icon={faPlaneArrival} />
                            <span>{contract.destination.identifier}</span>
                          </div>
                          </Tooltip>
                        </div>
                        <Tooltip direction="top" content="Cargo">
                        <div className="mr-2 flex items-center space-x-1">
                          <div className="mr-1">{formatNumber(contract.cargo_qty)} {contract.cargo_type === 1 ? 'lbs' : ''}</div>
                          <div className="mr-2">{contract.cargo}</div>
                        </div>
                        </Tooltip>
                        <Tooltip direction="left" content="Heading">
                        <div className="flex items-center space-x-1">
                          <span style={{ transform: `rotate(${contract.heading}deg)` }}><FontAwesomeIcon icon={faArrowUp} /></span>
                        </div>
                        </Tooltip>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

Contracts.layout = page => <AppLayout children={page} title="Find a Contract" heading="Find a Contract" />

export default Contracts
