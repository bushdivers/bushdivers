import React from 'react'
import { faPlaneUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const DispatchSummary = (props) => {
  return (
    <>
      <div className="text-xl">Dispatch Summary</div>
      <p className="mt-2">Planned Destination: {props.pirep ? <span>{props.pirep.destination_airport_id}</span> : <span>{props.destination}</span>}</p>
      <div className="mt-2">
        <div>
          {props.selectedAircraft && <div className="flex justify-start items-center"><FontAwesomeIcon icon={faPlaneUp} className="mr-2" /><span>{props.selectedAircraft.registration} - {props.selectedAircraft.fleet.manufacturer} {props.selectedAircraft.fleet.name} ({props.selectedAircraft.fleet.type}) {props.pirep && props.pirep.is_rental ? <span className="bg-orange-500 text-white rounded px-2">Rental</span> : <></>}</span></div>}
        </div>
      </div>
      <div className="mt-2">
        <div className="text-lg mb-1">Payload:</div>
        {props.deadHead ? <span className="italic">Deadhead flight - no cargo</span> : <span></span>}
        <div>Pilot & payload weight (inc. fuel): {props.selectedAircraft && <span className={props.selectedAircraft && (props.personWeight + props.fuelWeight + props.cargoWeight) > (props.selectedAircraft.fleet.mtow - props.selectedAircraft.fleet.zfw) ? 'text-red-500' : ''}>{(props.personWeight + props.fuelWeight + props.cargoWeight).toFixed(2)} lbs / {(props.selectedAircraft.fleet.mtow - props.selectedAircraft.fleet.zfw)} lbs</span>}</div>
        <div>Cargo payload: {props.selectedAircraft && <span className={props.selectedAircraft && props.cargoWeight > props.selectedAircraft.fleet.cargo_capacity ? 'text-red-500' : ''}>{props.cargoWeight} lbs / {props.selectedAircraft.fleet.cargo_capacity} lbs</span>}</div>
        <div>Passenger count: {props.selectedAircraft && <span className={props.selectedAircraft && props.passengerCount > props.selectedAircraft.fleet.pax_capacity ? 'text-red-500' : ''}>{props.passengerCount} / {props.selectedAircraft.fleet.pax_capacity}</span>}</div>
        <div className="mt-1">Fuel: {props.pirep ? <span>{props.pirep.planned_fuel} gal | {props.fuelWeight.toFixed(2)} lbs</span> : <span>{props.fuel} gal | {props.fuelWeight.toFixed(2)} lbs</span>}</div>
      </div>
    </>
  )
}

export default DispatchSummary
