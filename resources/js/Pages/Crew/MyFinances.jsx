import { Inertia } from '@inertiajs/inertia'
import { usePage } from '@inertiajs/inertia-react'
import React from 'react'
import { displayNumber } from '../../Helpers/general.helpers'
import AppLayout from '../../Shared/AppLayout'
import Card from '../../Shared/Elements/Card'
import { format } from 'date-fns'
import Pagination from '../../Shared/Elements/Pagination'

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

const MyFinances = ({ accounts, balance, loanAvailable }) => {
  const { auth } = usePage().props

  function handleBorrowClick () {
    const value = window.prompt('Enter amount to borrow')
    if (parseFloat(value) > loanAvailable) {
      window.alert('Amount to borrow must be less than or equal to available amount!')
    } else {
      Inertia.post('/loans', { loanAmount: value, transaction: 'borrow' })
    }
  }

  function handleRepayClick () {
    const value = window.prompt('Enter amount to repay')
    if (parseFloat(value) > auth.user.loan) {
      window.alert('Amount to repay must be less than or equal to current amount!')
    } else {
      Inertia.post('/loans', { loanAmount: value, transaction: 'repay' })
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between">
      <div className="md:w-1/2">
        <Card>
          <div className="overflow-x-auto">
            <table className="table table-compact w-full overflow-x-auto">
              <thead>
              <tr>
                <th>Amount</th>
                <th>Transaction Type</th>
                <th>Date</th>
              </tr>
              </thead>
              <tbody>
              {accounts.data.map(row => (
                <tr key={row.id}>
                  <td><span className="text-right">${parseFloat(row.total).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span></td>
                  <td><span>{renderTransactionType(row.type)}</span></td>
                  <td><span>{format(new Date(row.created_at), 'dd LLL yyyy hh:mm', { timeZone: 'UTC' })}</span></td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </Card>
        <div className="mt-2">
          <Pagination pages={accounts} />
        </div>
      </div>
        <div className="md:w-1/4 md:mx-2">
          <Card title="Current Balance">
            <h4>${displayNumber(balance)}</h4>
          </Card>
          <div className="mt-2">
            <Card title="Current Loan">
              <div className="flex items-center gap-2"><h4>${auth.user.loan > 0.00 ? '-' : ''}{displayNumber(auth.user.loan)}</h4><button onClick={() => handleRepayClick()} className="btn btn-primary btn-sm">Repay</button></div>
            </Card>
          </div>
        </div>
        <div className="md:w-1/4 md:mx-2">
          <Card title="Available to Borrow">
            <div className="flex items-center gap-2"><h4>${displayNumber(loanAvailable)}</h4><button onClick={() => handleBorrowClick()} className="btn btn-primary btn-sm">Borrow</button></div>
          </Card>
        </div>
      </div>
    </div>
  )
}

MyFinances.layout = page => <AppLayout children={page} title="My Finances" heading="My Finances" />

export default MyFinances
