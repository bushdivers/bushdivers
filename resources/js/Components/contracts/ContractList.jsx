import { router, usePage } from '@inertiajs/react'
import axios from 'axios'

import ContractDetail from './ContractDetail.jsx'

function ContractList({
  icao,
  contracts,
  currentViews,
  selectedContract,
  updateSelectedContract,
}) {
  const { auth } = usePage().props
  async function bidForContract(contract) {
    console.log(contract)
    // await updateSelectedContract(null)
    const data = {
      id: contract.id,
      userId: auth.user.id,
    }
    await axios.post('/api/contracts/bid', data)

    router.reload({ only: ['contracts'] })
  }
  return (
    <>
      {currentViews.includes('contracts') && contracts.length > 0 && (
        <div className="absolute z-10 bg-neutral px-4 lg:w-2/5 opacity-90 map-data bottom-4 left-12 right-12 rounded-lg shadow-lg">
          <div className="sticky top-0 bg-neutral py-2 flex justify-between items-center mb-2">
            <h4>Contracts from {icao}</h4>
          </div>
          <div className="map-data-content overflow-y-auto">
            {contracts &&
              contracts.map((c) => (
                <ContractDetail
                  key={c.id}
                  contract={c}
                  selectedContract={selectedContract}
                  action={bidForContract}
                  type="search"
                  updateSelectedContract={updateSelectedContract}
                />
              ))}
          </div>
        </div>
      )}
    </>
  )
}
