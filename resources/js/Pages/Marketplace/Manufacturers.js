import React from 'react'
import AppLayout from '../../Shared/AppLayout'
import { Inertia } from '@inertiajs/inertia'

const Manufacturers = ({ manufacturers }) => {

  const selectManufacturer = (manufacturer) => {
    Inertia.get(`marketplace/${manufacturer}`)
  }

  return (
    <div className="p-4">
      <p>Select a manufacturer:</p>
      <div className="flex flex-wrap justify-start mt-4">
        {manufacturers && manufacturers.map((man) => (
          <div onClick={() => selectManufacturer(man.manufacturer)} key={man.manufacturer} className="bg-white rounded shadow p-4 m-2 w-1/4 cursor-pointer">
            <div className="text-lg">{man.manufacturer}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

Manufacturers.layout = page => <AppLayout children={page} title="Marketplace" heading="Marketplace" />

export default Manufacturers
