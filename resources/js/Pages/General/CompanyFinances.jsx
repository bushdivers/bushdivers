import { Card, CardBody, CardHeader } from '@chakra-ui/react'
import { format } from 'date-fns'
import React from 'react'

import Pagination from '../../components/elements/Pagination'
import AppLayout from '../../components/layout/AppLayout'

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

const CompanyFinances = ({
  accounts,
  balance,
  aircraftStorage,
  aircraftOps,
  hubs,
}) => {
  return (
    <div>
      <div className="flex flex-col space-y-2 md:flex-row md:justify-between">
        <div className="md:w-1/2 md:mx-2">
          <Card>
            <CardBody>
              <div className="overflow-x-auto">
                <table className="table table-compact w-full overflow-x-auto">
                  <thead>
                    <tr>
                      <th>Amount</th>
                      <th>Transaction Type</th>
                      <th>Memo</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.data.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <span className="text-right">
                            $
                            {parseFloat(row.total).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </td>
                        <td>
                          <span>
                            {renderTransactionType(row.transaction_type)}
                          </span>
                        </td>
                        <td>{row.memo}</td>
                        <td>
                          <span>
                            {format(
                              new Date(row.created_at),
                              'dd LLL yyyy hh:mm',
                              { timeZone: 'UTC' }
                            )}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
          <div className="mt-2">
            <Pagination pages={accounts} />
          </div>
        </div>
        <div className="md:w-1/2 md:mx-2 flex flex-col space-y-2">
          <Card>
            <CardHeader>Account Balance</CardHeader>
            <CardBody>
              <h3>
                $
                {parseFloat(balance).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </h3>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>Monthly Costs</CardHeader>
            <CardBody>
              <div className="my-2">
                <h4>Aircraft Operations</h4>
                <span className="text-xl">
                  ${parseFloat(aircraftOps).toLocaleString()}
                </span>
              </div>
              <div className="my-2">
                <h4>Aircraft Storage</h4>
                <span className="text-xl">
                  ${parseFloat(aircraftStorage).toLocaleString()}
                </span>
              </div>
              <div className="my-2">
                <h4>Hub Rentals</h4>
                <span className="text-xl">
                  ${parseFloat(hubs).toLocaleString()}
                </span>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

CompanyFinances.layout = (page) => (
  <AppLayout
    children={page}
    title="Bush Divers Finances"
    heading="Bush Divers Finances"
  />
)

export default CompanyFinances
