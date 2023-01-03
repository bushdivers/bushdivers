import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, usePage } from '@inertiajs/inertia-react'
import { Inertia } from '@inertiajs/inertia'
import AppLayout from '../../Shared/AppLayout'
import {
  faArrowDownWideShort,
  faArrowUp,
  faArrowUpShortWide,
  faCheck,
  faTimes
} from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import toast from 'react-hot-toast'
import AvailableContractsMap from '../../Shared/Components/Contracts/AvailableContractsMap'
import TextInput from '../../Shared/Elements/Forms/TextInput'
import Card from '../../Shared/Elements/Card'
import ContractDetail from '../../Shared/Components/Contracts/ContractDetail'

const MyContracts = ({ contracts, location }) => {
  const { auth } = usePage().props
  const [icao, setIcao] = useState('')
  const [showContracts, setShowContracts] = useState(true)
  const [contractDetails, setContractDetails] = useState([])
  const [selectedIcao, setSelectedIcao] = useState('')
  const [filteredContracts, setFilteredContracts] = useState(contracts)

  useEffect(() => {
    if (selectedIcao !== '') {
      setIcao(selectedIcao)
      filterContracts()
      handleSelectedIcao(selectedIcao)
    }
  }, [contracts])

  function handleIcaoUpdate (e) {
    setIcao(e.target.value)
  }

  function clearFilters () {
    setFilteredContracts(contracts)
    clearContractDetails()
    setIcao('')
  }

  function filterContracts () {
    const newFilter = contracts.filter(c => c.arr_airport.identifier === icao || c.current_airport_id === icao)
    setFilteredContracts(newFilter)
    handleSelectedIcao(icao)
  }

  function handleSelectedIcao (icao) {
    if (icao) {
      setSelectedIcao(icao)
      const contractData = contracts.filter(c => c.arr_airport.identifier === icao || c.current_airport_id === icao)
      setContractDetails(contractData.sort((a, b) => a.contract_value - b.contract_value))
      setShowContracts(true)
    }
  }

  function clearContractDetails () {
    setSelectedIcao('')
    setContractDetails(null)
    setShowContracts(false)
  }

  async function addToFlight (contract) {
    const qty = window.prompt('How much cargo do you want to assign?', contract.cargo_qty)
    if (qty < 1 || (qty % 1) !== 0) {
      window.alert('You must choose a whole number more than 0')
      return
    }

    if (qty > contract.cargo_qty) {
      window.alert('You must choose a whole number no more than original cargo')
      return
    }

    const data = {
      id: contract.id,
      qty,
      userId: auth.user.id,
      action: 'assign'
    }
    const assign = axios.post('/api/contracts/assign', data)
    await toast.promise(assign, {
      loading: '...Assigning contract',
      success: 'Contract added!',
      error: 'Issue assigning contract'
    }, { position: 'top-right' })
    Inertia.reload({ contracts })
  }

  return (
    <div className="relative">
      {/* <MyContractMap data={selectedContract} size="full" mapStyle={auth.user.map_style} /> */}
      <AvailableContractsMap contracts={filteredContracts} size="full" mapStyle={auth.user.map_style} defaultLocation={location} handleSelectedIcao={handleSelectedIcao} />
      <div className="absolute z-10 w-1/2 lg:w-1/4 opacity-90 top-10 left-4 right-4">
        <div className="w-full">
          <Card slimline title="Available Contracts">
            <div className="w-full flex items-center justify-between space-x-1">
              <TextInput id="icao" value={icao} onChange={handleIcaoUpdate} type="text" placeHolder="Filter ICAO" inline />
              <button onClick={() => filterContracts()} className="btn btn-primary">Filter</button>
            </div>
          </Card>
        </div>
      </div>
      <div className="absolute z-10 top-10 right-4">
        <button onClick={() => clearFilters()} className="btn btn-primary">Clear Filters</button>
      </div>
      {showContracts && contractDetails.length > 0 && (
        <div className="absolute z-10 bg-neutral px-4 lg:w-2/5 opacity-90 map-data bottom-4 left-4 right-4 rounded-lg shadow-lg">
          <div className="sticky top-0 bg-neutral py-2 flex justify-between items-center mb-2">
            <h4>Contracts to/from {selectedIcao}</h4>
            <span onClick={() => clearContractDetails() } className="cursor-pointer p-2"><FontAwesomeIcon icon={faTimes} /></span>
          </div>
          <div className="map-data-content overflow-y-auto">
            {contractDetails && contractDetails.map((c) => (
              <ContractDetail key={c.id} contract={c} addToFlight={addToFlight} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

MyContracts.layout = page => <AppLayout children={page} title="Available Contracts" heading="Available Contracts" fullSize />

export default MyContracts
