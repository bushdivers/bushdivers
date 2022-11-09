import React, { useEffect, useState } from 'react'
import AppLayout from '../../Shared/AppLayout'
import Card from '../../Shared/Elements/Card'
import TextInput from '../../Shared/Elements/Forms/TextInput'
import Range from '../../Shared/Elements/Forms/Range'

const Loans = ({ loanValue }) => {
  const [loanAmount, setLoanAmount] = useState(0.00)
  const [months, setMonths] = useState(2)
  const [interest, setInterest] = useState(0)
  const [total, setTotal] = useState(0)
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

  function handleTermChange (e) {
    setMonths(e.target.value)
  }

  useEffect(() => {
    const interest = (loanAmount * 8.00 * months) / (100 * 12)
    setInterest(parseFloat(interest).toLocaleString(navigator.language, { maximumFractionDigits: 0 }))
    setTotal(parseFloat(parseFloat(loanAmount) + parseFloat(interest)).toLocaleString(navigator.language, { maximumFractionDigits: 0 }))
  }, [months, loanAmount])

  return (
    <div>
      <div className="flex justify-between space-x-4">
        <div className="w-1/2">
          <Card title="Calculate Your Loan">
            <p>Maximum loan amount available to you: <span className="text-lg">${parseFloat(loanValue).toLocaleString()}</span></p>
            <TextInput id="loanAmount" type="text" value={loanAmount} label="Amount to borrow" error={errors?.loanAmount} onChange={handleLoanAmountChange} />
            <Range id="term" label="Months" value={months} onChange={handleTermChange} min="2" max="12" step="1">
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
              <span>6</span>
              <span>7</span>
              <span>8</span>
              <span>9</span>
              <span>10</span>
              <span>11</span>
              <span>12</span>
            </Range>
          </Card>
        </div>
        <div className="w-1/2">
          <Card title="Your Monthly Loan">
            <h1>${loanAmount > 0 ? <span>{parseFloat(loanAmount).toLocaleString()}</span> : <span>0</span> }</h1>
            <div className="flex justify-start mt-6 space-x-4">
              <div>
                <div className="stat-title">Loan Amount</div>
                <div className="text-2xl">${loanAmount > 0 ? <span>{parseFloat(loanAmount).toLocaleString()}</span> : <span>0</span> }</div>
                <div className="stat-desc">The amount to borrow</div>
              </div>
              <div>
                <div className="stat-title">Term</div>
                <div className="text-2xl">{months} months</div>
                <div className="stat-desc">Number of months</div>
              </div>
              <div>
                <div className="stat-title">Total Cost of Loan</div>
                <div className="text-2xl">${total}</div>
                <div className="stat-desc">The loan amount plus interest</div>
              </div>
            </div>
            <div></div>
            <button className="btn btn-primary mt-2">Apply for Loan</button>
          </Card>
        </div>
      </div>
    </div>
  )
}

Loans.layout = page => <AppLayout children={page} title="Loans" heading="Loans" />

export default Loans
