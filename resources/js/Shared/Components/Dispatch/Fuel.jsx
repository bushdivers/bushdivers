import React from 'react'
import Card from '../../Elements/Card'
import TextInput from '../../Elements/Forms/TextInput'

const Fuel = (props) => {
  return (
    <div className="mt-2 mr-2">
      <Card title="Select Fuel">
      {props.selectedAircraft && (
        <div>
          <div>Useable Fuel (gal): {props.selectedAircraft.fleet.fuel_capacity}</div>
          <div>
            Current Fuel (gal):
            <div className="w-full lg:w-1/4">
              <TextInput id="fuel" type="text" value={props.fuel} onChange={props.handleUpdateFuel} error={props.error} />
            </div>
          </div>
        </div>
      )}
      </Card>
    </div>
  )
}

export default Fuel
