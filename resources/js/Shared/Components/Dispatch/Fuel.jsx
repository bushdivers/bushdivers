import React from 'react'
import Card from '../../Elements/Card'

const Fuel = (props) => {
  return (
    <div className="mt-2 mr-2">
      <Card title="Select Fuel">
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
      </Card>
    </div>
  )
}

export default Fuel
