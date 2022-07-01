import React from 'react'
import AppLayout from '../../Shared/AppLayout'
import { Link } from '@inertiajs/inertia-react'

const Aircraft = ({ fleet }) => {
  return (
    <div className="p-4">
      <p>Please select an aircraft type:</p>
      <div className="flex flex-wrap justify-start">
      {fleet && fleet.map((f) => (
        <div key={f.id} className="bg-white m-4 rounded shadow cursor-pointer w-1/4">
          <div><img src={f.rental_image} className="rounded-t w-full" /></div>
          <div className="p-4">
            <div className="text-lg">{f.name}</div>
            <div className="my-1">
              <p>Price Range:</p>
              <div>New: ${f.new_price}</div>
              <div>Used: ${f.used_low_price} - ${f.used_high_price}</div>
            </div>
            <div className="flex flex-col text-sm">
              <span>Powerplants: {f.number_of_engines} x {f.powerplants}</span>
              <span>Fuel Type: {fleet.fuel_type === 1 ? <span>Avgas</span> : <span>Jet Fuel</span>}</span>
              <span>Fuel Capacity: {f.fuel_capacity} gal</span>
              <span>ZFW: {f.zfw} lbs</span>
              <span>MTOW: {f.mtow} lbs</span>
              <span>Cargo Capacity: {f.cargo_capacity} lbs</span>
              <span>PAX Capacity: {f.pax_capacity}</span>
              <span>Service Ceiling: {f.service_ceiling} ft</span>
              <span>Range: {f.range} nm</span>
              <span>Cruise Speed: {f.cruise_speed} KIAS</span>
            </div>
            <div className="mt-2 flex justify-between">
              <Link href={`/marketplace/purchase/new/${f.id}`} className="btn btn-secondary">Purchase New</Link>
              {/*<Link href={`/marketplace/list/used/${f.id}`} className="btn btn-primary">Purchase Used</Link>*/}
            </div>
          </div>
        </div>
      ))}
      </div>
    </div>
  )
}

Aircraft.layout = page => <AppLayout children={page} title="Marketplace - Aircraft" heading="Marketplace - Aircraft" />

export default Aircraft
