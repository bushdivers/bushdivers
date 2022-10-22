import React from 'react'
import Card from '../../Elements/Card'

const PirepFinancials = (props) => {
  const renderCompanyTransactionType = (transaction) => {
    switch (transaction) {
      case 5:
        return 'Ground Handling'
      case 6:
        return 'Landing Fee'
      case 7:
        return 'Fuel Cost'
      case 8:
        return 'Contract Income'
      case 9:
        return 'Pilot Pay'
    }
  }

  const renderPilotTransactionType = (transaction) => {
    switch (transaction) {
      case 1:
        return 'Contract Pay'
      case 4:
        return 'Landing Fee'
      case 5:
        return 'Bonus'
      case 6:
        return 'Rental Fees'
      case 7:
        return 'Fuel Cost'
      case 8:
        return 'Ground Handling'
      case 9:
        return 'Landing Fees'
    }
  }

  return (
    <div className="my-2 mx-2 overflow-x-auto">
      <Card title="Pirep Financials">
      <table className="table table-condensed table-auto">
        <thead>
        <tr>
          <th>Transaction</th>
          <th>Total</th>
        </tr>
        </thead>
        <tbody>
        {props.company.map((company) => (
          <tr key={company.id}>
            <td>{renderCompanyTransactionType(company.transaction_type)} - {company.memo}</td>
            <td className={company.total < 0 ? 'text-red-500' : undefined}>${company.total.toLocaleString(navigator.language)}</td>
          </tr>
        ))}
        </tbody>
      </table>
      <div className="text-right">
        <div>Total: <span className={props.companyTotal < 0 ? 'text-red-500' : undefined}>${props.companyTotal.toLocaleString(navigator.language)}</span></div>
      </div>
        <div className="mt-2"><h3>Pilot Financials</h3></div>
      <table className="table table-condensed table-auto">
        <thead>
        <tr>
          <th>Transaction</th>
          <th>Total</th>
        </tr>
        </thead>
        <tbody>
        {props.pilot.map((pilot) => (
          <tr key={pilot.id}>
            <td>{renderPilotTransactionType(pilot.type)}</td>
            <td className={pilot.total < 0 ? 'text-red-500' : undefined}>${pilot.total.toLocaleString(navigator.language)}</td>
          </tr>
        ))}
        </tbody>
      </table>
      <div className="text-right">
        <div>Total: <span className={props.pilotTotal < 0 ? 'text-red-500' : undefined}>${props.pilotTotal.toLocaleString(navigator.language)}</span></div>
      </div>
      </Card>
    </div>
  )
}

export default PirepFinancials
