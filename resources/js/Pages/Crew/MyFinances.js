import React from 'react'
import Pagination from '../../Shared/Elements/Pagination'
import AppLayout from '../../Shared/AppLayout'

const MyFinances = ({ accounts, balance }) => {
  const renderTransactionType = (transactionType) => {
    switch (transactionType) {
      case 1:
        return 'Contract Pay'
      case 2:
        return 'Jumpseat'
      case 3:
        return 'Contract Cancellation'
      case 4:
        return 'Refuel Penalty'
      case 5:
        return 'Bonus Pay (i.e returning aircraft to hub)'
      case 6:
        return 'Aircraft Rental Fees'
      case 7:
        return 'Fuel Fees'
      case 8:
        return 'Ground Handling Fees'
      case 9:
        return 'Landing Fees'
      case 10:
        return 'Aircraft Maintenance Fees'
      case 11:
        return 'Monthly Aircraft Ownership cost'
      case 12:
        return 'Aircraft Purchase'
      case 13:
        return 'Aircraft Sale'
      default:
        return 'Other'
    }
  }

  return (
    <div className="p-4">
      <div className="md:w-1/2">
        <div className="bg-white shadow rounded p-4 mt-2">
          <div className="text-lg">Current Balance</div>
          <div className="text-xl">${balance.toFixed(2)}</div>
        </div>
        {accounts && accounts.data.map((entry) => (
          <div key={entry.id} className="bg-white shadow rounded p-4 mt-2 flex justify-between">
            <div>
              ${entry.total} <br />
              <span className="text-sm">
                {renderTransactionType(entry.type)}
              </span>
            </div>
            <div>{entry.created_at}</div>
          </div>
        ))}
        <div className="mt-2">
          <Pagination pages={accounts} />
        </div>
      </div>
    </div>
  )
}

MyFinances.layout = page => <AppLayout children={page} title="My Finances" heading="My Finances" />

export default MyFinances
