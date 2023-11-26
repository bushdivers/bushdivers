import React, { useState } from 'react'
import { usePage } from '@inertiajs/inertia-react'
import { Inertia } from '@inertiajs/inertia'
import AppLayout from '../../Shared/AppLayout'
import Card from '../../Shared/Elements/Card'

const FleetEdit = ({ fleet, manufacturers }) => {
  const { errors } = usePage().props
  const [values, setValues] = useState({
    type: fleet?.type,
    name: fleet?.name ?? '',
    manufacturer: fleet?.manufacturer ?? '',
    manufacturer_id: fleet?.manufacturer_id ?? '0',
    powerplants: fleet?.powerplants ?? '',
    engines: fleet?.number_of_engines ?? '',
    fuel: fleet?.fuel_type ?? '1',
    zfw: fleet?.zfw ?? '',
    mtow: fleet?.mtow ?? '',
    cargo: fleet?.cargo_capacity ?? '',
    pax: fleet?.pax_capacity ?? '',
    fuelCapacity: fleet?.fuel_capacity ?? '',
    ceiling: fleet?.service_ceiling ?? '',
    range: fleet?.range ?? '',
    cruise: fleet?.cruise_speed ?? '',
    size: fleet?.size ?? 'S',

    is_rental: fleet?.is_rental ?? '0',
    rental_cost: fleet?.rental_cost ?? '',
    hq: fleet?.hq ?? '',
    new_price: fleet?.new_price ?? '',
    used_low_price: fleet?.used_low_price ?? '',
    used_high_price: fleet?.used_high_price ?? ''
  })

  function handleChange (e) {
    const key = e.target.id
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setValues(values => ({
      ...values,
      [key]: value
    }))
  }

  function handleSubmit (e) {
    e.preventDefault()
    Inertia.post(fleet ? `/admin/fleet/edit/${fleet.id}` : '/admin/fleet/create', values)
  }

  return (
    <div className="p-4">
      <Card>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-row">
            <div className="lg:w-1/2 mt-2 p-4 rounded shadow">
                <div className="my-2">
                  <label htmlFor="type" className="block"><span>ICAO type</span></label>
                  <input id="type" value={values.type} onChange={handleChange} type="text" className="input" />
                  {errors.type && <div className="text-sm text-red-500">{errors.type}</div>}
                </div>
                <div className="my-2">
                  <label htmlFor="name" className="block"><span>Model name</span></label>
                  <input id="name" value={values.name} onChange={handleChange} type="text" className="input" />
                  {errors.name && <div className="text-sm text-red-500">{errors.name}</div>}
                </div>
                <div className="my-2">
                  <label htmlFor="manufacturer" className="block"><span>Manufacturer</span></label>
                  <input id="manufacturer" value={values.manufacturer} onChange={handleChange} type="text" className="input" />
                  {errors.manufacturer && <div className="text-sm text-red-500">{errors.manufacturer}</div>}
                </div>
                <div className="my-2">
                  <label htmlFor="powerplants" className="block"><span>Engine type</span></label>
                  <input id="powerplants" value={values.powerplants} onChange={handleChange} type="text" className="input" />
                  {errors.powerplants && <div className="text-sm text-red-500">{errors.powerplants}</div>}
                </div>
                <div className="my-2">
                  <label htmlFor="engines" className="block"><span>Number of engines</span></label>
                  <input id="engines" value={values.engines} onChange={handleChange} type="text" className="input" />
                  {errors.engines && <div className="text-sm text-red-500">{errors.engines}</div>}
                </div>
                <div className="my-2">
                  <label htmlFor="fuel" className="block"><span>Fuel type</span></label>
                  <select id="fuel" value={values.fuel} onChange={handleChange} className="select">
                    <option value="1">Avgas (100LL)</option>
                    <option value="2">Jet Fuel</option>
                  </select>
                </div>
                <div className="my-2">
                  <label htmlFor="zfw" className="block"><span>Zero fuel weight / empty weight (lbs)</span></label>
                  <input id="zfw" value={values.zfw} onChange={handleChange} type="text" className="input" />
                  {errors.zfw && <div className="text-sm text-red-500">{errors.zfw}</div>}
                </div>
                <div className="my-2">
                  <label htmlFor="mtow" className="block"><span>MTOW (lbs)</span></label>
                  <input id="mtow" value={values.mtow} onChange={handleChange} type="text" className="input" />
                  {errors.mtow && <div className="text-sm text-red-500">{errors.mtow}</div>}
                </div>
                <div className="my-2">
                  <label htmlFor="cargo" className="block"><span>Cargo capacity (lbs)</span></label>
                  <input id="cargo" value={values.cargo} onChange={handleChange} type="text" className="input" />
                  {errors.cargo && <div className="text-sm text-red-500">{errors.cargo}</div>}
                </div>
                <div className="my-2">
                  <label htmlFor="pax" className="block"><span>Passenger capacity</span></label>
                  <input id="pax" value={values.pax} onChange={handleChange} type="text" className="input" />
                  {errors.pax && <div className="text-sm text-red-500">{errors.pax}</div>}
                </div>
                <div className="my-2">
                  <label htmlFor="fuelCapacity" className="block"><span>Fuel capacity (gal)</span></label>
                  <input id="fuelCapacity" value={values.fuelCapacity} onChange={handleChange} type="text" className="input" />
                  {errors.fuelCapacity && <div className="text-sm text-red-500">{errors.fuelCapacity}</div>}
                </div>
                <div className="my-2">
                  <label htmlFor="ceiling" className="block"><span>Service ceiling (ft)</span></label>
                  <input id="ceiling" value={values.ceiling} onChange={handleChange} type="text" className="input" />
                  {errors.ceiling && <div className="text-sm text-red-500">{errors.ceiling}</div>}
                </div>
                <div className="my-2">
                  <label htmlFor="range" className="block"><span>Range (nm)</span></label>
                  <input id="range" value={values.range} onChange={handleChange} type="text" className="input" />
                  {errors.range && <div className="text-sm text-red-500">{errors.range}</div>}
                </div>
                <div className="my-2">
                  <label htmlFor="cruise" className="block"><span>Cruise speed (kts)</span></label>
                  <input id="cruise" value={values.cruise} onChange={handleChange} type="text" className="input" />
                  {errors.cruise && <div className="text-sm text-red-500">{errors.cruise}</div>}
                </div>
                <div className="my-2">
                  <label htmlFor="size" className="block"><span>Size</span></label>
                  <select id="size" value={values.size} onChange={handleChange} className="select">
                    <option value="S">Small</option>
                    <option value="M">Medium</option>
                    <option value="L">Large</option>
                  </select>
                </div>
                <button className="btn btn-primary">Save Fleet</button>

            </div>
            <div className="lg:w-1/2 mt-2 p-4 rounded shadow">
              <div className="my-2">
                <label htmlFor="is_rental" className="block"><span>Can private rent?</span></label>
                <select id="is_rental" value={values.is_rental} onChange={handleChange} className="select">
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
              </div>
              <div className="my-2">
                <label htmlFor="manufacturer_id" className="block"><span>Manufacturer</span></label>
                <select id="manufacturer_id" value={values.manufacturer_id} onChange={handleChange} className="select">
                  <option value="0">(no private ownership)</option>
                { manufacturers.map((m) => (<option key={m.id} value={m.id}>{m.name}</option>)) }
                </select>
              </div>
              <div className="my-2">
                <label htmlFor="rental_cost" className="block"><span>Rental cost (per hour)</span></label>
                <input id="rental_cost" value={values.rental_cost} onChange={handleChange} type="text" className="input" />
                {errors.rental_cost && <div className="text-sm text-red-500">{errors.rental_cost}</div>}
              </div>
              <div className="my-2">
                <label htmlFor="hq" className="block"><span>HQ</span></label>
                <input id="hq" value={values.hq} onChange={handleChange} type="text" className="input" />
                {errors.hq && <div className="text-sm text-red-500">{errors.hq}</div>}
              </div>
              <div className="my-2">
                <label htmlFor="new_price" className="block"><span>New price</span></label>
                <input id="new_price" value={values.new_price} onChange={handleChange} type="text" className="input" />
                {errors.new_price && <div className="text-sm text-red-500">{errors.new_price}</div>}
              </div>
              <div className="my-2">
                <label htmlFor="used_low_price" className="block"><span>Used low price</span></label>
                <input id="used_low_price" value={values.used_low_price} onChange={handleChange} type="text" className="input" />
                {errors.used_low_price && <div className="text-sm text-red-500">{errors.used_low_price}</div>}
              </div>
              <div className="my-2">
                <label htmlFor="used_high_price" className="block"><span>Used high price</span></label>
                <input id="used_high_price" value={values.used_high_price} onChange={handleChange} type="text" className="input" />
                {errors.used_high_price && <div className="text-sm text-red-500">{errors.used_high_price}</div>}
              </div>
            </div>
          </div>
        </form>
      </Card>
    </div>
  )
}

FleetEdit.layout = page => <AppLayout children={page} title="Admin - Edit Fleet" heading="Edit Fleet" />

export default FleetEdit
