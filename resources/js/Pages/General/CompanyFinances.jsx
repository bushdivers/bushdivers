import React from 'react'
import Pagination from '../../Shared/Elements/Pagination'
import AppLayout from '../../Shared/AppLayout'
import Card from '../../Shared/Elements/Card'

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
      case 10:
        return 'General Expenditure'
    }
  }

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:justify-between">
        <div className="md:w-1/2 md:mx-2">
          <Card title="Account Balance">
            <h3>${parseFloat(balance).toLocaleString()}</h3>
          </Card>
          {accounts && accounts.data.map((entry) => (
            <div key={entry.id} className="my-2">
              <Card>
                <div className="flex justify-between">
                  <div>
                    ${parseFloat(entry.total).toFixed(2).toLocaleString()} <br />
                    <span className="text-sm">
                  {renderTransactionType(entry.transaction_type)}
                </span>
                  </div>
                  <div>memo: {entry.memo}</div>
                  <div>{entry.created_at}</div>
                </div>
              </Card>
            </div>
          ))}
          <div className="mt-2">
            <Pagination pages={accounts} />
          </div>
        </div>
        <div className="md:w-1/2 md:mx-2">
          <Card>
            <h3>Monthly Costs</h3>
            <div className="my-2">
              <h4>Aircraft Operations</h4>
              <span className="text-xl">${parseFloat(aircraftOps).toLocaleString()}</span>
            </div>
            <div className="my-2">
              <h4>Aircraft Storage</h4>
              <span className="text-xl">${parseFloat(aircraftStorage).toLocaleString()}</span>
            </div>
            <div className="my-2">
              <h4>Hub Rentals</h4>
              <span className="text-xl">${parseFloat(hubs).toLocaleString()}</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

CompanyFinances.layout = page => <AppLayout children={page} title="Bush Divers Finances" heading="Bush Divers Finances" />

export default CompanyFinances
