import React from 'react'

const Fuel = (props) => {
  return (
    <div className="shadow rounded p-4 mt-2 mr-2 bg-white">
      <div className="text-xl">Select Fuel</div>
      {props.selectedAircraft && (
        <div>
          <div>Useable Fuel (gal): {props.selectedAircraft.fleet.fuel_capacity}</div>
          <div>
            Current Fuel (gal):
            <div className="w-1/4">
              <input id="fuel" type="text" className="form-input form" value={props.fuel} onChange={props.handleUpdateFuel} />
            </div>
            {props.error && <span className="text-sm text-red-500">{props.error}</span>}
          </div>
        </div>
      )}
    </div>
  )
}

export default Fuel
