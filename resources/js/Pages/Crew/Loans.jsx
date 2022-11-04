import React, { useState } from 'react'
import AppLayout from '../../Shared/AppLayout'
import Card from '../../Shared/Elements/Card'
import TextInput from '../../Shared/Elements/Forms/TextInput'

const Loans = ({ loanValue }) => {
  const [loanAmount, setLoanAmount] = useState(0)
  const [errors, setErrors] = useState({
    loanAmount: null
  })

  function handleLoanAmountChange (e) {
    setErrors({ loanAmount: null })
    const value = e.target.value
    if (value > loanValue) {
      setErrors({ loanAmount: 'Value cannot be more than maximum loan value' })
      return
    }
    setLoanAmount(value)
  }

  return (
    <div>
      <div className="flex justify-between space-x-4">
        <div className="w-1/2">
          <Card title="Calculate Your Loan">
            <p>Maximum loan amount available to you: <span className="text-lg">${parseFloat(loanValue).toLocaleString()}</span></p>
            <TextInput id="loanAmount" type="text" value={loanAmount} label="Amount to borrow" error={errors?.loanAmount} onChange={handleLoanAmountChange} />
          </Card>
        </div>
        <div className="w-1/2">
          <Card title="Your Loan">
            <h1>${loanAmount > 0 ? <span>{parseFloat(loanAmount).toLocaleString()}</span> : <span>0</span> }</h1>
          </Card>
        </div>
      </div>
    </div>
  )
}

Loans.layout = page => <AppLayout children={page} title="Loans" heading="Loans" />

export default Loans
