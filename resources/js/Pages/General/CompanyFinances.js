import React from 'react'
import PageTitle from '../../Shared/Navigation/PageTitle'
import Layout from '../../Shared/Layout'

const CompanyFinances = ({ accounts, balance, aircraftStorage, aircraftOps, hubs }) => {
  const renderTransactionType = (transactionType) => {
    switch (transactionType) {
      case 1:
        return 'Hub Rental'
      case 2:
        return 'Aircraft Storage'
      case 3:
        return 'Aircraft Operations'
      case 4:
        return 'Aircraft Maintenance'
      case 5:
        return 'Ground Handling'
      case 6:
        return 'Landing Fees'
      case 7:
        return 'Fuel Costs'
      case 8:
        return 'Contract Income'
      case 9:
        return 'Contract Pilot Pay'
    }
  }

  return (
    <div>
      <PageTitle title="Bush Divers Finances" />
      <div className="flex flex-col md:flex-row md:justify-between">
        <div className="md:w-1/2 md:mx-2">
          <div className="bg-white shadow rounded p-4 mt-2">
            <div className="text-xl">Account Balance</div>
            <div className="text-2xl">${balance}</div>
          </div>
          {accounts && accounts.map((entry) => (
            <div key={entry.id} className="bg-white shadow rounded p-4 mt-2 flex justify-between">
              <div>
                ${entry.total} <br />
                <span className="text-sm">
                {renderTransactionType(entry.transaction_type)}
              </span>
              </div>
              <div>memo: {entry.memo}</div>
              <div>{entry.created_at}</div>
            </div>
          ))}
        </div>
        <div className="md:w-1/2 md:mx-2">
          <div className="bg-white shadow rounded p-4 mt-2">
            <div className="text-xl mb-2">Monthly Costs</div>
            <div className="my-1">
              <span className="text-lg my-1">Aircraft Operations: </span> <br/>
              <span className="text-xl">${aircraftOps}</span>
            </div>
            <div className="my-1">
              <span className="text-lg my-1">Aircraft Storage: </span> <br/>
              <span className="text-xl">${aircraftStorage}</span>
            </div>
            <div className="my-1">
              <span className="text-lg my-1">Hub Rentals: </span> <br/>
              <span className="text-xl">${hubs}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

CompanyFinances.layout = page => <Layout children={page} title="Bush Divers Finances" />

export default CompanyFinances
