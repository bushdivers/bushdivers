import React, { useState } from 'react'
import PageTitle from '../../Shared/Navigation/PageTitle'
import { usePage } from '@inertiajs/inertia-react'
import { Inertia } from '@inertiajs/inertia'
import AppLayout from '../../Shared/AppLayout'

const FleetEdit = ({ fleet }) => {
  const { errors } = usePage().props
  const [values, setValues] = useState({
    type: fleet.type,
    name: fleet.name,
    manufacturer: fleet.manufacturer,
    powerplants: fleet.powerplants,
    engines: fleet.number_of_engines,
    fuel: fleet.fuel_type,
    zfw: fleet.zfw,
    mtow: fleet.mtow,
    cargo: fleet.cargo_capacity,
    pax: fleet.pax_capacity,
    fuelCapacity: fleet.fuel_capacity,
    ceiling: fleet.service_ceiling,
    range: fleet.range,
    cruise: fleet.cruise_speed,
    size: fleet.size
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
    Inertia.post(`/admin/fleet/edit/${fleet.id}`, values)
  }

  return (
    <div className="p-4">
      <PageTitle title="Edit Fleet" />
      <div className="lg:w-1/2 bg-white mt-2 p-4 rounded shadow">
        <form onSubmit={handleSubmit}>
          <div className="my-2">
            <label htmlFor="type" className="block"><span className="text-gray-700">ICAO type</span></label>
            <input id="type" value={values.type} onChange={handleChange} type="text" className="form-input form" />
            {errors.type && <div className="text-sm text-red-500">{errors.type}</div>}
          </div>
          <div className="my-2">
            <label htmlFor="name" className="block"><span className="text-gray-700">Model name</span></label>
            <input id="name" value={values.name} onChange={handleChange} type="text" className="form-input form" />
            {errors.name && <div className="text-sm text-red-500">{errors.name}</div>}
          </div>
          <div className="my-2">
            <label htmlFor="manufacturer" className="block"><span className="text-gray-700">Manufacturer</span></label>
            <input id="manufacturer" value={values.manufacturer} onChange={handleChange} type="text" className="form-input form" />
            {errors.manufacturer && <div className="text-sm text-red-500">{errors.manufacturer}</div>}
          </div>
          <div className="my-2">
            <label htmlFor="powerplants" className="block"><span className="text-gray-700">Engine type</span></label>
            <input id="powerplants" value={values.powerplants} onChange={handleChange} type="text" className="form-input form" />
            {errors.powerplants && <div className="text-sm text-red-500">{errors.powerplants}</div>}
          </div>
          <div className="my-2">
            <label htmlFor="engines" className="block"><span className="text-gray-700">Number of engines</span></label>
            <input id="engines" value={values.engines} onChange={handleChange} type="text" className="form-input form" />
            {errors.engines && <div className="text-sm text-red-500">{errors.engines}</div>}
          </div>
          <div className="my-2">
            <label htmlFor="fuel" className="block"><span className="text-gray-700">Fuel type</span></label>
            <select id="fuel" value={values.fuel} onChange={handleChange} className="form-select form">
              <option value="1">Avgas (100LL)</option>
              <option value="2">Jet Fuel</option>
            </select>
          </div>
          <div className="my-2">
            <label htmlFor="zfw" className="block"><span className="text-gray-700">Zero fuel weight / empty weight (lbs)</span></label>
            <input id="zfw" value={values.zfw} onChange={handleChange} type="text" className="form-input form" />
            {errors.zfw && <div className="text-sm text-red-500">{errors.zfw}</div>}
          </div>
          <div className="my-2">
            <label htmlFor="mtow" className="block"><span className="text-gray-700">MTOW (lbs)</span></label>
            <input id="mtow" value={values.mtow} onChange={handleChange} type="text" className="form-input form" />
            {errors.mtow && <div className="text-sm text-red-500">{errors.mtow}</div>}
          </div>
          <div className="my-2">
            <label htmlFor="cargo" className="block"><span className="text-gray-700">Cargo capacity (lbs)</span></label>
            <input id="cargo" value={values.cargo} onChange={handleChange} type="text" className="form-input form" />
            {errors.cargo && <div className="text-sm text-red-500">{errors.cargo}</div>}
          </div>
          <div className="my-2">
            <label htmlFor="pax" className="block"><span className="text-gray-700">Passenger capacity</span></label>
            <input id="pax" value={values.pax} onChange={handleChange} type="text" className="form-input form" />
            {errors.pax && <div className="text-sm text-red-500">{errors.pax}</div>}
          </div>
          <div className="my-2">
            <label htmlFor="fuelCapacity" className="block"><span className="text-gray-700">Fuel capacity (gal)</span></label>
            <input id="fuelCapacity" value={values.fuelCapacity} onChange={handleChange} type="text" className="form-input form" />
            {errors.fuelCapacity && <div className="text-sm text-red-500">{errors.fuelCapacity}</div>}
          </div>
          <div className="my-2">
            <label htmlFor="ceiling" className="block"><span className="text-gray-700">Service ceiling (ft)</span></label>
            <input id="ceiling" value={values.ceiling} onChange={handleChange} type="text" className="form-input form" />
            {errors.ceiling && <div className="text-sm text-red-500">{errors.ceiling}</div>}
          </div>
          <div className="my-2">
            <label htmlFor="range" className="block"><span className="text-gray-700">Range (nm)</span></label>
            <input id="range" value={values.range} onChange={handleChange} type="text" className="form-input form" />
            {errors.range && <div className="text-sm text-red-500">{errors.range}</div>}
          </div>
          <div className="my-2">
            <label htmlFor="cruise" className="block"><span className="text-gray-700">Cruise speed (kts)</span></label>
            <input id="cruise" value={values.cruise} onChange={handleChange} type="text" className="form-input form" />
            {errors.cruise && <div className="text-sm text-red-500">{errors.cruise}</div>}
          </div>
          <div className="my-2">
            <label htmlFor="size" className="block"><span className="text-gray-700">Size</span></label>
            <select id="size" value={values.size} onChange={handleChange} className="form-select form">
              <option value="S">Small</option>
              <option value="M">Medium</option>
              <option value="L">Large</option>
            </select>
          </div>
          <button className="btn btn-primary">Save Fleet</button>
        </form>
      </div>
    </div>
  )
}

FleetEdit.layout = page => <AppLayout children={page} title="Admin - Edit Fleet" heading="Edit Fleet" />

export default FleetEdit
