import React from 'react'
import AppLayout from '../../Shared/AppLayout'

const Loans = ({ loanValue }) => {
  return (
    <div>
      Loan amount available: {loanValue}
    </div>
  )
}

Loans.layout = page => <AppLayout children={page} title="Loans" heading="Loans" />

export default Loans
