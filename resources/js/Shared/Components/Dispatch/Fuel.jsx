import React, { useEffect, useState } from 'react'
import Card from '../../Elements/Card'
import TextInput from '../../Elements/Forms/TextInput'

const Fuel = (props) => {
  const [fuelWeight, setFuelWeight] = useState(null)
  useEffect(() => {
    if (props.selectedAircraft) {
      const weight = props.selectedAircraft.fleet.fuel_type_id === 1 ? props.fuel * 5.99 : props.fuel * 6.79
      setFuelWeight(weight)
    }
  }, [props.fuel])

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
              <div className="text-sm">{fuelWeight} lbs <span className="italic">(estimated)</span></div>
            </div>
          </div>
        </div>
      )}
      </Card>
    </div>
  )
}

export default Fuel
