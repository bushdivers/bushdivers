import React, { useEffect, useState, useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { usePage } from '@inertiajs/inertia-react'
import { Inertia } from '@inertiajs/inertia'
import AppLayout from '../../Shared/AppLayout'
import {
  faTimes
} from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import toast from 'react-hot-toast'
import AvailableContractsMap from '../../Shared/Components/Contracts/AvailableContractsMap'
import TextInput from '../../Shared/Elements/Forms/TextInput'
import Card from '../../Shared/Elements/Card'
import ContractDetail from '../../Shared/Components/Contracts/ContractDetail'
import MapOptions from '../../Shared/Elements/MapOptions'
import ThemeContext from '../../Context/ThemeContext'

const MyContracts = ({ contracts, location }) => {
  const { currentTheme } = useContext(ThemeContext)
  const { auth } = usePage().props
  const [icao, setIcao] = useState('')
  const [showContracts, setShowContracts] = useState(true)
  const [contractDetails, setContractDetails] = useState([])
  const [selectedIcao, setSelectedIcao] = useState('')
  const [filteredContracts, setFilteredContracts] = useState(contracts)
  const [currentMapStyle, setCurrentMapStyle] = useState('')

  useEffect(() => {
    if (selectedIcao !== '') {
      handleSelectedIcao(selectedIcao)
    }
    setIcao(auth.user.current_airport_id)
  }, [contracts])

  useEffect(() => {
    setCurrentMapStyle('')
  }, [currentTheme])

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
      <AvailableContractsMap contracts={filteredContracts} size="full" updatedMapStyle={currentMapStyle} defaultLocation={location} handleSelectedIcao={handleSelectedIcao} />
      <div className="absolute z-10 w-1/2 lg:w-1/4 opacity-90 top-10 left-12 right-12">
        <div className="w-full">
          <Card slimline title="Available Contracts">
            <div className="w-full flex items-center justify-between space-x-1">
              <TextInput id="icao" value={icao} onChange={handleIcaoUpdate} type="text" placeHolder="Filter ICAO" inline />
              <button onClick={() => filterContracts()} className="btn btn-primary">Filter</button>
            </div>
          </Card>
        </div>
      </div>
      <div className="absolute z-10 top-10 right-12">
        <button onClick={() => clearFilters()} className="btn btn-primary">Clear Filters</button>
      </div>
      <MapOptions updateMap={setCurrentMapStyle} currentStyle={currentMapStyle} />
      {showContracts && contractDetails.length > 0 && (
        <div className="absolute z-10 bg-neutral px-4 lg:w-2/5 opacity-90 map-data bottom-4 left-12 right-12 rounded-lg shadow-lg">
          <div className="sticky top-0 bg-neutral py-2 flex justify-between items-center mb-2">
            <h4>Contracts to/from {selectedIcao}</h4>
            <span onClick={() => clearContractDetails() } className="cursor-pointer p-2"><FontAwesomeIcon icon={faTimes} /></span>
          </div>
          <div className="map-data-content overflow-y-auto">
            {contractDetails && contractDetails.map((c) => (
              <ContractDetail key={c.id} contract={c} action={addToFlight} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

MyContracts.layout = page => <AppLayout children={page} title="Available Contracts" heading="Available Contracts" fullSize />

export default MyContracts
