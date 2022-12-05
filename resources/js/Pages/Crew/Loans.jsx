import React, { useEffect, useState } from 'react'
import AppLayout from '../../Shared/AppLayout'
import Card from '../../Shared/Elements/Card'
import TextInput from '../../Shared/Elements/Forms/TextInput'
import Range from '../../Shared/Elements/Forms/Range'
import { Inertia } from '@inertiajs/inertia'
import dayjs from 'dayjs'

const Loans = ({ loanValue, currentLoans }) => {
  const [loanAmount, setLoanAmount] = useState(0.00)
  const [months, setMonths] = useState(2)
  const [interest, setInterest] = useState(0)
  const [payment, setPayment] = useState(0)
  const [total, setTotal] = useState(0)
  const [errors, setErrors] = useState({
    loanAmount: null
  })
  const [applyError, setApplyError] = useState(null)

  useEffect(() => {
    const interest = (loanAmount * 8.00 * months) / (100 * 12)
    setInterest(parseFloat(interest))
    setTotal(parseFloat(parseFloat(loanAmount) + parseFloat(interest)))
  }, [months, loanAmount])

  useEffect(() => {
    setPayment(total / months)
  }, [total])

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
    setMonths(parseInt(e.target.value))
  }

  function applyForLoan () {
    setApplyError(null)
    if (loanAmount > 0) {
      Inertia.post('/loans', {
        loanAmount,
        total,
        payment,
        term: months,
        interest
      })
    } else {
      setApplyError('Please specify a loan amount')
    }
  }

  return (
    <div>
      <div className="lg:flex lg:justify-between lg:space-x-4 space-y-2 lg:space-y-0">
        <div className="w-full lg:w-1/2">
          <Card title="Calculate Your Loan">
            <p>Maximum loan amount available to you: <span className="text-lg">${parseFloat(loanValue).toLocaleString()}</span></p>
            {loanValue > 0 && (
              <>
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
              </>
            )
            }
          </Card>
        </div>
        <div className="w-full lg:w-1/2">
          <Card title="Your Monthly Loan">
            {loanValue > 0
              ? (
                <>
                  <div className="flex justify-between">
                    <div className="text-4xl">${parseFloat(payment).toLocaleString(navigator.language, { maximumFractionDigits: 0 })}</div>
                    <img className="h-32" src="https://res.cloudinary.com/dji0yvkef/image/upload/v1669234939/BDVA/Hornbill_Financing_logo2_vgcqdc.png" alt="hornbilfinance" />
                  </div>
                  <div className="flex justify-start mt-6 space-x-4">
                    <div>
                      <div className="stat-title">Loan Amount</div>
                      <div className="text-2xl">${loanAmount > 0 ? <span>{loanAmount.toLocaleString(navigator.language, { maximumFractionDigits: 0 })}</span> : <span>0</span> }</div>
                      <div className="stat-desc">The amount to borrow</div>
                    </div>
                    <div>
                      <div className="stat-title">Term</div>
                      <div className="text-2xl">{months} months</div>
                      <div className="stat-desc">Number of months</div>
                    </div>
                    <div>
                      <div className="stat-title">Total Cost of Loan</div>
                      <div className="text-2xl">${total.toLocaleString(navigator.language, { maximumFractionDigits: 0 })}</div>
                      <div className="stat-desc">The loan amount plus interest</div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <button onClick={() => applyForLoan()} className="btn btn-primary">Apply for Loan</button>
                  </div>
                  {applyError && <span className="text-sm text-error">{applyError}</span>}
                </>
                )
              : (
                <div className="flex justify-between">
                  <div className="text-xl">Unfortunately you cannot use Hornbill Financing at this point in time.</div>
                  <img className="h-32" src="https://res.cloudinary.com/dji0yvkef/image/upload/v1669234939/BDVA/Hornbill_Financing_logo2_vgcqdc.png" alt="hornbilfinance" />
                </div>
                )
            }
          </Card>
        </div>
      </div>
      <div className="w-full mt-4">
        <h2>Current Loans</h2>
        {currentLoans && currentLoans.map((loan) => (
          <div key={loan.id} className="mt-2">
            <Card title={`Loan #${loan.id}`}>
              <div className="flex justify-start space-x-6">
                <div>
                  <div className="stat-title">Monthly Payment</div>
                  <div className="text-2xl">${parseFloat(loan.monthly_payment).toLocaleString(navigator.language)}</div>
                  <div className="stat-desc">The monthly loan payment</div>
                </div>
                <div>
                  <div className="stat-title">Total Remaining</div>
                  <div className="text-2xl">${parseFloat(loan.total_remaining).toLocaleString(navigator.language)}</div>
                  <div className="stat-desc">The total loan remaining</div>
                </div>
                <div>
                  <div className="stat-title">Next Payment</div>
                  <div className="text-2xl">{dayjs(loan.next_payment_at).format('DD MMMM YYYY').toString()}</div>
                  <div className="stat-desc">Date of next payment</div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}

Loans.layout = page => <AppLayout children={page} title="Loans" heading="Loans" />

export default Loans
