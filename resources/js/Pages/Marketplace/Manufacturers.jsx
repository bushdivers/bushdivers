import React from 'react'
import AppLayout from '../../Shared/AppLayout'
import { Inertia } from '@inertiajs/inertia'
import Card from '../../Shared/Elements/Card'

const Manufacturers = ({ manufacturers }) => {
  const selectManufacturer = (manufacturer) => {
    Inertia.get(`marketplace/${manufacturer}`)
  }

  return (
    <div className="p-4">
      <p>Select a manufacturer:</p>
      <div className="flex flex-wrap justify-start mt-4">
        {manufacturers && manufacturers.map((man) => (
          <div onClick={() => selectManufacturer(man.id)} key={man.id} className="m-2 w-1/4 cursor-pointer flex items-center align-center justify-center">
            <Card center>
              {man.logo_url && <img src={man.logo_url} width="200"/>}
              {!man.logo_url && man.name}
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}

Manufacturers.layout = page => <AppLayout children={page} title="Marketplace" heading="Marketplace" />

export default Manufacturers
