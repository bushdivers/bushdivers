import { Card, CardBody, CardHeader, Icon } from '@chakra-ui/react'
import { Inertia, usePage } from '@inertiajs/react'
import axios from 'axios'
import { X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import AvailableContractsMap from '../../components/contracts/AvailableContractsMap'
import ContractDetail from '../../components/contracts/ContractDetail'
import TextInput from '../../components/elements/forms/TextInput'
import AppLayout from '../../components/layout/AppLayout'

const MyContracts = ({ contracts, location }) => {
  const { auth } = usePage().props
  const [icao, setIcao] = useState('')
  const [showContracts, setShowContracts] = useState(true)
  const [contractDetails, setContractDetails] = useState([])
  const [selectedIcao, setSelectedIcao] = useState('')
  const [filteredContracts, setFilteredContracts] = useState(contracts)
  const [currentMapStyle] = useState('')

  useEffect(() => {
    if (selectedIcao !== '') {
      handleSelectedIcao(selectedIcao)
    }
    setIcao(auth.user.current_airport_id)
  }, [contracts])

  function handleIcaoUpdate(e) {
    setIcao(e.target.value)
  }

  function clearFilters() {
    setFilteredContracts(contracts)
    clearContractDetails()
    setIcao('')
  }

  function filterContracts() {
    const newFilter = contracts.filter(
      (c) => c.arr_airport.identifier === icao || c.current_airport_id === icao
    )
    setFilteredContracts(newFilter)
    handleSelectedIcao(icao)
  }

  function handleSelectedIcao(icao) {
    if (icao) {
      setSelectedIcao(icao)
      const contractData = contracts.filter(
        (c) =>
          c.arr_airport.identifier === icao || c.current_airport_id === icao
      )
      setContractDetails(
        contractData.sort((a, b) => a.contract_value - b.contract_value)
      )
      setShowContracts(true)
    }
  }

  function clearContractDetails() {
    setSelectedIcao('')
    setContractDetails(null)
    setShowContracts(false)
  }

  async function addToFlight(contract) {
    const qty = window.prompt(
      'How much cargo do you want to assign?',
      contract.cargo_qty
    )
    if (qty < 1 || qty % 1 !== 0) {
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
      action: 'assign',
    }
    await axios.post('/api/contracts/assign', data)

    Inertia.reload({ contracts })
  }

  return (
    <div className="relative">
      <AvailableContractsMap
        contracts={filteredContracts}
        size="full"
        updatedMapStyle={currentMapStyle}
        defaultLocation={location}
        handleSelectedIcao={handleSelectedIcao}
      />
      <div className="absolute z-10 w-1/2 lg:w-1/4 opacity-90 top-10 left-12 right-12">
        <div className="w-full">
          <Card>
            <CardHeader>Available Contracts</CardHeader>
            <CardBody>
              <div className="w-full flex items-center justify-between space-x-1">
                <TextInput
                  id="icao"
                  value={icao}
                  onChange={handleIcaoUpdate}
                  type="text"
                  placeHolder="Filter ICAO"
                  inline
                />
                <button
                  onClick={() => filterContracts()}
                  className="btn btn-primary"
                >
                  Filter
                </button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
      <div className="absolute z-10 top-10 right-12">
        <button onClick={() => clearFilters()} className="btn btn-primary">
          Clear Filters
        </button>
      </div>
      {showContracts && contractDetails.length > 0 && (
        <div className="absolute z-10 bg-neutral px-4 lg:w-2/5 opacity-90 map-data bottom-4 left-12 right-12 rounded-lg shadow-lg">
          <div className="sticky top-0 bg-neutral py-2 flex justify-between items-center mb-2">
            <h4>Contracts to/from {selectedIcao}</h4>
            <span
              onClick={() => clearContractDetails()}
              className="cursor-pointer p-2"
            >
              <Icon as={X} />
            </span>
          </div>
          <div className="map-data-content overflow-y-auto">
            {contractDetails &&
              contractDetails.map((c) => (
                <ContractDetail key={c.id} contract={c} action={addToFlight} />
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

MyContracts.layout = (page) => (
  <AppLayout
    children={page}
    title="Available Contracts"
    heading="Available Contracts"
    isFullSize
  />
)

export default MyContracts
