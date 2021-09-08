import React from 'react'

const LogbookSecondary = ({ pirep }) => {
  return (
    <div className="rounded shadow p-4 mt-2 bg-white mx-2">
      <div className="flex justify-between items-center">
        {pirep.pax > 0 &&
        <div className="flex flex-col items-center my-2 mx-4">
                  <span className="flex items-center text-sm">
                    <i className="material-icons md-18">group</i>
                  </span>
          <span className="text-lg">{pirep.pax}</span>
          <span className="text-sm">{pirep.pax_name}</span>
        </div>
        }
        <div className="flex flex-col items-center my-2 mx-4">
          <span className="flex items-center text-sm"><i className="material-icons md-18">inventory</i></span>
          <span className="text-lg">{pirep.cargo} kg</span>
          <span className="text-sm">{pirep.cargo_name}</span>
        </div>
        <div className="flex flex-col items-center my-2 mx-4">
          <div className="text-sm">Landing rate</div>
          <div className="text-xl">{pirep.landing_rate}</div>
        </div>
        <div className="flex flex-col items-center my-2 mx-4">
          <div className="text-sm">Points</div>
          <div className="text-xl">{pirep.score}</div>
        </div>
        <div className="flex flex-col items-center my-2 mx-4">
          <div className="text-sm">Pay</div>
          <div className="text-xl">${pirep.pilot_pay}</div>
        </div>
      </div>
    </div>
  )
}

export default LogbookSecondary
